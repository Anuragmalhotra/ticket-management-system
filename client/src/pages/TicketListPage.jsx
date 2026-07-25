import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader.jsx';
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx';
import ErrorAlert from '../components/common/ErrorAlert.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import SearchAndFilter from '../components/tickets/SearchAndFilter.jsx';
import ActiveFilters from '../components/tickets/ActiveFilters.jsx';
import TicketTable from '../components/tickets/TicketTable.jsx';
import { useTickets, useDebounce } from '../hooks/index.js';

const DEFAULT_SORT_BY = 'createdAt';
const DEFAULT_SORT_ORDER = 'desc';

const TicketListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const status = searchParams.get('status') || '';
  const priority = searchParams.get('priority') || '';
  const sortBy = searchParams.get('sortBy') || DEFAULT_SORT_BY;
  const sortOrder = searchParams.get('sortOrder') || DEFAULT_SORT_ORDER;
  const debouncedSearch = useDebounce(search);

  const { tickets, total, loading, error, refetch } = useTickets({
    search: debouncedSearch,
    status,
    priority,
    sortBy,
    sortOrder,
  });

  const syncParams = ({
    nextSearch = debouncedSearch,
    nextStatus = status,
    nextPriority = priority,
    nextSortBy = sortBy,
    nextSortOrder = sortOrder,
  } = {}) => {
    const params = new URLSearchParams();
    if (nextSearch) params.set('search', nextSearch);
    if (nextStatus) params.set('status', nextStatus);
    if (nextPriority) params.set('priority', nextPriority);

    const isDefaultSort =
      nextSortBy === DEFAULT_SORT_BY && nextSortOrder === DEFAULT_SORT_ORDER;
    if (!isDefaultSort) {
      params.set('sortBy', nextSortBy);
      params.set('sortOrder', nextSortOrder);
    }

    return params;
  };

  useEffect(() => {
    setSearchParams(syncParams(), { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync URL from filter/sort state only
  }, [debouncedSearch, status, priority, sortBy, sortOrder, setSearchParams]);

  const handleSearchChange = (value) => {
    setSearch(value);
  };

  const handleStatusChange = (value) => {
    setSearchParams(syncParams({ nextStatus: value }));
  };

  const handlePriorityChange = (value) => {
    setSearchParams(syncParams({ nextPriority: value }));
  };

  const handleSortChange = (nextSortBy, nextSortOrder) => {
    setSearchParams(syncParams({ nextSortBy, nextSortOrder }));
  };

  const handleRemoveFilter = (key) => {
    if (key === 'search') {
      setSearch('');
      setSearchParams(syncParams({ nextSearch: '' }));
      return;
    }
    if (key === 'status') {
      setSearchParams(syncParams({ nextStatus: '' }));
      return;
    }
    if (key === 'priority') {
      setSearchParams(syncParams({ nextPriority: '' }));
      return;
    }
    if (key === 'sort') {
      setSearchParams(
        syncParams({
          nextSortBy: DEFAULT_SORT_BY,
          nextSortOrder: DEFAULT_SORT_ORDER,
        }),
      );
    }
  };

  const clearFilters = () => {
    setSearch('');
    setSearchParams({});
  };

  const hasCustomSort =
    sortBy !== DEFAULT_SORT_BY || sortOrder !== DEFAULT_SORT_ORDER;
  const hasActiveFilters = Boolean(debouncedSearch || status || priority || hasCustomSort);

  return (
    <div className="ticket-list-page">
      <PageHeader title="Tickets">
        <button type="button" className="button button--primary" onClick={() => navigate('/tickets/new')}>
          + Create Ticket
        </button>
      </PageHeader>

      <SearchAndFilter
        search={search}
        status={status}
        priority={priority}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
      />

      <ActiveFilters
        search={debouncedSearch}
        status={status}
        priority={priority}
        sortBy={hasCustomSort ? sortBy : ''}
        sortOrder={sortOrder}
        onRemove={handleRemoveFilter}
        onClearAll={clearFilters}
      />

      {error && <ErrorAlert message={error} onRetry={refetch} />}

      <p className="ticket-list-page__count">
        Showing {tickets.length} of {total} tickets
        {hasActiveFilters ? ' (filtered)' : ''}
      </p>

      {loading ? (
        <LoadingSkeleton variant="table" />
      ) : tickets.length === 0 ? (
        <EmptyState
          title="No tickets found"
          message="Try adjusting your search or filters."
          actionLabel="Clear Filters"
          onAction={clearFilters}
        />
      ) : (
        <TicketTable
          tickets={tickets}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          onRowClick={(ticketId) => navigate(`/tickets/${ticketId}`)}
        />
      )}
    </div>
  );
};

export default TicketListPage;
