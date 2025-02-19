import React, { useState, useEffect } from 'react';
import './editprofile.css';

const EditProfileModal = ({ isOpen, onClose, onSave, currentUser }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const profile = await response.json();
        setFormData({
          name: profile.name,
          email: profile.email,
          mobileNumber: profile.mobileNumber,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(formData.mobileNumber)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    setLoading(true);
    setError('');
    console.log('Updating profile with data:', formData);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      console.log('Profile updated successfully:', updatedProfile);
      onSave(updatedProfile);
      onClose();
    } catch (error) {
      setError(error.message || 'Failed to update profile');
      console.error('Error during profile update:', error);
    } finally {
      setLoading(false);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="edit-profile-overlay">
      <div className="edit-profile-container">
        <button onClick={onClose} className="edit-profile-close">
          <i className="fa-regular fa-circle-xmark"></i>
        </button>

        <h3 className="edit-profile-title">Edit Profile</h3>
        <form className="edit-profile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="mobileNumber">Phone Number</label>
            <input
              id="mobileNumber"
              name="mobileNumber"
              type="tel"
              placeholder="Your Phone Number"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="edit-profile-buttons">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-button">
              {loading ? <i className="fa fa-spinner fa-spin"></i> : 'Save Changes'}
            </button>
          </div>
        </form>
          {/* {loading && <div className="loading-indicator">Saving profile...</div>} */}
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default EditProfileModal;
