import { React } from 'mailspring-exports';
import * as Settings from './settings';

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
  return (
    <div className="item" style={disabled ? { opacity: 0.5 } : undefined}>
      <input
        id={option.key}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => Settings.set(option.key, e.target.checked)}
      />
      <label htmlFor={option.key}>{option.title}</label>
      <div className="platform-note">{option.note}</div>
    </div>
  );
}

export default class WJTweaksPreferences extends React.Component {
  static displayName = 'WJTweaksPreferences';

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
    return (
      <div className="container-wj-tweaks">
        <section>
          <h6>General</h6>
          <Option option={MASTER} checked={enabled} />
        </section>
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h6>{section.title}</h6>
            {section.options.map((opt) => (
              <Option key={opt.key} option={opt} checked={this.state[opt.key]} disabled={!enabled} />
            ))}
          </section>
        ))}
      </div>
    );
  }
}
