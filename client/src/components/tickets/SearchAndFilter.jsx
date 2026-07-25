import SearchBar from '../common/SearchBar.jsx';
import StatusFilter from '../common/StatusFilter.jsx';
import { TICKET_PRIORITIES, PRIORITY_LABELS } from '../../constants/ticketStatus.js';

const SearchAndFilter = ({
  search,
  status,
  priority,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
}) => {
  return (
    <div className="search-and-filter">
      <SearchBar value={search} onChange={onSearchChange} />
      <StatusFilter value={status} onChange={onStatusChange} />
      <select
        className="priority-filter"
        value={priority}
        onChange={(event) => onPriorityChange(event.target.value)}
        aria-label="Filter by priority"
      >
        <option value="">All priorities</option>
        {TICKET_PRIORITIES.map((value) => (
          <option key={value} value={value}>
            {PRIORITY_LABELS[value]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchAndFilter;
