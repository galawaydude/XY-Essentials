import React, { useState } from 'react';
import './checkout.css';

const Checkout = () => {
  // const razorpayKeyId = process.env.REACT_APP_RAZORPAY_KEY_ID;

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

  const handlePayment = async () => {
    const amount = totalAmount; // Total amount to be paid
  
    if (paymentMethod === 'cod') {
      // Handle cash on delivery logic here
      const paymentData = {
        orderId: 'COD-' + Date.now(), // You can use a unique identifier for the order
        paymentMethod: 'cod',
        amount,
      };
  
      // Save the order details to your backend (e.g., create a new order)
      await fetch('/api/payment/verify', { // Adjust endpoint as necessary
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });
  
      alert("Order placed successfully with Cash on Delivery!");
      return; // Exit the function
    }
  
    // Continue with Razorpay if payment method is 'razorpay'
    try {
      const response = await fetch('http://localhost:5000/api/payments/razorpay', { // Replace with your actual endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });
  
      const data = await response.json();
  
      const options = {
        key: 'rzp_test_mRwGhrvW3W8Tlv',
        amount: data.amount,
        currency: data.currency,
        name: "XY Essentials",
        description: "Order Description",
        order_id: data.id,
        handler: async (response) => {
          // Payment successful, save the payment details to the database
          const paymentData = {
            orderId: data.id,
            paymentMethod: 'razorpay',
            amount,
          };
  
          await fetch('http://localhost:5000/api/payments/verify', { // Adjust endpoint as necessary
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData),
          });
  
          alert("Payment Successful!");
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#0A4834",
        },
        method: {
          card: true, // Enable card payments
          netbanking: true, 
          upi: true, 
          wallet: false, 
        }
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment failed", error);
    }
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
