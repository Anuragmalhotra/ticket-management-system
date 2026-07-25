import { buildTicketListFilter, buildTicketListSort } from '../../src/domain/ticketQuery.js';

describe('ticketQuery', () => {
  describe('buildTicketListFilter', () => {
    it('always excludes soft-deleted tickets', () => {
      const { filter } = buildTicketListFilter();
      expect(filter.deletedAt).toBeNull();
    });

    it('combines status and keyword search filters', () => {
      const { filter, useTextSearch } = buildTicketListFilter({
        status: 'open',
        search: 'login issue',
      });

      expect(filter.status).toBe('open');
      expect(filter.$text).toEqual({ $search: 'login issue' });
      expect(useTextSearch).toBe(true);
    });

    it('filters by priority', () => {
      const { filter } = buildTicketListFilter({ priority: 'high' });
      expect(filter.priority).toBe('high');
    });

    it('uses case-insensitive regex fallback for special characters', () => {
      const { filter, useTextSearch } = buildTicketListFilter({
        search: 'login+api',
      });

      expect(filter.$or).toHaveLength(2);
      expect(filter.$or[0].title).toEqual(/login\+api/i);
      expect(useTextSearch).toBe(false);
    });
  });

  describe('buildTicketListSort', () => {
    it('sorts by relevance when text search is used', () => {
      expect(buildTicketListSort(true)).toEqual({
        score: { $meta: 'textScore' },
        createdAt: -1,
      });
    });

    it('sorts by createdAt when text search is not used', () => {
      expect(buildTicketListSort(false)).toEqual({ createdAt: -1 });
    });

    it('applies explicit sortBy and sortOrder', () => {
      expect(buildTicketListSort(false, { sortBy: 'title', sortOrder: 'asc' })).toEqual({
        title: 1,
      });
      expect(buildTicketListSort(true, { sortBy: 'priority', sortOrder: 'desc' })).toEqual({
        priority: -1,
      });
    });

    it('falls back to createdAt for unknown sort fields', () => {
      expect(buildTicketListSort(false, { sortBy: 'assignee', sortOrder: 'asc' })).toEqual({
        createdAt: -1,
      });
    });
  });
});
