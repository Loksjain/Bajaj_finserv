import React, { useState } from 'react';
import { FaUserMd, FaHospital, FaMapMarkerAlt, FaLanguage, FaRupeeSign, FaVideo, FaStethoscope, FaTimes } from 'react-icons/fa';

const DoctorCard = ({ doctor }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!doctor) {
    return null;
  }

  const {
    name = 'Unknown Doctor',
    name_initials = '',
    photo = '',
    specialities = [],
    experience = '0 Years of experience',
    clinic = {},
    video_consult = false,
    in_clinic = false
  } = doctor;

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="doctor-card" data-testid="doctor-card">
      <div className="doctor-header">
        {photo ? (
          <img src={photo} alt={name} className="doctor-photo" />
        ) : (
          <div className="doctor-initials">{name_initials}</div>
        )}
        <div className="doctor-info">
          <h3 
            className="doctor-name" 
            onClick={toggleDetails}
            data-testid="doctor-name"
          >
            <FaUserMd className="icon" /> {name}
          </h3>
          <div className="doctor-specialty" data-testid="doctor-specialty">
            <FaStethoscope className="icon" /> {specialities.length > 0 ? specialities.map(spec => spec.name).join(', ') : 'No specialties listed'}
          </div>
          <div className="doctor-experience" data-testid="doctor-experience">
            {experience}
          </div>
          {clinic && clinic.name && (
            <div className="clinic-info">
              <div className="clinic-name">
                <FaHospital className="icon" /> {clinic.name}
              </div>
              {clinic.address && (
                <div className="clinic-address">
                  <FaMapMarkerAlt className="icon" /> {clinic.address.locality}, {clinic.address.city}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="consultation-modes">
        {video_consult && (
          <span className="video-consult">
            <FaVideo className="icon" /> Video Consultation
          </span>
        )}
        {in_clinic && (
          <span className="in-clinic">
            <FaHospital className="icon" /> In-Clinic
          </span>
        )}
      </div>

      <button className="book-appointment-btn" data-testid="book-appointment">
        Book Appointment
      </button>

      {showDetails && (
        <div className="doctor-details-modal">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title">
                {photo ? (
                  <img src={photo} alt={name} className="modal-photo" />
                ) : (
                  <div className="modal-initials">{name_initials}</div>
                )}
                <h2>{name}</h2>
              </div>
              <button className="close-btn" onClick={toggleDetails}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="detailed-info">
                <div className="info-section">
                  <h3>About Doctor</h3>
                  <p className="doctor-intro">{doctor.doctor_introduction}</p>
                </div>

                <div className="info-section">
                  <h3>Specialties</h3>
                  <div className="specialties-list">
                    {specialities.map((spec, index) => (
                      <span key={index} className="specialty-tag">
                        <FaStethoscope className="icon" /> {spec.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="info-section">
                  <h3>Languages</h3>
                  <div className="languages-list">
                    {doctor.languages.map((lang, index) => (
                      <span key={index} className="language-tag">
                        <FaLanguage className="icon" /> {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="info-section">
                  <h3>Consultation Fee</h3>
                  <div className="fee">
                    <FaRupeeSign className="icon" /> {doctor.fees}
                  </div>
                </div>

                {clinic && clinic.address && (
                  <div className="info-section">
                    <h3>Clinic Address</h3>
                    <div className="clinic-details">
                      <div className="clinic-name">
                        <FaHospital className="icon" /> {clinic.name}
                      </div>
                      <div className="clinic-address">
                        <FaMapMarkerAlt className="icon" />
                        <div>
                          <p>{clinic.address.address_line1}</p>
                          <p>{clinic.address.locality}, {clinic.address.city}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorCard; 