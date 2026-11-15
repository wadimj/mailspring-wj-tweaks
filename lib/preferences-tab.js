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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZmVyZW5jZXMtdGFiLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3ByZWZlcmVuY2VzLXRhYi5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyREFBMkM7QUFDM0MscURBQXVDO0FBRXZDLE1BQU0sTUFBTSxHQUFHO0lBQ2IsR0FBRyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTztJQUMxQixLQUFLLEVBQUUsa0JBQWtCO0lBQ3pCLElBQUksRUFBRSxxSEFBcUg7Q0FDNUgsQ0FBQztBQUVGLE1BQU0sUUFBUSxHQUFHO0lBQ2Y7UUFDRSxLQUFLLEVBQUUsU0FBUztRQUNoQixPQUFPLEVBQUU7WUFDUDtnQkFDRSxHQUFHLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxvQkFBb0I7Z0JBQ3ZDLEtBQUssRUFBRSw0Q0FBNEM7Z0JBQ25ELElBQUksRUFBRSxrR0FBa0c7YUFDekc7U0FDRjtLQUNGO0NBQ0YsQ0FBQztBQUVGLE1BQU0sUUFBUSxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRXZGLFNBQVMsTUFBTSxDQUFDLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7SUFDM0MsT0FBTyxDQUNMLGtEQUFLLFNBQVMsRUFBQyxNQUFNLEVBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVM7UUFDbEUsb0RBQ0UsRUFBRSxFQUFFLE1BQU0sQ0FBQyxHQUFHLEVBQ2QsSUFBSSxFQUFDLFVBQVUsRUFD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