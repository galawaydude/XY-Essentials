import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './orderdetails.css';


const OrderDetails = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itlOrderDetails, setItlOrderDetails] = useState(null);

  //ITL: ACCESS CODES
  const ITL_ACCESS_TOKEN = import.meta.env.VITE_ITL_ACCESS_TOKEN;
  const ITL_SECRET_KEY = import.meta.env.VITE_ITL_SECRET_KEY;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      console.log(`Fetching order details for Order ID: ${id}`);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${id}`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        const data = await response.json();
        console.log('Order details:', data);
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order details:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  // ITL: ORDER DETAILS 
  useEffect(() => {
    const getItlOrderDetails = async () => {
      console.log(order.waybill);
      if (!order || !order.waybill) {
        console.error("Order waybill is not accessible");
        return;
      }

      const url = `${import.meta.env.VITE_ITL_URL}/api_v3/order/get_details.json`;

      // Payload for the API
      const payload = {
        data: {
          awb_number_list: order.waybill,
          order_no: order._id,
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date().toISOString().split('T')[0],
          access_token: ITL_ACCESS_TOKEN,
          secret_key: ITL_SECRET_KEY,
        },
      };

      // Headers for the API request
      const headers = {
        "Content-Type": "application/json",
      };

      try {
        // Sending POST request to the API
        const response = await fetch(url, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(payload),
        });

        // Parsing the response JSON
        const result = await response.json();
        const orderWaybill = order.waybill;
        console.log("Order Details Response:", result.data[orderWaybill]);
        setItlOrderDetails(result.data[orderWaybill]);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };
    //ITL: ORDER DETAILS END

    if (order) {
      getItlOrderDetails();
    }
  }, [ITL_ACCESS_TOKEN, ITL_SECRET_KEY, order]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!order) return <p>No order found</p>;


  // Destructure order data
  // const {
  //   _id,
  //   orderItems,
  //   shippingFee,
  //   subtotal,
  //   discount,
  //   finalPrice,
  //   deliveryDate,
  //   createdAt,
  //   shippingAddress,
  //   paymentMethod,
  //   paymentStatus,
  //   shippingStatus,
  //   trackingNumber,
  //   waybill
  // } = order;


  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatAddress = (address) => {
    const parts = [
      address.fullName,
      address.addressLine1,
      address.addressLine2,
      address.city,
      address.state,
      address.postalCode,
      address.phoneNumber
    ].filter(Boolean); // Remove empty or undefined values
    return parts.join(', ');
  };

  return (
    <div>
      <div className="text-nav-con section od-text-nav">
        <a href="/profile">Profile </a>&nbsp;&nbsp;&gt;
        &nbsp;&nbsp;<a href="/orders"> Your Orders</a>&nbsp;&nbsp;&gt;
        &nbsp;&nbsp;<a> Order: {order._id}</a>
      </div>
      <div className="ord-details-container section">
        <div className="ord-payment-item">
          <div className="ord-payment-label">Order Date: </div>
          <div className="ord-payment-value">{formatDate(order.createdAt)}</div>
        </div>
        <h1 className="ord-details-heading">Order ID: {order._id}</h1>
        {/* Order Status Section */}
        <div className="ord-status-section">
          {/* Info Sections */}
          <div className="ord-info-sections">
            <div className="ord-payment-section">
              <h2 className="ord-payment-heading">Payment Details</h2>
              <div className="ord-payment-item">
                <span className="ord-status-label">Total Amount:</span>
                <span className="ord-status-value">₹{order.finalPrice}</span>
              </div>
              <div className="ord-payment-item">
                <span className="ord-status-label">Payment Status:</span>
                <span className="ord-status-value">{order.paymentStatus}</span>
              </div>
              <div className="ord-payment-info">
                <div className="ord-payment-item">
                  <div className="ord-payment-label">Payment Method: </div>
                  <div className="ord-payment-value">
                    {order.paymentMethod === 'cod' ? "Pay On Delivery" : "Razorpay"}
                  </div>
                </div>
              </div>
            </div>
            {/* Shipping Section */}
            <div className="ord-shipping-section">
              <h2 className="ord-shipping-heading">Shipping Information</h2>
              {itlOrderDetails?.latest_courier_status && (
                <div className="ord-status-item">
                  <span className="ord-status-label">Shipping Status: </span>
                  <span className="ord-status-value">{itlOrderDetails.latest_courier_status.charAt(0).toUpperCase() + itlOrderDetails.latest_courier_status.slice(1)}.</span>
                </div>
              )}
              {order?.trackingNumber && (
                <div className="ord-status-item">
                  <span className="ord-status-label">Tracking Number: </span>
                  <span className="ord-status-value">{order.trackingNumber}</span>
                </div>
              )}
              {itlOrderDetails?.expected_delivery_date && (
                <div className="ord-shipping-item">
                  <span className="ord-status-label">Delivery Date:</span>
                  <span className="ord-status-value">{formatDate(itlOrderDetails.expected_delivery_date)}</span>
                </div>
              )}
              <div className="ord-shipping-item">
                <span>
                  <span className="ord-status-label">Shipping Address: </span>
                  {formatAddress(order.shippingAddress)}
                </span>
              </div>
            </div>
            {/* Payment Section */}
          </div>
        </div>
        {/* Pricing Breakdown */}
        {/* <div className="ord-pricing-breakdown">
          <h2 className="ord-pricing-heading">Price Breakdown</h2>
          <div className="ord-price-row">
            <span className="ord-price-label">Subtotal</span>
            <span className="ord-price-value">₹{order.subtotal}</span>
          </div>
          <div className="ord-price-row">
            <span className="ord-price-label">Shipping Price</span>
            <span className="ord-price-value">₹{order.shippingFee}</span>
          </div>
          {order.discount > 0 && (
            <div className="ord-price-row">
              <span className="ord-price-label">Discount</span>
              <span className="ord-price-value">₹{order.discount}</span>
            </div>
          )}
          <div className="ord-price-row">
            <span className="ord-price-label">Total Amount</span>
            <span className="ord-price-value">₹{order.finalPrice.toFixed(2)}</span>
          </div>
        </div> */}
        {/* Products Section */}
        <div className="ord-products-section">
          <h2 className="ord-products-heading">Products in this order</h2>
          {order.orderItems.map((item, index) => (
            <Link key={index} to={`/products/${item.productId._id}`} className="ord-product-item" style={{ color: 'inherit' }}>
              <img loading="lazy" src={item.productId.images[0]} alt={item.productName} className="ord-product-image" />
              <div className="ord-product-details">
                <p className="ord-product-name">{item.productName}</p>
                <p className="ord-product-quantity">Quantity: {item.quantity}</p>
                <p className="ord-product-price">Price: ₹{item.price}</p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>


  );
};

export default OrderDetails;