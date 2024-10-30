import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [checkoutItems, setCheckoutItems] = useState(location.state?.checkoutItems || []);
  const deliveryCharge = paymentMethod === 'razorpay' ? 0 : 5;
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch(`http://localhost:5000/api/users/profile/`, {
        credentials: 'include',
      });
      const data = await response.json();
      setProfile(data);
    };

    const fetchAddresses = async () => {
      const response = await fetch(`http://localhost:5000/api/users/user/addresses`, {
        credentials: 'include',
      });
      const data = await response.json();
      setAddresses(data);

      if (data.length > 0) {
        setSelectedAddress(data[0]);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products/');
        const data = await response.json();
        setProducts(data);
        // console.log('Fetched Products:', data); 
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
    fetchProfile();
    fetchAddresses();
  }, []);

  const addFreeSachets = () => {
    const uniqueSkinTypes = new Set();
    const newItems = [...checkoutItems];

    // Collect unique skin types from all categories in the cart
    checkoutItems.forEach(item => {
      if (item.product.category === 'Cleanse' ||
        item.product.category === 'Treat' ||
        item.product.category === 'Protect') {
        uniqueSkinTypes.add(item.product.skinType);
      }
    });

    // console.log("Unique skin types collected:", [...uniqueSkinTypes]);

    // Loop through each skin type and check for missing sachets
    uniqueSkinTypes.forEach(skinType => {
      const cleanserExists = newItems.some(item =>
        item.product.category === 'Cleanse' && item.product.skinType === skinType
      );
      const treatExists = newItems.some(item =>
        item.product.category === 'Treat' && item.product.skinType === skinType
      );
      const protectExists = newItems.some(item =>
        item.product.category === 'Protect' && item.product.skinType === skinType
      );

      // console.log(`Checking skin type: ${skinType}`);
      // console.log(`Cleanser exists: ${cleanserExists}, Treat exists: ${treatExists}, Protect exists: ${protectExists}`);

      // Add Cleanser sachet if Treat and Protect exist
      if (!cleanserExists) {
        const cleanserSachet = products.find(product =>
          product.category === 'Cleanse' &&
          product.skinType === skinType &&
          product.packaging === 'Sachet'
        );
        if (cleanserSachet) {
          newItems.push({ product: cleanserSachet, quantity: 1 });
          // console.log(`Added Cleanser sachet for skin type: ${skinType}`);
        }
      }

      // Add Treat sachet if Cleanser exists and Protect does not
      if (!treatExists) {
        const treatSachet = products.find(product =>
          product.category === 'Treat' &&
          product.skinType === skinType &&
          product.packaging === 'Sachet'
        );
        if (treatSachet) {
          newItems.push({ product: treatSachet, quantity: 1 });
          // console.log(`Added Treat sachet for skin type: ${skinType}`);
        }
      }

      // Add Protect sachet if Cleanser exists and Treat does not
      if (!protectExists) {
        const protectSachet = products.find(product =>
          product.category === 'Protect' &&
          product.skinType === skinType &&
          product.packaging === 'Sachet'
        );
        if (protectSachet) {
          newItems.push({ product: protectSachet, quantity: 1 });
          // console.log(`Added Protect sachet for skin type: ${skinType}`);
        }
      }
    });

    // Log the updated checkout items
    // console.log("Updated checkout items:", newItems);

    // Update the checkout items with the new sachets
    setCheckoutItems(newItems);
  };

  useEffect(() => {
    addFreeSachets();
  }, [checkoutItems, products]);


  const handleAddAddress = () => {
    if (newAddress) {
      setAddresses([...addresses, { id: addresses.length + 1, address: newAddress }]);
      setNewAddress('');
      setModalOpen(false);
    }
  };

  const totalItems = checkoutItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const totalAmount = totalItems + deliveryCharge - discount;

  const handleApplyCoupon = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/coupons/apply', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: couponCode, totalAmount }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const { discountAmount } = await response.json();
      setDiscount(discountAmount);
      alert(`Coupon applied! You saved ₹${discountAmount.toFixed(2)}`);
    } catch (error) {
      alert(error.message);
      console.error('Error applying coupon:', error);
    }
  };

  const handlePayment = async () => {
    const amount = totalAmount;
    console.log("Total amount to be paid:", amount);

    const orderItems = checkoutItems.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price
    }));

    const orderData = {
      orderItems: orderItems,
      shippingAddress: selectedAddress._id,
      shippingFee: deliveryCharge,
      discount: discount,
      subtotal: totalItems,
      paymentMethod: paymentMethod,
      finalPrice: totalAmount,
    };

    if (paymentMethod === 'cod') {
      try {
        const response = await fetch('http://localhost:5000/api/orders/', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error('Failed to save order details: ' + errorText);
        }

        const createdOrder = await response.json();

        for (const item of checkoutItems) {
          await fetch('http://localhost:5000/api/products/update-stock', {
            method: 'PUT',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              productId: item.product._id,
              quantity: item.quantity,
            }),
          });
        }

        for (const item of checkoutItems) {
          await fetch(`http://localhost:5000/api/cart/${item.product._id}`, {
            method: 'DELETE',
            credentials: 'include',
          });
        }
        alert("Order placed successfully with Cash on Delivery!");
        navigate(`/order-details/${createdOrder._id}`);
      } catch (error) {
        console.error("Error during Cash on Delivery processing:", error);
      }
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/payments/razorpay', {
        method: 'POST',
        credentials: 'include',
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
        amount: Math.round(data.amount * 100),
        currency: data.currency,
        name: "XY Essentials",
        description: "Order Description",
        order_id: data.id,
        handler: async (razorpayResponse) => {
          const paymentData = {
            ...orderData,
            orderId: data.id,
            amount: totalAmount,
            transactionId: razorpayResponse.razorpay_payment_id,
            signature: razorpayResponse.razorpay_signature
          };
          console.log("Payment data to verify:", paymentData);
          try {
            const verifyResponse = await fetch('http://localhost:5000/api/payments/verify', {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(paymentData),
            });
            console.log("Response from payment verification:", verifyResponse);
            if (!verifyResponse.ok) {
              const errorText = await verifyResponse.text();
              throw new Error('Failed to save payment details: ' + errorText);
            }
            alert("Payment Successful!");
          } catch (error) {
            console.error("Error saving payment details:", error);
          }
          const razorpayOrderData = {
            ...orderData,
            paymentMethod: 'razorpay',
            paymentStatus: 'Completed',
            razorpayOrderId: data.id,
          };
          console.log("Order data after successful razorpay payment:", razorpayOrderData);
          const response = await fetch('http://localhost:5000/api/orders/', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(razorpayOrderData),
          });
          // Debugging: Log the response status
          console.log("Response from order save:", response);
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error('Failed to save order details: ' + errorText);
          }
          const createdOrder = await response.json();

          for (const item of checkoutItems) {
            await fetch('http://localhost:5000/api/products/update-stock', {
              method: 'PUT',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                productId: item.product._id,
                quantity: item.quantity,
              }),
            });
          }


          for (const item of checkoutItems) {
            await fetch(`http://localhost:5000/api/cart/${item.product._id}`, {
              method: 'DELETE',
              credentials: 'include',
            });
          }

          alert("Order placed successfully with Cash on Delivery!");
          navigate(`/order-details/${createdOrder._id}`);
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
          paylater: false
        },
        config: {
          display: {
            hide: [
              { method: 'paylater' }
            ],
            preferences: { show_default_blocks: true }
          }
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
      <div className="">
        <div className="home-pro-head">
          <div className="section_left_title">
            <strong>Checkout</strong>
          </div>
        </div>
        {/* <hr /> */}
      </div>

      <div className="checkout-content">
        <div className="checkout-left">
          {/* Address Section */}
          <div className="address-section">
            <h3>Select Delivery Address</h3>
            <select
              onChange={(e) => setSelectedAddress(addresses[e.target.value])}
              className="address-selector"
            >
              {addresses.length > 0 ? (
                addresses.map((addr, index) => (
                  <option key={addr._id} value={index}>
                    {`${addr.fullName}, ${addr.addressLine1}, ${addr.addressLine2 ? `${addr.addressLine2}, ` : ''}${addr.landMark ? `${addr.landMark}, ` : ''}${addr.city}, ${addr.state}, ${addr.postalCode}, ${addr.phoneNumber}`}
                  </option>
                ))
              ) : (
                <option disabled>No addresses available</option>
              )}
            </select>
            <button className="add-address-btn" onClick={() => setModalOpen(true)}>
              Add New Address
            </button>
          </div>

          {/* Payment Section */}
          <div className="payment-section">
            <h3>Payment Method</h3>
            <div className="payment-options">
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
                /> UPI/Cards/NetBanking
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
                /> Pay on Delivery
              </label>
            </div>
          </div>

          {/* Coupon Section */}
          <div className="coupon-section">
            <h4 className="coupon-heading">Have a Coupon?</h4>
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
            />
            <button onClick={handleApplyCoupon}>Apply Coupon</button>
          </div>

          {/* Order Items Section */}
          <div className="order-items">
            <h3>Order Items Preview</h3>
            <ul>
              {checkoutItems.map((item) => (
                <li key={item.product._id} className="product-item">
                  <div className="item-info">
                    <div className="image-container">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <span className="quantity-bubble">{item.quantity}</span>
                    </div>
                    <span>{item.product.name}</span>
                  </div>
                  <span className="quantity">₹{(item.quantity * item.product.price).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="checkout-right">
          <h3>Order Summary</h3>
          <p>Delivery Address: {selectedAddress
            ? `${selectedAddress.fullName}, ${selectedAddress.addressLine1}${selectedAddress.addressLine2 ? ', ' + selectedAddress.addressLine2 : ''}, ${selectedAddress.landMark ? `${selectedAddress.landMark}, ` : ''}${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.postalCode}, ${selectedAddress.phoneNumber}`
            : 'Select an address'}
          </p>
          <hr />
          <div className="summary-row">
            <p>Total Item(s) Cost:</p>
            <p><span className="inr">₹</span><strong>{totalItems.toFixed(2)}</strong></p>
          </div>
          <div className="summary-row">
            <p>Shipping Fee:</p>
            <p><span className="inr">₹</span><strong>{deliveryCharge.toFixed(2)}</strong></p>
          </div>
          <div className="summary-row">
            <p>Discount:</p>
            <p><span className="inr">₹</span><strong>{discount.toFixed(2)}</strong></p>
          </div>
          <hr />
          <div className="summary-row">
            <p className='total-row'>Total Amount:</p>
            <p><span className="inr">₹</span><strong>{totalAmount.toFixed(2)}</strong></p>
          </div>
          <button onClick={handlePayment}>Place Order</button>
        </div>
      </div>

      {/* Address Modal */}
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Address</h3>
            <input
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Enter new address"
            />
            <button onClick={handleAddAddress}>Add</button>
            <button onClick={() => setModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;