"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// "Unread only" filter for the thread list.
//
// ThreadListStore builds the list from FocusedPerspectiveStore.current().threads()
// in createListDataSource(). While the filter is on we wrap that call and add an
// "unread" condition to the perspective's query. Threads read while the filter
// is on stay in the list (like Mailspring's own Unread view), so opening one
// doesn't make it vanish from under you; they drop out when the list reloads.
const mailspring_exports_1 = require("mailspring-exports");
const mailspring_store_1 = __importDefault(require("mailspring-store"));
const internals_1 = require("./internals");
class UnreadOnlySubscription extends mailspring_exports_1.MutableQuerySubscription {
    constructor(baseQuery, options) {
        super(UnreadOnlySubscription.build(baseQuery, []), options);
        this._baseQuery = baseQuery;
        this._recentlyReadIds = [];
        this._unlisteners = [
            mailspring_exports_1.Actions.queueTask.listen((task) => this._onTasksQueued([task])),
            mailspring_exports_1.Actions.queueTasks.listen((tasks) => this._onTasksQueued(tasks)),
        ];
    }
    static build(baseQuery, recentlyReadIds) {
        const unread = mailspring_exports_1.Thread.attributes.unread.equal(true);
        return baseQuery
            .clone()
            .where(recentlyReadIds.length
            ? new mailspring_exports_1.Matcher.Or([unread, mailspring_exports_1.Thread.attributes.id.in(recentlyReadIds)])
            : unread);
    }
    _onTasksQueued(tasks) {
        const ids = new Set(this._recentlyReadIds);
        for (const task of tasks) {
            if (task instanceof mailspring_exports_1.ChangeUnreadTask && !task.unread) {
                (task.threadIds || []).forEach((id) => ids.add(id));
            }
        }
        if (ids.size === this._recentlyReadIds.length)
            return;
        this._recentlyReadIds = [...ids];
        const { limit, offset } = this._query.range();
        this._query = UnreadOnlySubscription.build(this._baseQuery, this._recentlyReadIds)
            .limit(limit)
            .offset(offset);
    }
    onLastCallbackRemoved() {
        this._unlisteners.forEach((unlisten) => unlisten());
        if (super.onLastCallbackRemoved)
            super.onLastCallbackRemoved();
    }
}
function unreadOnly(subscription) {
    // Search results and other special lists don't use a plain query; leave them.
    if (!subscription || !(subscription instanceof mailspring_exports_1.MutableQuerySubscription) || !subscription._query) {
        return subscription;
    }
    return new UnreadOnlySubscription(subscription._query, subscription._options || {});
}
class UnreadFilterStore extends mailspring_store_1.default {
    constructor() {
        super();
        this._active = false;
        this._originalCreate = null;
    }
    isActive() {
        return this._active;
    }
    install() {
        const store = (0, internals_1.ThreadListStore)();
        if (!store || this._originalCreate)
            return;
        this._originalCreate = store.createListDataSource;
        const original = this._originalCreate;
        store.createListDataSource = () => {
            const perspective = mailspring_exports_1.FocusedPerspectiveStore.current();
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
            }
            finally {
                if (hadOwn)
                    perspective.threads = ownThreads;
                else
                    delete perspective.threads;
            }
        };
    }
    uninstall() {
        const store = (0, internals_1.ThreadListStore)();
        const wasActive = this._active;
        this._active = false;
        if (store && this._originalCreate) {
            store.createListDataSource = this._originalCreate;
            this._originalCreate = null;
            if (wasActive)
                store.createListDataSource();
        }
        this.trigger();
    }
    toggle() {
        const store = (0, internals_1.ThreadListStore)();
        if (!store || !this._originalCreate)
            return;
        this._active = !this._active;
        store.createListDataSource();
        this.trigger();
    }
}
exports.default = new UnreadFilterStore();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5yZWFkLWZpbHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy91bnJlYWQtZmlsdGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNENBQTRDO0FBQzVDLEVBQUU7QUFDRixtRkFBbUY7QUFDbkYsaUZBQWlGO0FBQ2pGLCtFQUErRTtBQUMvRSw2RUFBNkU7QUFDN0UsOEVBQThFO0FBQzlFLDJEQU80QjtBQUM1Qix3RUFBK0M7QUFDL0MsMkNBQThDO0FBRTlDLE1BQU0sc0JBQXVCLFNBQVEsNkNBQXdCO0lBQzNELFlBQVksU0FBUyxFQUFFLE9BQU87UUFDNUIsS0FBSyxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDNUQsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7UUFDNUIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMsWUFBWSxHQUFHO1lBQ2xCLDRCQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDL0QsNEJBQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2pFLENBQUM7SUFDSixDQUFDO0lBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsZUFBZTtRQUNyQyxNQUFNLE1BQU0sR0FBRywyQkFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BELE9BQU8sU0FBUzthQUNiLEtBQUssRUFBRTthQUNQLEtBQUssQ0FDSixlQUFlLENBQUMsTUFBTTtZQUNwQixDQUFDLENBQUMs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