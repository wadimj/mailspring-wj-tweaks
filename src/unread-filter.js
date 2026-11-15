// "Unread only" filter for the thread list.
//
// ThreadListStore builds the list from FocusedPerspectiveStore.current().threads()
// in createListDataSource(). While the filter is on we wrap that call and add an
// "unread" condition to the perspective's query. Threads read while the filter
// is on stay in the list (like Mailspring's own Unread view), so opening one
// doesn't make it vanish from under you; they drop out when the list reloads.
import {
  Actions,
  ChangeUnreadTask,
  FocusedPerspectiveStore,
  Matcher,
  MutableQuerySubscription,
  Thread,
} from 'mailspring-exports';
import MailspringStore from 'mailspring-store';
import { ThreadListStore } from './internals';

class UnreadOnlySubscription extends MutableQuerySubscription {
  constructor(baseQuery, options) {
    super(UnreadOnlySubscription.build(baseQuery, []), options);
    this._baseQuery = baseQuery;
    this._recentlyReadIds = [];
    this._unlisteners = [
      Actions.queueTask.listen((task) => this._onTasksQueued([task])),
      Actions.queueTasks.listen((tasks) => this._onTasksQueued(tasks)),
    ];
  }

  static build(baseQuery, recentlyReadIds) {
    const unread = Thread.attributes.unread.equal(true);
    return baseQuery
      .clone()
      .where(
        recentlyReadIds.length
          ? new Matcher.Or([unread, Thread.attributes.id.in(recentlyReadIds)])
          : unread
      );
  }

  _onTasksQueued(tasks) {
    const ids = new Set(this._recentlyReadIds);
    for (const task of tasks) {
      if (task instanceof ChangeUnreadTask && !task.unread) {
        (task.threadIds || []).forEach((id) => ids.add(id));
      }
    }
    if (ids.size === this._recentlyReadIds.length) return;
    this._recentlyReadIds = [...ids];
    const { limit, offset } = this._query.range();
    this._query = UnreadOnlySubscription.build(this._baseQuery, this._recentlyReadIds)
      .limit(limit)
      .offset(offset);
  }

  onLastCallbackRemoved() {
    this._unlisteners.forEach((unlisten) => unlisten());
    if (super.onLastCallbackRemoved) super.onLastCallbackRemoved();
  }
}

function unreadOnly(subscription) {
  // Search results and other special lists don't use a plain query; leave them.
  if (!subscription || !(subscription instanceof MutableQuerySubscription) || !subscription._query) {
    return subscription;
  }
  return new UnreadOnlySubscription(subscription._query, subscription._options || {});
}

class UnreadFilterStore extends MailspringStore {
  constructor() {
    super();
    this._active = false;
    this._originalCreate = null;
  }

  isActive() {
    return this._active;
  }

  install() {
    const store = ThreadListStore();
    if (!store || this._originalCreate) return;
    this._originalCreate = store.createListDataSource;
    const original = this._originalCreate;
    store.createListDataSource = () => {
      const perspective = FocusedPerspectiveStore.current();
      if (!this._active || !perspective || perspective.unread) {
        return original();
      }
      const hadOwn = Object.prototype.hasOwnProperty.call(perspective, 'threads');
      const ownThreads = perspective.threads;
      perspective.threads = function () {
        return unreadOnly(ownThreads.call(this));
      };
      try {
        return original();
      } finally {
        if (hadOwn) perspective.threads = ownThreads;
        else delete perspective.threads;
      }
    };
  }

  uninstall() {
    const store = ThreadListStore();
    const wasActive = this._active;
    this._active = false;
    if (store && this._originalCreate) {
      store.createListDataSource = this._originalCreate;
      this._originalCreate = null;
      if (wasActive) store.createListDataSource();
    }
    this.trigger();
  }

  toggle() {
    const store = ThreadListStore();
    if (!store || !this._originalCreate) return;
    this._active = !this._active;
    store.createListDataSource();
    this.trigger();
  }
}

export default new UnreadFilterStore();
