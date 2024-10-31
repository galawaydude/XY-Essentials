import React, { useState } from 'react';
import './addressmodal.css';

const statesOfIndia = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Delhi", "Puducherry", "Ladakh", "Jammu and Kashmir"
];

const AddressModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      landMark: '',
      postalCode: '',
      city: '',
      state: '',
      phoneNumber: '',
      isDefault: false,
    });
  
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      console.log(`Changing ${name}: ${type === 'checkbox' ? checked : value}`); // Log the field being changed
  
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log('Form submitted with data:', formData); // Log the form data on submission
  
      try {
        const response = await fetch('http://localhost:5000/api/addresses', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        if (!response.ok) {
          throw new Error('Failed to save address');
        }
  
        const savedAddress = await response.json();
        console.log('Address saved successfully:', savedAddress); // Log the saved address
        onSave(savedAddress); // Call the onSave callback with the saved address
        onClose(); // Close the modal
      } catch (error) {
        console.error('Error during address submission:', error); // Log any errors that occur
        // You can add error handling here (e.g., display an error message)
      }
    };
  
    if (!isOpen) return null;

  return (
    <div className="address-modal-overlay">
    <div className="address-modal-main-con">
      <h3 className="address-modal-title">Add New Address</h3>
      <form className="address-modal-form" onSubmit={handleSubmit}>
        <label className='address-label' htmlFor="fullName">Full Name</label>
        <input id="fullName" name="fullName" className="address-modal-input" type="text" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />

        <label className='address-label' htmlFor="addressLine1">Address Line 1</label>
        <input id="addressLine1" name="addressLine1" className="address-modal-input" type="text" placeholder="Address Line 1" value={formData.addressLine1} onChange={handleChange} required />

        <label className='address-label' htmlFor="addressLine2">Address Line 2</label>
        <input id="addressLine2" name="addressLine2" className="address-modal-input" type="text" placeholder="Address Line 2" value={formData.addressLine2} onChange={handleChange} />

        <div className='address-multi-labels'>
          <label className='address-label' htmlFor="landMark">Landmark</label>
          <label className='address-label' htmlFor="postalCode">Pin-Code</label>
        </div>
        <div className="address-modal-double-input">
          <input id="landMark" name="landMark" className="address-modal-input half-width" type="text" placeholder="Landmark" value={formData.landMark} onChange={handleChange} />
          <input id="postalCode" name="postalCode" className="address-modal-input half-width" type="text" placeholder="Postal Code" value={formData.postalCode} onChange={handleChange} required />
        </div>

        <div className='address-multi-labels'>
          <label className='address-label' htmlFor="city">City</label>
          <label className='address-label' htmlFor="state">State</label>
        </div>
        <div className="address-modal-double-input">
          <input id="city" name="city" className="address-modal-input half-width" type="text" placeholder="City" value={formData.city} onChange={handleChange} required />
          <select id="state" name="state" className="address-modal-input half-width" value={formData.state} onChange={handleChange} required>
            <option value="">Select State</option>
            {statesOfIndia.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <label className='address-label' htmlFor="phoneNumber">Contact Number</label>
        <input id="phoneNumber" name="phoneNumber" className="address-modal-input" type="text" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required />

        <div className="address-modal-checkbox">
          <input type="checkbox" id="isDefault" name="isDefault" checked={formData.isDefault} onChange={handleChange} />
          <label htmlFor="isDefault">Set as default address</label>
        </div>

        <div className="address-modal-buttons">
          <button type="button" className="address-modal-cancel" onClick={onClose}>Cancel</button>
          <button type="submit" className="address-modal-save">Save</button>
        </div>
      </form>
    </div>
  </div>
);
};

export default AddressModal;