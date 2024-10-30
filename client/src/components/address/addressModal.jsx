import React from 'react';
import './addressmodal.css';

const statesOfIndia = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Delhi", "Puducherry", "Ladakh", "Jammu and Kashmir"
];

const Addressmodal = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  return (
    <div className="address-modal-overlay">
      <div className="address-modal-main-con">
        <h2 className="address-modal-title">Add New Address</h2>
        <form className="address-modal-form">
          <label className='address-label' htmlFor="fullName">Full Name</label>
          <input id="fullName" className="address-modal-input" type="text" placeholder="Full Name" required />

          <label className='address-label' htmlFor="addressLine1">Address Line 1</label>
          <input id="addressLine1" className="address-modal-input" type="text" placeholder="Address Line 1" required />

          <label className='address-label' htmlFor="addressLine2">Address Line 2</label>
          <input id="addressLine2" className="address-modal-input" type="text" placeholder="Address Line 2" />

          <div className='address-multi-labels'>
            <label className='address-label' htmlFor="landmark">Landmark</label>
            <label className='address-label' htmlFor="postalCode">Pin-Code</label>
          </div>
          <div className="address-modal-double-input">
            <input id="landmark" className="address-modal-input half-width" type="text" placeholder="Landmark" />
            <input id="postalCode" className="address-modal-input half-width" type="text" placeholder="Postal Code" required />
          </div>

          <div className='address-multi-labels'>
            <label className='address-label' htmlFor="city">City</label>
            <label className='address-label' htmlFor="state">State</label></div>
          <div className="address-modal-double-input">
            <input id="city" className="address-modal-input half-width" type="text" placeholder="City" required />
            <select id="state" className="address-modal-input half-width" required>
              <option value="">Select State</option>
              {statesOfIndia.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <label className='address-label' htmlFor="phoneNumber">Contact Number</label>
          <input id="phoneNumber" className="address-modal-input" type="text" placeholder="Phone Number" required />

          <div className="address-modal-checkbox">
            <input type="checkbox" id="isDefault" />
            <label htmlFor="isDefault">Set as default address</label>
          </div>

          <div className="address-modal-buttons">
            <button type="button" className="address-modal-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="address-modal-save" onClick={onSave}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Addressmodal;