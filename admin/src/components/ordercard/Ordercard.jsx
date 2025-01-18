import React from 'react';
import './ordercard.css';


function OrderCard({ order }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { shippingAddress } = order;

  const fullAddress = `
    ${shippingAddress?.fullName},
    ${shippingAddress?.addressLine1}
    ${shippingAddress?.addressLine2 ? shippingAddress.addressLine2 + ', ' : ''}
    ${shippingAddress?.landMark ? shippingAddress.landMark + ', ' : ''}
    ${shippingAddress?.city}, ${shippingAddress?.state} ${shippingAddress?.postalCode}
  `.replace(/\n/g, ' ').trim();

  // Function to handle bill download
  const handleDownloadBill = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${order._id}/generate-bill`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });


      // Check if response is okay
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Order_${order._id}_Bill.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error('Failed to download bill');
      }
    } catch (error) {
      console.error('Error downloading bill:', error);
    }
  };

  console.log('Order:', order);

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Shipping Address</th>
          <th>Payment Status</th>
          <th>Shipping Status</th>
          <th>Ordered Items</th>
          <th>Final Price</th>
          <th>Delivered At</th>
          <th>Download Bill</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{order._id}</td>
          <td>{fullAddress || 'Address not available'}</td>
          <td><span className='r-tag'>{order.paymentStatus} </span></td>
          <td>{order.shippingStatus}</td>
          <td>
            {
              order.orderItems.map((item, index) => (
                <div key={index}>
                  {item.quantity} * {item.productName} 
                </div>
              ))
            }
          </td>
          <td>${order.finalPrice.toFixed(2)}</td>
          <td>{order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : 'Not yet delivered'}</td>
          <td>
            <button onClick={handleDownloadBill} className="btn btn-primary btn-sm">Download Bill</button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default OrderCard;