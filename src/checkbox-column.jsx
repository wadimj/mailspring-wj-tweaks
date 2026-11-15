import { React, localized } from 'mailspring-exports';
import { ListTabular } from 'mailspring-component-kit';
import { toggleThread } from './selection';

export const COLUMN_NAME = 'GmailCheckbox';

function ThreadCheckbox({ thread }) {
  const onClick = (event) => {
    // Keep the click away from the row, whose handler would open the thread
    // (and mark it as read).
    event.stopPropagation();
    event.preventDefault();
    toggleThread(thread, { range: event.shiftKey });
  };
  const swallow = (event) => event.stopPropagation();
  const onKeyDown = (event) => {
    if (event.key === ' ' || event.key === 'Enter') {
      onClick(event);
    }
  };

  return (
    <div
      className="gmail-checkbox-hit"
      role="button"
      aria-label={localized('Select')}
      tabIndex={-1}
      onClick={onClick}
      onDoubleClick={swallow}
      onKeyDown={onKeyDown}
    >
      <div className="gmail-checkbox" />
    </div>
  );
}

// The list does not re-render cell contents when only the selection changes;
// the checked look comes from the row's `selected` class (see styles), and the
// row itself carries aria-selected.
export const CheckboxColumn = new ListTabular.Column({
  name: COLUMN_NAME,
  width: 34,
  resolver: (thread) => <ThreadCheckbox thread={thread} />,
});
