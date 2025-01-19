import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './checkout.css';
import AddressModal from '../../components/newaddress/AddressModal';
import Toast from '../../components/toast/Toast';

const Checkout = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [checkoutItems, setCheckoutItems] = useState(location.state?.checkoutItems || []);
  // const deliveryCharge = paymentMethod === 'razorpay' ? 0 : 5;
  const [discount, setDiscount] = useState(0);
  const [pmDiscount, setPmDiscount] = useState(50);
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editAddressIndex, setEditAddressIndex] = useState(null);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);

  // Add state variables at the top with other states
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');
  const [action, setAction] = useState('');
  const [link, setLink] = useState('');
  const [link_name, setLinkName] = useState('');

  // Add useEffect to check addresses
  useEffect(() => {
    if (addresses.length === 0) {
      setMessage('Please add a delivery address to proceed with your order.');
      setAction('Address Required!');
      setLink('/account');
      setLinkName('Add Address');
      setShowToast(true);
    }
  }, [addresses]);

  //ITL: ACCESS CODES
  const ITL_ACCESS_TOKEN = import.meta.env.VITE_ITL_ACCESS_TOKEN;
  const ITL_SECRET_KEY = import.meta.env.VITE_ITL_SECRET_KEY;

  // console.log(selectedAddress)

  useEffect(() => {
    if (checkoutItems.length === 0) {
      navigate('/cart');
      return;
    }
  }, [checkoutItems, navigate]);

  useEffect(() => {
    // ITL: RATE CHECK
    const itlRateCheck = async () => {
      const url = "https://pre-alpha.ithinklogistics.com/api_v3/rate/check.json";

      // console.log(ITL_ACCESS_TOKEN)

      const payload = {
        data: {
          from_pincode: "400092",
          to_pincode: "121004",
          shipping_length_cms: "22",
          shipping_width_cms: "12",
          shipping_height_cms: "12",
          shipping_weight_kg: "2",
          order_type: "forward",
          payment_method: "cod",
          product_mrp: "1200.00",
          access_token: ITL_ACCESS_TOKEN,
          secret_key: ITL_SECRET_KEY,
        },
      };

      const headers = {
        "Content-Type": "application/json",
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(payload),
        });

        const result = await response.json();
        console.log("Rate Check Result:", result);
        setDeliveryCharge(result.data[0].rate);
      } catch (error) {
        console.error("Error during rate check:", error);
        // alert("Failed to check rates at ITL!");
      }
    };

    itlRateCheck();
    // ITL: RATE CHECK END
  }, []);

  const handleAddAddress = (newAddress) => {
    if (editAddressIndex !== null) {
      const updatedAddresses = [...addresses];
      updatedAddresses[editAddressIndex] = newAddress;
      setAddresses(updatedAddresses);
    } else {
      setAddresses([...addresses, newAddress]);
    }
    setIsModalOpen(false);
    // setEditAddressIndex(null); 
  };

  const openAddModal = () => {
    setIsModalOpen(true);
    setEditAddressIndex(null);
  };

  // const openEditModal = (index) => {
  //     setEditAddressIndex(index);
  //     setIsModalOpen(true);
  // };

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile/`, {
        credentials: 'include',
      });
      const data = await response.json();
      setProfile(data);
    };

    const fetchAddresses = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/user/addresses`, {
        credentials: 'include',
      });
      const data = await response.json();
      setAddresses(data);

      const defaultAddress = data.find(address => address.isDefault);
      console.log('Default Address:', defaultAddress);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else if (data.length > 0) {
        setSelectedAddress(data[0]);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/`);
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
          newItems.push({
            product: { ...cleanserSachet, price: 0 }, // Set price to 0
            quantity: 1
          });
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
          newItems.push({
            product: { ...treatSachet, price: 0 }, // Set price to 0
            quantity: 1
          });
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
          newItems.push({
            product: { ...protectSachet, price: 0 }, // Set price to 0
            quantity: 1
          });
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


  // const handleAddAddress = () => {
  //   if (newAddress) {
  //     setAddresses([...addresses, { id: addresses.length + 1, address: newAddress }]);
  //     setNewAddress('');
  //     setModalOpen(false);
  //   }
  // };

  const totalItems = checkoutItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const totalItemsPrice = totalItems;
  const totalAmount = totalItems - discount - pmDiscount;

  const handleApplyCoupon = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/coupons/apply`, {
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
      setCouponApplied(true);
      setPmDiscount(0)
      // alert(`Coupon applied! You saved ₹${discountAmount.toFixed(2)}`);
    } catch (error) {
      // alert(error.message);
      console.error('Error applying coupon:', error);
    }
  };
  // useEffect(() => {
  //   handleApplyCoupon();
  // }, [couponCode]);


  // useEffect(() => {
  //   if (paymentMethod === 'razorpay') {
  //     // Apply PREPAY50 coupon
  //     const couponCode = 'PREPAY50';
  //     handleApplyCoupon(couponCode);
  //   } else {
  //     // Remove coupon when switching back to COD
  //     setCouponCode(null);
  //     setDiscount(0);
  //   }
  // }, [paymentMethod, handleApplyCoupon]);

  const handlePayment = async () => {
    setIsPlacingOrder(true);
    const amount = totalAmount;
    console.log("Total amount to be paid:", amount);

    const orderItems = checkoutItems.map(item => ({
      productId: item.product._id,
      productName: item.product.name,
      packaging: item.product.packaging,
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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/`, {
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

        //ITL: CREATE ORDER
        const itlAddOrder = async () => {
          const url = "https://pre-alpha.ithinklogistics.com/api_v3/order/add.json";

          const payload = {
            data: {
              shipments: [
                {
                  waybill: "",
                  order: createdOrder._id,
                  sub_order: "",
                  order_date: createdOrder.createdAt,
                  total_amount: parseFloat(createdOrder.finalPrice.toFixed(2)),
                  name: selectedAddress.fullName,
                  company_name: "XY Essentials",
                  add: selectedAddress.addressLine1,
                  add2: selectedAddress.addressLine2,
                  add3: "",
                  pin: selectedAddress.postalCode,
                  city: selectedAddress.city,
                  state: selectedAddress.state,
                  country: "India",
                  phone: selectedAddress.phoneNumber,
                  alt_phone: "",
                  email: profile.email,
                  is_billing_same_as_shipping: "yes",
                  billing_name: selectedAddress.fullName,
                  billing_company_name: selectedAddress.companyName || "",
                  billing_add: selectedAddress.addressLine1,
                  billing_add2: selectedAddress.addressLine2,
                  billing_add3: "",
                  billing_pin: selectedAddress.postalCode,
                  billing_city: selectedAddress.city,
                  billing_state: selectedAddress.state,
                  billing_country: "India",
                  billing_phone: selectedAddress.phoneNumber,
                  billing_alt_phone: "",
                  billing_email: profile.email,
                  products: createdOrder.orderItems
                    .filter(item => item.packaging !== 'Sachet')
                    .map(item => ({
                      product_name: item.productName,
                      product_sku: "",
                      product_quantity: item.quantity,
                      product_price: item.price,
                      product_tax_rate: "",
                      product_hsn_code: "",
                      product_discount: "",
                    })),
                  shipment_length: "10",
                  shipment_width: "10",
                  shipment_height: "5",
                  weight: "90.00",
                  shipping_charges: "",
                  giftwrap_charges: "",
                  transaction_charges: "",
                  total_discount: discount,
                  first_attemp_discount: "",
                  cod_amount: "",
                  payment_mode: paymentMethod,
                  reseller_name: "",
                  eway_bill_number: "",
                  gst_number: "",
                  what3words: "",
                  return_address_id: "1293",
                },
              ],
              pickup_address_id: "1293",
              access_token: ITL_ACCESS_TOKEN,
              secret_key: ITL_SECRET_KEY,
              logistics: "",
              s_type: "",
              order_type: "",
            },
          };

          console.log("Payload:", payload);


          const headers = {
            "Content-Type": "application/json",
          };

          try {
            const response = await fetch(url, {
              method: "POST",
              headers: headers,
              body: JSON.stringify(payload),
            });

            const result = await response.json();
            console.log("Result:", result);

            const waybill = Object.values(result.data)[0]?.waybill || "";
            console.log("Waybill:", waybill);

            const responsewb = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${createdOrder._id}/waybill`, {
              method: "PUT",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ waybill }),
            });
            const responsewbjson = await responsewb.json();
            console.log("Updated Order:", responsewbjson);
          } catch (error) {
            console.error("Error:", error);
            // alert("Failed to create order at ITL!");
          }

          // Save the ITL awb_number in the order schema as waybill

        };

        itlAddOrder();
        //ITL: CREATE ORDER END




        for (const item of checkoutItems) {
          console.log(`Updating stock for product ${item.product.name} by ${item.quantity}`);
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/update-stock`, {
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
          const data = await response.json();
          console.log(`Updated stock for product ${item.product._id}: ${data.updatedStock}`);
        }

        for (const item of checkoutItems) {
          await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${item.product._id}`, {
            method: 'DELETE',
            credentials: 'include',
          });
        }
        // alert("Order placed successfully with Cash on Delivery!");
        navigate(`/orders/${createdOrder._id}`);
      } catch (error) {
        console.error("Error during Cash on Delivery processing:", error);
      } finally {
        setIsPlacingOrder(false); // End loading
      }
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/razorpay`, {
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
            const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/verify`, {
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
            // alert("Payment Successful!");
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
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/`, {
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
            await fetch(`${import.meta.env.VITE_API_URL}/api/products/update-stock`, {
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
            await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${item.product._id}`, {
              method: 'DELETE',
              credentials: 'include',
            });
          }

          // alert("Order placed successfully with Razorpay!");
          navigate(`/orders/${createdOrder._id}`);
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
    } finally {
      setIsPlacingOrder(false); // End loading
    }
  };

  return (
    <div className="checkout-con container">
      <Toast
        action={action}
        message={message}
        show={showToast}
        link={link}
        link_name={link_name}
        onClose={() => setShowToast(false)}
      />
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
                  <option key={addr._id} value={index} selected={addr.isDefault}>
                    {`${addr.fullName}, ${addr.addressLine1}, ${addr.addressLine2 ? `${addr.addressLine2}, ` : ''}${addr.landMark ? `${addr.landMark}, ` : ''}${addr.city}, ${addr.state}, ${addr.postalCode}, ${addr.phoneNumber}`}
                  </option>
                ))
              ) : (
                <option disabled>No addresses available</option>

              )}
            </select>
            <button className="add-address-btn" onClick={openAddModal}>
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
                    setPmDiscount(50);
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
                    setPmDiscount(0);
                  }}
                /> Pay on Delivery
              </label>
            </div>
          </div>

          {/* Coupon Section */}
          <div className="coupon-section">
            <div className="coupon-divider">
              <h4 className="coupon-heading">Have a Coupon?</h4>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value);
                  setCouponApplied(false);
                }}
                placeholder="Enter coupon code"
              />
            </div>
            <button
              onClick={handleApplyCoupon}
              disabled={couponApplied}
            >
              {couponApplied ? 'Coupon Applied' : 'Apply Coupon'}
            </button>
            <div className="coupon-status">
              {couponApplied ? (
                <div className="coupon-applied">Coupon applied! You saved ₹{discount.toFixed(2)}</div>
              ) : (
                <div className="coupon-not-applied"></div>
              )}
            </div>
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
                  <span className="quantity">
                    {item.product.price === 0
                      ? "Free"
                      : `₹${(item.quantity * item.product.price).toFixed(2)}`}
                  </span>
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
            <p>Total Items Cost:</p>
            <p><span className="inr">₹</span><strong>{totalItems.toFixed(2)}</strong></p>
          </div>
          <div className="summary-row">
            <p>Shipping Fee:</p>
            <p><span className="inr">₹</span><strong>0.00</strong></p>
          </div>
          {paymentMethod === 'razorpay' && (
            <div className="summary-row">
              <p>Online Payment Savings:</p>
              <p><span className="inr">₹</span><strong>{pmDiscount}</strong></p>
            </div>
          )}
          <div className="summary-row">
            <p>Coupon Applied:</p>
            <p><span className="inr">₹</span><strong>{discount.toFixed(2)}</strong></p>
          </div>
          <hr />
          <div className="summary-row">
            <p className='total-row'>Total Amount:</p>
            <p><span className="inr">₹</span><strong>{totalAmount.toFixed(2)}</strong></p>
          </div>
          {checkoutItems.length > 0 && (
            <button
              onClick={handlePayment}
              disabled={isPlacingOrder}
              className="place-order-button"
            >
              {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
            </button>
          )}

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

      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddAddress}
        initialAddress={editAddressIndex !== null ? addresses[editAddressIndex] : null}
      />
    </div>
  );
};

export default Checkout;
