import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [checkoutItems, setCheckoutItems] = useState(location.state?.checkoutItems || []);
  const deliveryCharge = paymentMethod === 'razorpay' ? 0 : 5;
  const [discount, setDiscount] = useState(0);

  const coupons = {
    'SAVE10': 10,
    'SAVE20': 20,
  };

  useEffect(() => {
    // Fetch Addresses
    const fetchProfile = async () => {
        const response = await fetch(`http://localhost:5000/api/users/profile/`, {
            credentials: 'include',
        });
        const data = await response.json();
        setProfile(data);
    };
    const fetchAddresses = async () => {
        const response = await fetch(`http://localhost:5000/api/addresses/`, {
            credentials: 'include',
        });
        const data = await response.json();
        setAddresses(data);
    };


    fetchProfile();
    fetchAddresses();
}, []);

  // useEffect(() => {
  //   const fetchCartItems = async () => {
  //     try {
  //       const response = await fetch('http://localhost:5000/api/cart');
  //       if (!response.ok) throw new Error('Failed to fetch cart items');
  //       const data = await response.json();

  //       if (data.cartItems && Array.isArray(data.cartItems)) {
  //         setCartItems(data.cartItems);
  //       } else {
  //         console.error('Expected cartItems to be an array:', data.cartItems);
  //         setCartItems([]);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching cart items:', error);
  //       setCartItems([]);
  //     }
  //   };

  //   fetchCartItems();
  // }, []);

  const handleAddAddress = () => {
    if (newAddress) {
      setAddresses([...addresses, { id: addresses.length + 1, address: newAddress }]);
      setNewAddress('');
      setModalOpen(false);
    }
  };

  const totalItems = checkoutItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const totalAmount = totalItems + deliveryCharge - discount;

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
    const amount = totalAmount;

    // Debugging: Log the total amount
    console.log("Total amount to be paid:", amount);

    // Create the order items array
    const orderItems = checkoutItems.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price
    }));
    // const orderItems = cartItems.map(item => ({
    //   product: item.product._id,
    //   quantity: item.quantity,
    //   price: item.product.price
    // }));

    // Debugging: Log the order items array
    console.log("Order items:", orderItems);

    // Create order data based on the selected payment method
    const orderData = {
      orderItems: orderItems,
      shippingAddress: selectedAddress._id, // Assuming this is the address ID
      shippingFee: deliveryCharge,
      discount: discount,
      subtotal: totalItems,
      paymentMethod: paymentMethod,
      finalPrice: totalAmount,
    };

    // Debugging: Log the order data
    console.log("Order data before sending:", orderData);

    if (paymentMethod === 'cod') {
      try {
        const response = await fetch('http://localhost:5000/api/orders/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });

        // Debugging: Log the response status
        console.log("Response from order save:", response);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error('Failed to save order details: ' + errorText);
        }

        const createdOrder = await response.json(); // Get the created order
        alert("Order placed successfully with Cash on Delivery!");
        
        // Redirect to the order details page with the order ID
        navigate(`/order-details/${createdOrder._id}`);
      } catch (error) {
        console.error("Error during Cash on Delivery processing:", error);
      }
      return; // Exit the function to avoid Razorpay triggering
    }

    // Continue with Razorpay if payment method is 'razorpay'
    try {
      const response = await fetch('http://localhost:5000/api/payments/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      // Debugging: Log the response from Razorpay initialization
      console.log("Response from Razorpay initiation:", response);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error('Failed to initiate Razorpay payment: ' + errorText);
      }

      const data = await response.json();

      // Debugging: Log the data received from Razorpay
      console.log("Razorpay data received:", data);

      const options = {
        key: 'rzp_test_mRwGhrvW3W8Tlv',
        amount: data.amount,
        currency: data.currency,
        name: "XY Essentials",
        description: "Order Description",
        order_id: data.id,
        handler: async (razorpayResponse) => {
          const paymentData = {
            ...orderData,
            transactionId: razorpayResponse.razorpay_payment_id,
            signature: razorpayResponse.razorpay_signature
          };

          // Debugging: Log payment data before verification
          console.log("Payment data to verify:", paymentData);

          try {
            const verifyResponse = await fetch('http://localhost:5000/api/payments/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(paymentData),
            });

            // Debugging: Log the response from payment verification
            console.log("Response from payment verification:", verifyResponse);

            if (!verifyResponse.ok) {
              const errorText = await verifyResponse.text();
              throw new Error('Failed to save payment details: ' + errorText);
            }

            alert("Payment Successful!");
            navigate('/order-details');
          } catch (error) {
            console.error("Error saving payment details:", error);
          }
        },
        prefill: {
          name: profile.name || "Customer Name",
          email: profile.email || "customer@example.com",
          contact: profile.mobileNumber || "9999999999",
        },
        theme: {
          color: "#0A4834",
        },
        method: {
          card: true,
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
              <option key={addr._id} value={index}>
                {addr.addressLine1}, {addr.addressLine2 ? `${addr.addressLine2}, ` : ''}{addr.city}, {addr.state}, {addr.postalCode}, {addr.country}
              </option>
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
                  setDiscount(0);
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
                  setDiscount(0);
                }}
              /> Cash on Delivery (COD)
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
            {checkoutItems.map((item) => (
              <li key={item.product._id}>
                {item.product.name} - ${item.product.price} x {item.quantity}
              </li>
            ))}
          </ul>
        </div>

        <div className="checkout-right">
          <h3>Order Summary</h3>
          <p>
            Delivery Address: {selectedAddress
              ? `${selectedAddress.addressLine1}${selectedAddress.addressLine2 ? ', ' + selectedAddress.addressLine2 : ''}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.postalCode}, ${selectedAddress.country}`
              : 'Select an address'}
          </p>

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
