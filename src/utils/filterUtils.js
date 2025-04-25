export const filterDoctors = (doctors, filters) => {
  let result = [...doctors];

  // Apply search filter
  if (filters.searchTerm) {
    const searchTerm = filters.searchTerm.toLowerCase();
    result = result.filter(doctor => 
      doctor.name.toLowerCase().includes(searchTerm) ||
      doctor.doctor_introduction.toLowerCase().includes(searchTerm) ||
      doctor.specialities.some(spec => spec.name.toLowerCase().includes(searchTerm))
    );
  }

  // Apply mode filter
  if (filters.mode) {
    if (filters.mode === 'video') {
      result = result.filter(doctor => doctor.video_consult);
    } else if (filters.mode === 'clinic') {
      result = result.filter(doctor => doctor.in_clinic);
    }
  }

  // Apply specialties filter
  if (filters.specialties && filters.specialties.length > 0) {
    result = result.filter(doctor => 
      doctor.specialities.some(spec => 
        filters.specialties.includes(spec.name)
      )
    );
  }

  return result;
};

export const sortDoctors = (doctors, sortBy) => {
  if (!sortBy) return doctors;

  return [...doctors].sort((a, b) => {
    switch (sortBy) {
      case 'experience':
        const expA = parseInt(a.experience);
        const expB = parseInt(b.experience);
        return expB - expA;
      case 'fee':
        const feeA = parseInt(a.fees.replace('₹', '').trim());
        const feeB = parseInt(b.fees.replace('₹', '').trim());
        return feeA - feeB;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });
}; 