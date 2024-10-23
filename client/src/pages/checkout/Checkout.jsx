import React, { useState, useEffect } from 'react';
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
  const [cartItems, setCartItems] = useState([]); // State for cart items
  const deliveryCharge = paymentMethod === 'razorpay' ? 0 : 5; // Adjust delivery charge based on payment method
  const [discount, setDiscount] = useState(0); // State for discount

  const coupons = {
    'SAVE10': 10, // 10% off
    'SAVE20': 20, // 20% off
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cart'); // Adjust the endpoint as necessary
        if (!response.ok) throw new Error('Failed to fetch cart items');
        const data = await response.json();
        
        if (data.cartItems && Array.isArray(data.cartItems)) {
          setCartItems(data.cartItems);
        } else {
          console.error('Expected cartItems to be an array:', data.cartItems);
          setCartItems([]);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setCartItems([]);
      }
    };

    fetchCartItems();
  }, []);

  const handleAddAddress = () => {
    if (newAddress) {
      setAddresses([...addresses, { id: addresses.length + 1, address: newAddress }]);
      setNewAddress('');
      setModalOpen(false);
    }
  };

  const totalItems = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const totalAmount = totalItems + deliveryCharge - discount; // Total amount considering discount

  const handleApplyCoupon = () => {
    if (coupons[couponCode]) {
      const discountAmount = (totalItems * coupons[couponCode]) / 100;
      setDiscount(discountAmount);
      alert(`Coupon applied! You saved $${discountAmount.toFixed(2)}`);
    } else {
      alert('Invalid coupon code');
    }
  };

  const handlePayment = async () => {
    const amount = totalAmount; // Total amount to be paid
    console.log('Handling payment with amount:', amount, 'and payment method:', paymentMethod);
  
    if (paymentMethod === 'cod') {
      // Handle cash on delivery logic here
      const paymentData = {
        orderId: 'COD-' + Date.now(), // Unique identifier for the order
        paymentMethod: 'cod',
        amount,
      };
  
      console.log('Processing Cash on Delivery:', paymentData);
  
      try {
        // Save the order details to your backend
        const response = await fetch('/api/payment/verify', { // Adjust endpoint as necessary
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentData),
        });
  
        if (!response.ok) {
          throw new Error('Failed to save order details: ' + response.statusText);
        }
  
        alert("Order placed successfully with Cash on Delivery!");
        return; // Exit the function
      } catch (error) {
        console.error("Error during Cash on Delivery processing:", error);
      }
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
  
      if (!response.ok) {
        throw new Error('Failed to initiate Razorpay payment: ' + response.statusText);
      }
  
      const data = await response.json();
      console.log('Razorpay response received:', data);
  
      const options = {
        key: 'rzp_test_mRwGhrvW3W8Tlv',
        amount: data.amount,
        currency: data.currency,
        name: "XY Essentials",
        description: "Order Description",
        order_id: data.id,
        handler: async (razorpayResponse) => {
          console.log('Payment successful with response:', razorpayResponse);
          
          // Payment successful, save the payment details to the database
          const paymentData = {
            orderId: data.id,
            paymentMethod: 'razorpay',
            amount,
            transactionId: razorpayResponse.razorpay_payment_id, // Capture the transaction ID
            signature: razorpayResponse.razorpay_signature // Capture the signature
          };
  
          try {
            const verifyResponse = await fetch('http://localhost:5000/api/payments/verify', { // Adjust endpoint as necessary
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(paymentData),
            });
  
            if (!verifyResponse.ok) {
              throw new Error('Failed to save payment details: ' + verifyResponse.statusText);
            }
  
            alert("Payment Successful!");
          } catch (error) {
            console.error("Error saving payment details:", error);
          }
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
      console.error("Payment failed:", error);
    }
  };  

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
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setDiscount(0); // Reset discount when changing payment method
                }}
              /> Razorpay
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setDiscount(0); // Reset discount when changing payment method
                }}
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
            <button onClick={handleApplyCoupon}>Apply Coupon</button>
          </div>

          <h3>Order Items Preview</h3>
          <ul>
            {cartItems.map((item) => (
              <li key={item.product._id}>
                {item.product.name} - ${item.product.price} x {item.quantity}
              </li>
            ))}
          </ul>
        </div>

        <div className="checkout-right">
          <h3>Order Summary</h3>
          <p>Delivery Address: {selectedAddress.address}</p>
          <p>Payment Method: {paymentMethod === 'razorpay' ? 'Razorpay' : 'Cash on Delivery'}</p>
          <p>Items Total: ${totalItems.toFixed(2)}</p>
          <p>Delivery Charge: ${deliveryCharge}</p>
          <p>Discount: -${discount.toFixed(2)}</p>
          <p><strong>Total: ${totalAmount.toFixed(2)}</strong></p>
          <button onClick={handlePayment}>Place order</button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
