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
const mailspring_exports_1 = require("mailspring-exports");
const Settings = __importStar(require("./settings"));
const MASTER = {
    key: Settings.KEYS.enabled,
    title: 'Enable WJ Tweaks',
    note: 'Turns all of the tweaks on or off: thread checkboxes and bulk toolbar, sidebar changes and the hidden Pro reminder.',
};
const SECTIONS = [
    {
        title: 'Sidebar',
        options: [
            {
                key: Settings.KEYS.hideMailspringFolder,
                title: 'Hide the "Mailspring" label in the sidebar',
                note: 'Mailspring creates this folder for snoozed mail. Snoozed messages stay under Snoozed either way.',
            },
        ],
    },
];
const ALL_KEYS = [MASTER.key, ...SECTIONS.flatMap((s) => s.options.map((o) => o.key))];
function Option({ option, checked, disabled }) {
    return (mailspring_exports_1.React.createElement("div", { className: "item", style: disabled ? { opacity: 0.5 } : undefined },
        mailspring_exports_1.React.createElement("input", { id: option.key, type: "checkbox", checked: checked, disabled: disabled, onChange: (e) => Settings.set(option.key, e.target.checked) }),
        mailspring_exports_1.React.createElement("label", { htmlFor: option.key }, option.title),
        mailspring_exports_1.React.createElement("div", { className: "platform-note" }, option.note)));
}
class WJTweaksPreferences extends mailspring_exports_1.React.Component {
    constructor(props) {
        super(props);
        this.state = this._read();
    }
    componentDidMount() {
        this._subs = ALL_KEYS.map((key) => Settings.onChange(key, () => this.setState(this._read())));
    }
    componentWillUnmount() {
        (this._subs || []).forEach((sub) => sub && sub.dispose && sub.dispose());
    }
    _read() {
        const state = {};
        ALL_KEYS.forEach((key) => {
            state[key] = !!Settings.get(key);
        });
        return state;
    }
    render() {
        const enabled = this.state[MASTER.key];
        return (mailspring_exports_1.React.createElement("div", { className: "container-wj-tweaks" },
            mailspring_exports_1.React.createElement("section", null,
                mailspring_exports_1.React.createElement("h6", null, "General"),
                mailspring_exports_1.React.createElement(Option, { option: MASTER, checked: enabled })),
            SECTIONS.map((section) => (mailspring_exports_1.React.createElement("section", { key: section.title },
                mailspring_exports_1.React.createElement("h6", null, section.title),
                section.options.map((opt) => (mailspring_exports_1.React.createElement(Option, { key: opt.key, option: opt, checked: this.state[opt.key], disabled: !enabled }))))))));
    }
}
WJTweaksPreferences.displayName = 'WJTweaksPreferences';
exports.default = WJTweaksPreferences;
