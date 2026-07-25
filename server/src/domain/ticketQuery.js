const ACTIVE_FILTER = { deletedAt: null };

const ALLOWED_SORT_FIELDS = new Set(['title', 'status', 'priority', 'createdAt', 'updatedAt']);

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const escapeTextSearch = (value) => value.replace(/["\\-]/g, (match) => `\\${match}`);

const isTextSearchQuery = (value) => /^[\w\s]+$/.test(value);

export const buildTicketListFilter = ({ search, status, priority } = {}) => {
  const filter = { ...ACTIVE_FILTER };

  if (status) {
    filter.status = status;
  }

  if (priority) {
    filter.priority = priority;
  }

  const trimmedSearch = search?.trim();
  if (!trimmedSearch) {
    return { filter, useTextSearch: false };
  }

  if (isTextSearchQuery(trimmedSearch)) {
    filter.$text = { $search: escapeTextSearch(trimmedSearch) };
    return { filter, useTextSearch: true };
  }

  const pattern = new RegExp(escapeRegex(trimmedSearch), 'i');
  filter.$or = [{ title: pattern }, { description: pattern }];
  return { filter, useTextSearch: false };
};

export const buildTicketListSort = (useTextSearch, { sortBy, sortOrder } = {}) => {
  const direction = sortOrder === 'asc' ? 1 : -1;
  const field = ALLOWED_SORT_FIELDS.has(sortBy) ? sortBy : 'createdAt';

  // Explicit user sort takes precedence over text relevance ranking.
  if (sortBy && ALLOWED_SORT_FIELDS.has(sortBy)) {
    return { [field]: direction };
  }

  if (useTextSearch) {
    return { score: { $meta: 'textScore' }, createdAt: -1 };
  }

  return { createdAt: -1 };
};

export { ALLOWED_SORT_FIELDS };
