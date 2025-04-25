import React from 'react';

const FilterPanel = ({ mode, setMode, specialties, setSpecialties, sortBy, setSortBy, doctors }) => {
  // Get unique specialties from doctors
  const allSpecialties = doctors && doctors.length > 0 
    ? [...new Set(doctors.flatMap(doctor => 
        doctor.specialities ? doctor.specialities.map(spec => spec.name) : []
      ))]
    : [];

  const handleSpecialtyChange = (specialty) => {
    if (specialties.includes(specialty)) {
      setSpecialties(specialties.filter(s => s !== specialty));
    } else {
      setSpecialties([...specialties, specialty]);
    }
  };

  return (
    <div className="filter-panel">
      <div className="filter-section">
        <h3 data-testid="filter-header-moc">Consultation Type</h3>
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="mode"
              value="video"
              checked={mode === 'video'}
              onChange={(e) => setMode(e.target.checked ? 'video' : '')}
              data-testid="filter-video-consult"
            />
            Video Consult
          </label>
          <label>
            <input
              type="checkbox"
              name="mode"
              value="clinic"
              checked={mode === 'clinic'}
              onChange={(e) => setMode(e.target.checked ? 'clinic' : '')}
              data-testid="filter-in-clinic"
            />
            In Clinic
          </label>
        </div>
      </div>

      <div className="filter-section">
        <h3 data-testid="filter-header-speciality">Specialties</h3>
        <div className="specialties-container">
          <div className="checkbox-group">
            {allSpecialties.map((specialty) => (
              <label key={specialty}>
                <input
                  type="checkbox"
                  checked={specialties.includes(specialty)}
                  onChange={() => handleSpecialtyChange(specialty)}
                  data-testid={`filter-specialty-${specialty.replace(/\s+/g, '-')}`}
                />
                {specialty}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="filter-section">
        <h3 data-testid="filter-header-sort">Sort By</h3>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="sort"
              value="fees"
              checked={sortBy === 'fees'}
              onChange={(e) => setSortBy(e.target.value)}
              data-testid="sort-fees"
            />
            Fees
          </label>
          <label>
            <input
              type="radio"
              name="sort"
              value="experience"
              checked={sortBy === 'experience'}
              onChange={(e) => setSortBy(e.target.value)}
              data-testid="sort-experience"
            />
            Experience
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel; 