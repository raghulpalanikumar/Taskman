import './TaskFilters.css';

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'work', label: 'Work', color: '#3B82F6' },
  { value: 'personal', label: 'Personal', color: '#10B981' },
  { value: 'shopping', label: 'Shopping', color: '#F59E0B' },
  { value: 'health', label: 'Health', color: '#EF4444' },
  { value: 'education', label: 'Education', color: '#8B5CF6' },
  { value: 'finance', label: 'Finance', color: '#06B6D4' },
  { value: 'other', label: 'Other', color: '#6B7280' }
];

const PRIORITIES = [
  { value: 'all', label: 'All Priorities' },
  { value: 'low', label: 'Low', color: '#10B981' },
  { value: 'medium', label: 'Medium', color: '#F59E0B' },
  { value: 'high', label: 'High', color: '#EF4444' },
  { value: 'urgent', label: 'Urgent', color: '#DC2626' }
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Tasks' },
  { value: 'true', label: 'Completed' },
  { value: 'false', label: 'Pending' }
];

export default function TaskFilters({ filters, onFilterChange, onClearFilters }) {
  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== null && value !== '' && value !== 'all'
  );

  return (
    <div className="task-filters">
      <div className="filters-header">
        <h3>Filters</h3>
        {hasActiveFilters && (
          <button onClick={onClearFilters} className="clear-filters-button">
            Clear All
          </button>
        )}
      </div>

      <div className="filters-grid">
        {/* Search Filter */}
        <div className="filter-group">
          <label htmlFor="search">Search Tasks</label>
          <input
            type="text"
            id="search"
            placeholder="Search by title or description..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-input"
          />
        </div>

        {/* Category Filter */}
        <div className="filter-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={filters.category || 'all'}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="filter-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={filters.priority || 'all'}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
          >
            {PRIORITIES.map(priority => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="filter-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={filters.completed || 'all'}
            onChange={(e) => handleFilterChange('completed', e.target.value)}
          >
            {STATUS_OPTIONS.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="active-filters">
          <span className="active-filters-label">Active filters:</span>
          {filters.search && (
            <span className="active-filter">
              Search: "{filters.search}"
              <button onClick={() => handleFilterChange('search', '')}>×</button>
            </span>
          )}
          {filters.category && filters.category !== 'all' && (
            <span className="active-filter">
              Category: {CATEGORIES.find(c => c.value === filters.category)?.label}
              <button onClick={() => handleFilterChange('category', 'all')}>×</button>
            </span>
          )}
          {filters.priority && filters.priority !== 'all' && (
            <span className="active-filter">
              Priority: {PRIORITIES.find(p => p.value === filters.priority)?.label}
              <button onClick={() => handleFilterChange('priority', 'all')}>×</button>
            </span>
          )}
          {filters.completed && filters.completed !== 'all' && (
            <span className="active-filter">
              Status: {STATUS_OPTIONS.find(s => s.value === filters.completed)?.label}
              <button onClick={() => handleFilterChange('completed', 'all')}>×</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
