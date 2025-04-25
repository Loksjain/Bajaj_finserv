import React, { useState, useEffect } from 'react';
import Autocomplete from './components/Autocomplete';
import FilterPanel from './components/FilterPanel';
import DoctorCard from './components/DoctorCard';
import { fetchDoctors } from './data/api';
import { parseQueryParams, updateQueryParams } from './utils/queryParamUtils';
import { filterDoctors, sortDoctors } from './utils/filterUtils';
import './styles.css';

function App() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [mode, setMode] = useState('');
  const [specialties, setSpecialties] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDoctors();
        // Ensure data is an array and has the required properties
        const formattedData = Array.isArray(data) ? data.map(doctor => ({
          id: doctor.id || Math.random().toString(36).substr(2, 9),
          name: doctor.name || 'Unknown Doctor',
          name_initials: doctor.name_initials || '',
          photo: doctor.photo || '',
          doctor_introduction: doctor.doctor_introduction || '',
          specialities: Array.isArray(doctor.specialities) ? doctor.specialities : [],
          fees: doctor.fees || '₹ 0',
          experience: doctor.experience || '0 Years of experience',
          languages: Array.isArray(doctor.languages) ? doctor.languages : [],
          clinic: doctor.clinic || {},
          video_consult: Boolean(doctor.video_consult),
          in_clinic: Boolean(doctor.in_clinic)
        })) : [];
        
        setDoctors(formattedData);
        setFilteredDoctors(formattedData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading doctors:', error);
        setError('Failed to load doctors data. Please try again later.');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const params = parseQueryParams();
    setSearchTerm(params.search || '');
    setMode(params.mode || '');
    setSpecialties(params.specialties ? params.specialties.split(',') : []);
    setSortBy(params.sort || '');
  }, []);

  useEffect(() => {
    let result = [...doctors];
    
    // Apply filters
    result = filterDoctors(result, {
      searchTerm,
      mode,
      specialties
    });

    // Apply sorting
    result = sortDoctors(result, sortBy);

    setFilteredDoctors(result);
    updateQueryParams({ searchTerm, mode, specialties, sortBy });
  }, [doctors, searchTerm, mode, specialties, sortBy]);

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    
    if (!searchTerm) {
      setFilteredDoctors(doctors);
      return;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = doctors.filter(doctor => {
      // Search in doctor name
      if (doctor.name.toLowerCase().includes(lowerSearchTerm)) return true;
      
      // Search in specialties
      if (doctor.specialities?.some(spec => 
        spec.name.toLowerCase().includes(lowerSearchTerm)
      )) return true;
      
      // Search in clinic name
      if (doctor.clinic?.name?.toLowerCase().includes(lowerSearchTerm)) return true;
      
      // Search in doctor introduction
      if (doctor.doctor_introduction?.toLowerCase().includes(lowerSearchTerm)) return true;

      // Search in symptoms (common conditions treated)
      const commonConditions = [
        'fever', 'headache', 'cough', 'diabetes', 'heart', 'skin', 'eye', 'dental',
        'allergy', 'asthma', 'back pain', 'depression', 'anxiety', 'arthritis'
      ];
      
      if (commonConditions.some(condition => 
        condition.includes(lowerSearchTerm) && 
        doctor.specialities?.some(spec => 
          spec.name.toLowerCase().includes(condition)
        )
      )) return true;
      
      return false;
    });

    setFilteredDoctors(filtered);
  };

  // Update specialties when search matches a specialty
  useEffect(() => {
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const matchingSpecialties = doctors
        .flatMap(doctor => doctor.specialities || [])
        .filter(spec => spec.name.toLowerCase().includes(lowerSearchTerm))
        .map(spec => spec.name);

      if (matchingSpecialties.length > 0) {
        setSpecialties(prev => [...new Set([...prev, ...matchingSpecialties])]);
      }
    }
  }, [searchTerm, doctors]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Find Your Healthcare Provider</h1>
        <Autocomplete doctors={doctors} onSearch={handleSearch} />
      </header>
      
      <div className="main-content">
        <FilterPanel
          mode={mode}
          setMode={setMode}
          specialties={specialties}
          setSpecialties={setSpecialties}
          sortBy={sortBy}
          setSortBy={setSortBy}
          doctors={doctors}
        />
        
        <div className="doctor-list">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map(doctor => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))
          ) : (
            <div className="no-results">No doctors found matching your criteria.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
