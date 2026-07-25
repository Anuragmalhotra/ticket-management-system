import TicketRow from './TicketRow.jsx';

const COLUMNS = [
  { key: 'title', label: 'Title', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'priority', label: 'Priority', sortable: true },
  { key: 'assignee', label: 'Assignee', sortable: false },
  { key: 'createdAt', label: 'Created', sortable: true },
];

const SortIcon = ({ active, sortOrder }) => {
  if (!active) {
    return <span className="ticket-table__sort-icon ticket-table__sort-icon--idle" aria-hidden="true">↕</span>;
  }
  return (
    <span className="ticket-table__sort-icon" aria-hidden="true">
      {sortOrder === 'asc' ? '↑' : '↓'}
    </span>
  );
};

const TicketTable = ({
  tickets = [],
  sortBy = 'createdAt',
  sortOrder = 'desc',
  onSortChange,
  onRowClick,
}) => {
  const handleSort = (columnKey) => {
    if (!onSortChange) return;

    if (sortBy === columnKey) {
      onSortChange(columnKey, sortOrder === 'asc' ? 'desc' : 'asc');
      return;
    }

    onSortChange(columnKey, columnKey === 'title' ? 'asc' : 'desc');
  };

  return (
    <table className="ticket-table">
      <thead>
        <tr>
          {COLUMNS.map((column) => (
            <th
              key={column.key}
              className={column.sortable ? 'ticket-table__th--sortable' : undefined}
              aria-sort={
                column.sortable && sortBy === column.key
                  ? sortOrder === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : column.sortable
                    ? 'none'
                    : undefined
              }
            >
              {column.sortable ? (
                <button
                  type="button"
                  className="ticket-table__sort-button"
                  onClick={() => handleSort(column.key)}
                >
                  {column.label}
                  <SortIcon active={sortBy === column.key} sortOrder={sortOrder} />
                </button>
              ) : (
                column.label
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tickets.map((ticket) => (
          <TicketRow key={ticket._id} ticket={ticket} onClick={onRowClick} />
        ))}
      </tbody>
    </table>
  );
};

export default TicketTable;
