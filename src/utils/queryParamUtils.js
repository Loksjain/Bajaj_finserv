export const parseQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    search: params.get('search') || '',
    mode: params.get('mode') || '',
    specialties: params.get('specialties') || '',
    sort: params.get('sort') || ''
  };
};

export const updateQueryParams = ({ searchTerm, mode, specialties, sortBy }) => {
  const params = new URLSearchParams();
  
  if (searchTerm) params.set('search', searchTerm);
  if (mode) params.set('mode', mode);
  if (specialties.length > 0) params.set('specialties', specialties.join(','));
  if (sortBy) params.set('sort', sortBy);
  
  const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
  window.history.pushState({}, '', newUrl);
}; 