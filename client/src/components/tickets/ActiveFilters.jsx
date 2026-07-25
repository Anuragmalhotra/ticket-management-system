import { STATUS_LABELS, PRIORITY_LABELS } from '../../constants/ticketStatus.js';

const SORT_LABELS = {
  title: 'Title',
  status: 'Status',
  priority: 'Priority',
  createdAt: 'Created',
  updatedAt: 'Updated',
};

const ActiveFilters = ({ search, status, priority, sortBy, sortOrder, onRemove, onClearAll }) => {
  const chips = [];

  if (search) {
    chips.push({ key: 'search', label: `Search: “${search}”` });
  }
  if (status) {
    chips.push({ key: 'status', label: `Status: ${STATUS_LABELS[status] ?? status}` });
  }
  if (priority) {
    chips.push({ key: 'priority', label: `Priority: ${PRIORITY_LABELS[priority] ?? priority}` });
  }
  if (sortBy) {
    const direction = sortOrder === 'asc' ? '↑' : '↓';
    chips.push({
      key: 'sort',
      label: `Sort: ${SORT_LABELS[sortBy] ?? sortBy} ${direction}`,
    });
  }

  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="active-filters" aria-label="Active filters">
      <span className="active-filters__label">Active filters</span>
      <ul className="active-filters__list">
        {chips.map((chip) => (
          <li key={chip.key}>
            <button
              type="button"
              className="active-filters__chip"
              onClick={() => onRemove(chip.key)}
              aria-label={`Remove ${chip.label}`}
            >
              <span>{chip.label}</span>
              <span className="active-filters__chip-remove" aria-hidden="true">
                ×
              </span>
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className="active-filters__clear" onClick={onClearAll}>
        Clear all
      </button>
    </div>
  );
};

export default ActiveFilters;
