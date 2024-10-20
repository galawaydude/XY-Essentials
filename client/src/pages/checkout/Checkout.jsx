import React, { useState } from 'react';
import './checkout.css';

const Checkout = () => {
  const [addresses, setAddresses] = useState([
    { id: 1, address: '123 Main St, City, Country' },
    { id: 2, address: '456 Another Rd, City, Country' }
  ]);
  const [selectedAddress, setSelectedAddress] = useState(addresses[0]);
  const [newAddress, setNewAddress] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // Default payment method
  const orderItems = [
    { name: 'Product 1', price: 10 },
    { name: 'Product 2', price: 20 },
  ];
  const deliveryCharge = 5;

  const handleAddAddress = () => {
    if (newAddress) {
      setAddresses([...addresses, { id: addresses.length + 1, address: newAddress }]);
      setNewAddress('');
      setModalOpen(false);
    }
  };

  const handlePayment = () => {
    // Implement Razorpay integration here
  };

  const totalItems = orderItems.reduce((acc, item) => acc + item.price, 0);
  const totalAmount = totalItems + deliveryCharge;

  return (
    <div className="checkout-con container">
      <div className="section container">
        <div className="home-pro-head">
          <div className="section_left_title">
            <strong>Checkout</strong>
          </div>
        </div>
        <hr />
      </div>

      <div className="checkout-content">
        <div className="checkout-left">
          <h3>Select Delivery Address</h3>
          <select onChange={(e) => setSelectedAddress(addresses[e.target.value])}>
            {addresses.map((addr, index) => (
              <option key={addr.id} value={index}>{addr.address}</option>
            ))}
          </select>
          <button onClick={() => setModalOpen(true)}>Add New Address</button>

          {modalOpen && (
            <div className="modal">
              <div className="modal-content">
                <h4>Add New Address</h4>
                <input 
                  type="text" 
                  value={newAddress} 
                  onChange={(e) => setNewAddress(e.target.value)} 
                  placeholder="Enter new address" 
                />
                <button onClick={handleAddAddress}>Add Address</button>
                <button onClick={() => setModalOpen(false)}>Close</button>
              </div>
            </div>
          )}

          <h3>Payment Method</h3>
          <div>
            <label>
              <input 
                type="radio" 
                name="payment" 
                value="razorpay" 
                checked={paymentMethod === 'razorpay'} 
                onChange={(e) => setPaymentMethod(e.target.value)} 
              /> Razorpay
            </label>
            <label>
              <input 
                type="radio" 
                name="payment" 
                value="cod" 
                checked={paymentMethod === 'cod'} 
                onChange={(e) => setPaymentMethod(e.target.value)} 
              /> Cash on Delivery (POD)
            </label>
          </div>

          <div>
            <input 
              type="text" 
              value={couponCode} 
              onChange={(e) => setCouponCode(e.target.value)} 
              placeholder="Enter coupon code" 
            />
            <button>Apply Coupon</button>
          </div>

          <h3>Order Items Preview</h3>
          <ul>
            {orderItems.map((item) => (
              <li key={item.name}>{item.name} - ${item.price}</li>
            ))}
          </ul>
        </div>

        <div className="checkout-right">
          <h3>Order Summary</h3>
          <p>Delivery Address: {selectedAddress.address}</p>
          <p>Payment Method: {paymentMethod === 'razorpay' ? 'Razorpay' : 'Cash on Delivery'}</p>
          <p>Items Total: ${totalItems}</p>
          <p>Delivery Charge: ${deliveryCharge}</p>
          <p><strong>Total: ${totalAmount}</strong></p>
          <button onClick={handlePayment}>Place order</button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
