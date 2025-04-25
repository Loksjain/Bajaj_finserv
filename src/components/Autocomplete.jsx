import React, { useState } from 'react';

const Autocomplete = ({ doctors, onSearch }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const generateSuggestions = (value) => {
    if (!value) return [];

    const lowerValue = value.toLowerCase();
    const allSuggestions = [];

    // Add common medical conditions
    const commonConditions = [
      'Fever', 'Headache', 'Cough', 'Diabetes', 'Heart', 'Skin', 'Eye', 'Dental',
      'Allergy', 'Asthma', 'Back Pain', 'Depression', 'Anxiety', 'Arthritis'
    ];

    // Add doctor names
    const doctorNames = doctors.map(doctor => ({
      type: 'doctor',
      value: doctor.name,
      specialty: doctor.specialities?.[0]?.name || ''
    }));

    // Add specialties
    const specialties = [...new Set(doctors.flatMap(doctor => 
      doctor.specialities?.map(spec => spec.name) || []
    ))].map(specialty => ({
      type: 'specialty',
      value: specialty
    }));

    // Add clinics
    const clinics = [...new Set(doctors.map(doctor => 
      doctor.clinic?.name || ''
    ).filter(Boolean))].map(clinic => ({
      type: 'clinic',
      value: clinic
    }));

    // Filter and combine suggestions
    const filteredConditions = commonConditions
      .filter(condition => condition.toLowerCase().includes(lowerValue))
      .map(condition => ({ type: 'condition', value: condition }));

    const filteredDoctors = doctorNames
      .filter(doctor => 
        doctor.value.toLowerCase().includes(lowerValue) ||
        doctor.specialty.toLowerCase().includes(lowerValue)
      );

    const filteredSpecialties = specialties
      .filter(specialty => specialty.value.toLowerCase().includes(lowerValue));

    const filteredClinics = clinics
      .filter(clinic => clinic.value.toLowerCase().includes(lowerValue));

    return [
      ...filteredConditions,
      ...filteredDoctors,
      ...filteredSpecialties,
      ...filteredClinics
    ].slice(0, 8); // Limit to 8 suggestions
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    const newSuggestions = generateSuggestions(value);
    setSuggestions(newSuggestions);
    onSearch(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion.value);
    onSearch(suggestion.value);
    setSuggestions([]);
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'doctor':
        return '👨‍⚕️';
      case 'specialty':
        return '🏥';
      case 'clinic':
        return '🏢';
      case 'condition':
        return '🤒';
      default:
        return '🔍';
    }
  };

  return (
    <div className="autocomplete">
      <div className={`search-container ${isFocused ? 'focused' : ''}`}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search symptoms, doctors, specialists, clinics..."
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="suggestion-item"
            >
              <span className="suggestion-icon">{getSuggestionIcon(suggestion.type)}</span>
              <span className="suggestion-text">
                {suggestion.value}
                {suggestion.type === 'doctor' && suggestion.specialty && (
                  <span className="suggestion-specialty"> - {suggestion.specialty}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete; 