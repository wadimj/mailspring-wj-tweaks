"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.install = install;
exports.uninstall = uninstall;
// Sidebar tweaks:
// - unread counts next to account names: each account's heading gets the sum of
//   its folder/label counts, the top heading the inbox total;
// - account colour bars on the per-account rows under Inbox, Sent, etc.;
// - folder/label icons tinted with the label's colour;
// - Mailspring's own "Mailspring" folder is hidden from the label lists (optional).
//
// The sidebar builds its sections with SidebarSection's static factories and
// renders each section's heading with OutlineView. We tag the account sections
// with a count and teach OutlineView's heading to draw it. SidebarStore already
// rebuilds the sections whenever ThreadCountsStore changes, so counts stay live.
const mailspring_exports_1 = require("mailspring-exports");
const mailspring_component_kit_1 = require("mailspring-component-kit");
const internals_1 = require("./internals");
const Settings = __importStar(require("./settings"));
const COUNT_PROP = 'gmailUnreadCount';
function inboxUnread(account) {
    const inbox = account && mailspring_exports_1.CategoryStore.getInboxCategory(account);
    return inbox ? mailspring_exports_1.ThreadCountsStore.unreadCountForCategoryId(inbox.id) || 0 : 0;
}
// Adds up the numbers shown next to the account's folders/labels. A thread
// with several labels counts once per label, just like in the list below.
function labelsUnread(account) {
    return visibleUserCategories(account).reduce((sum, cat) => sum + (mailspring_exports_1.ThreadCountsStore.unreadCountForCategoryId(cat.id) || 0), 0);
}
// Mailspring's own "Mailspring" folder (it holds Snoozed, which already has its
// own sidebar entry) is hidden from each account's folder/label list, unless
// turned off in Preferences → WJ Tweaks.
const isHiddenCategory = (cat) => !!cat && cat.path === 'Mailspring' && Settings.get(Settings.KEYS.hideMailspringFolder);
function visibleUserCategories(account) {
    return mailspring_exports_1.CategoryStore.userCategories(account).filter((cat) => !isHiddenCategory(cat));
}
function withoutHiddenItems(section) {
    if (!section || !Array.isArray(section.items))
        return section;
    const items = section.items.filter((item) => {
        const cat = item.perspective && item.perspective.category && item.perspective.category();
        return !isHiddenCategory(cat);
    });
    return Object.assign(Object.assign({}, section), { items });
}
// "All Accounts" rows like Inbox expand into one row per account. Give those
// rows the account's colour bar, like the account section headings below.
const accountClass = (id) => `gmail-account-${String(id).replace(/[^\w-]/g, '_')}`;
function withAccountColors(section) {
    if (!section || !Array.isArray(section.items))
        return section;
    const items = section.items.map((item) => {
        if (!item.children || !item.children.length)
            return item;
        const children = item.children.map((child) => {
            const ids = child.perspective && child.perspective.accountIds;
            if (!ids || ids.length !== 1)
                return child;
            const className = [child.className, 'gmail-account-row', accountClass(ids[0])]
                .filter(Boolean)
                .join(' ');
            return Object.assign(Object.assign({}, child), { className });
        });
        return Object.assign(Object.assign({}, item), { children });
    });
    return Object.assign(Object.assign({}, section), { items });
}
// Folder/label rows get their tag icon tinted with the label's colour, the same
// hue Mailspring uses for the label pills in the thread list.
const labelClass = (id) => `gmail-label-${String(id).replace(/[^\w-]/g, '_')}`;
function categoryOf(item) {
    return item.perspective && item.perspective.category && item.perspective.category();
}
function withLabelColorItems(items) {
    return items.map((item) => {
        const cat = categoryOf(item);
        const children = item.children && item.children.length ? withLabelColorItems(item.children) : item.children;
        if (!cat)
            return Object.assign(Object.assign({}, item), { children });
        const className = [item.className, 'gmail-label-row', labelClass(cat.id)].filter(Boolean).join(' ');
        return Object.assign(Object.assign({}, item), { className, children });
    });
}
function withLabelColors(section) {
    if (!section || !Array.isArray(section.items))
        return section;
    return Object.assign(Object.assign({}, section), { items: withLabelColorItems(section.items) });
}
const labelColor = (cat) => `hsl(${cat.hue()}, 62%, 47%)`;
let colorStyle = null;
const unlisteners = [];
function writeColors() {
    if (!colorStyle)
        return;
    const accountRules = mailspring_exports_1.AccountStore.accounts()
        .filter((acc) => acc.color)
        .map((acc) => `.gmail-account-row.${accountClass(acc.id)} .name::before { background: ${acc.color}; }`);
    const labelRules = mailspring_exports_1.AccountStore.accounts()
        .flatMap((acc) => mailspring_exports_1.CategoryStore.userCategories(acc))
        .filter((cat) => typeof cat.hue === 'function')
        .map((cat) => `.account-sidebar .item.gmail-label-row.${labelClass(cat.id)}:not(.selected) .icon img.content-mask { background-color: ${labelColor(cat)}; }`);
    colorStyle.textContent = [...accountRules, ...labelRules].join('\n');
}
function withCount(section, count) {
    return section ? Object.assign(Object.assign({}, section), { [COUNT_PROP]: count }) : section;
}
const originals = {};
function rebuildSidebar() {
    const store = (0, internals_1.SidebarStore)();
    if (store && typeof store._updateSections === 'function')
        store._updateSections();
}
function install() {
    const Section = (0, internals_1.SidebarSection)();
    const proto = mailspring_component_kit_1.OutlineView && mailspring_component_kit_1.OutlineView.prototype;
    if (!Section || !proto || originals.heading)
        return false;
    originals.forUserCategories = Section.forUserCategories;
    originals.standardSectionForAccounts = Section.standardSectionForAccounts;
    originals.heading = proto._renderHeading;
    // Multiple accounts: each account gets a section titled with its name.
    Section.forUserCategories = function (account, opts = {}) {
        const section = withLabelColors(withoutHiddenItems(originals.forUserCategories.call(this, account, opts)));
        return opts.title ? withCount(section, labelsUnread(account)) : section;
    };
    // The top section is titled with the account's name (one account) or
    // "All Accounts"; show the unread inbox total, matching its Inbox row.
    Section.standardSectionForAccounts = function (accounts) {
        const section = withAccountColors(originals.standardSectionForAccounts.call(this, accounts));
        const count = (accounts || []).reduce((sum, acc) => sum + inboxUnread(acc), 0);
        return withCount(section, count);
    };
    proto._renderHeading = function (...args) {
        const heading = originals.heading.apply(this, args);
        const count = this.props[COUNT_PROP];
        if (!count || !heading)
            return heading;
        const [text, ...rest] = mailspring_exports_1.React.Children.toArray(heading.props.children);
        return mailspring_exports_1.React.cloneElement(heading, {}, text, mailspring_exports_1.React.createElement("span", { key: "gmail-unread", className: "gmail-checkbox-account-count", title: `${count} unread` }, count.toLocaleString()), ...rest);
    };
    colorStyle = document.createElement('style');
    colorStyle.id = 'gmail-checkbox-account-colors';
    document.head.appendChild(colorStyle);
    writeColors();
    unlisteners.push(mailspring_exports_1.AccountStore.listen(writeColors), mailspring_exports_1.CategoryStore.listen(writeColors));
    const settingSub = Settings.onChange(Settings.KEYS.hideMailspringFolder, rebuildSidebar);
    unlisteners.push(() => settingSub.dispose());
    rebuildSidebar();
    return true;
}
function uninstall() {
    const Section = (0, internals_1.SidebarSection)();
    if (Section && originals.forUserCategories) {
        Section.forUserCategories = originals.forUserCategories;
        Section.standardSectionForAccounts = originals.standardSectionForAccounts;
    }
    if (mailspring_component_kit_1.OutlineView && originals.heading)
        mailspring_component_kit_1.OutlineView.prototype._renderHeading = originals.heading;
    Object.keys(originals).forEach((k) => delete originals[k]);
    unlisteners.splice(0).forEach((unlisten) => unlisten());
    if (colorStyle)
        colorStyle.remove();
    colorStyle = null;
    rebuildSidebar();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lkZWJhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zaWRlYmFyLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQThIQSwwQkFtREM7QUFFRCw4QkFZQztBQS9MRCxrQkFBa0I7QUFDbEIsZ0ZBQWdGO0FBQ2hGLDhEQUE4RDtBQUM5RCx5RUFBeUU7QUFDekUsdURBQXVEO0FBQ3ZELG9GQUFvRjtBQUNwRixFQUFFO0FBQ0YsNkVBQTZFO0FBQzdFLCtFQUErRTtBQUMvRSxnRkFBZ0Y7QUFDaEYsaUZBQWlGO0FBQ2pGLDJEQUEyRjtBQUMzRix1RUFBdUQ7QUFDdkQsMkNBQTJEO0FBQzNELHFEQUF1QztBQUV2QyxNQUFNLFVBQVUsR0FBRyxrQkFBa0IsQ0FBQztBQUV0QyxTQUFTLFdBQVcsQ0FBQyxPQUFPO0lBQzFCLE1BQU0sS0FBSyxHQUFHLE9BQU8sSUFBSSxrQ0FBYSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2pFLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxzQ0FBaUIsQ0FBQyx3QkFBd0IsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0UsQ0FBQztBQUVELDJFQUEyRTtBQUMzRSwwRUFBMEU7QUFDMUUsU0FBUyxZQUFZLENBQUMsT0FBTztJQUMzQixPQUFPLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FDMUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxzQ0FBaUIsQ0FBQyx3QkFBd0IsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQzdFLENBQUMsQ0FDRixDQUFDO0FBQ0osQ0FBQztBQUVELGdGQUFnRjtBQUNoRiw2RUFBNkU7QUFDN0UseUNBQXlDO0FBQ3pDLE1BQU0sZ0JBQWdC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