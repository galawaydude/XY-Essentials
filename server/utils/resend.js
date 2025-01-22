const { Resend } = require('resend');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../config/.env') });
const resend = new Resend(process.env.RESEND_API_KEY);
// console.log('Resend API client initialized:', resend);

const sendOrderConfirmation = async (user, order, orderItems, shippingAddressDoc) => {
    if (!user?.email || !order?._id) {
        throw new Error('Missing required parameters');
    }

    try {
        const htmlContent = `
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <meta name="color-scheme" content="light dark"/>
          <meta name="supported-color-schemes" content="light dark"/>
          <style>
            body {
              margin: 0; 
              padding: 0; 
              font-family: Arial, sans-serif;
              background-color: #f0f2f5;
            }
            .container {
              background: #ffffff;
              max-width: 600px;
              margin: 30px auto;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header {
              background: #0A4834;
              padding: 20px;
              text-align: center;
              color: #ffffff;
            }
            .header h1 { margin: 0; }
            .content {
              padding: 20px;
              color: #333333;
            }
            .btn {
              display: inline-block;
              margin-top: 20px;
              padding: 12px 24px;
              border: 1.5px solid #0A4834;
              color: #ffffff;
              text-decoration: none;
              border-radius: 4px;
            }
            .footer {
              background: #f7f7f7;
              text-align: center;
              font-size: 0.9em;
              color: #666666;
              padding: 15px;
            }
            @media only screen and (max-width: 600px) {
              .content { padding: 15px; }
            }
            .product-table { width: 100%; margin-top: 15px; border-collapse: collapse; }
            .product-table th, .product-table td { padding: 8px; border-bottom: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <table class="container" cellpadding="0" cellspacing="0" width="600">
            <tr>
              <td class="header">
                <h1>XY Essentials</h1>
              </td>
            </tr>
            <tr>
              <td class="content">
                <h2>Order Confirmation</h2>
                <p>Hello ${user.name},</p>
                <p>Thank you for your order! Your order #${order._id} has been confirmed.</p>
                <p><strong>Total Amount:</strong> ₹${order.finalPrice}</p>
                <p><strong>Delivery Address:</strong> 
                  ${shippingAddressDoc?.fullName}, 
                  ${shippingAddressDoc?.addressLine1}, 
                  ${shippingAddressDoc?.addressLine2}, 
                  ${shippingAddressDoc?.landMark}, 
                  ${shippingAddressDoc?.city}, 
                  ${shippingAddressDoc?.state}, 
                  ${shippingAddressDoc?.postalCode}
                  ${shippingAddressDoc?.phoneNumber}
                </p>
                <table class="product-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${orderItems.map(item => `
                      <tr>
                        <td>${item.productName}</td>
                        <td>${item.quantity}</td>
                        <td>₹${item.price}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
                <a class="btn" href="https://xyessentials.com/orders/${order._id}">View Order Status</a>
              </td>
            </tr>
            <tr>
              <td class="footer">© XY Essentials - Thank you for shopping with us!</td>
            </tr>
          </table>
        </body>
        </html>`;

        const { data, error } = await resend.emails.send({
            from: 'XY Essentials <info@xyessentials.com>',
            to: [user.email],
            subject: 'Order Confirmation - XY Essentials',
            html: htmlContent
        });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
        throw error;
    }
};

const sendWelcomeEmail = async (user) => {
    try {
        const htmlContent = `
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <meta name="color-scheme" content="light dark"/>
          <meta name="supported-color-schemes" content="light dark"/>
          <style>
            body {
              margin: 0; 
              padding: 0; 
              font-family: Arial, sans-serif;
              background-color: #f0f2f5;
            }
            .container {
              background: #ffffff;
              max-width: 600px;
              margin: 30px auto;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header {
              background: #0A4834;
              padding: 20px;
              text-align: center;
              color: #ffffff;
            }
            .content {
              padding: 20px;
              color: #333333;
            }
            .btn {
              display: inline-block;
              margin-top: 20px;
              padding: 12px 24px;
              border: 1.5px solid #0A4834;
              color: #ffffff;
              text-decoration: none;
              border-radius: 4px;
            }
            .footer {
              background: #f7f7f7;
              text-align: center;
              font-size: 0.9em;
              color: #666666;
              padding: 15px;
            }
            @media only screen and (max-width: 600px) {
              .content { padding: 15px; }
            }
          </style>
        </head>
        <body>
          <table class="container" cellpadding="0" cellspacing="0" width="600">
            <tr>
              <td class="header">
                <h1>XY Essentials</h1>
              </td>
            </tr>
            <tr>
              <td class="content">
                <h2>Welcome to XY Essentials!</h2>
                <p>Hello ${user.name},</p>
                <p>We're thrilled to have you here. Explore our collection and enjoy exclusive benefits.</p>
                <a class="btn" href="http://xyessentials.com">Start Shopping</a>
              </td>
            </tr>
            <tr>
              <td class="footer">© XY Essentials - Thank you for joining us!</td>
            </tr>
          </table>
        </body>
        </html>`;

        await resend.emails.send({
            from: 'XY Essentials <info@xyessentials.com>',
            to: "aakarshgoyal23@gmail.com",
            subject: 'Welcome to XY Essentials!',
            html: htmlContent
        });
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
};

module.exports = {
    sendOrderConfirmation,
    sendWelcomeEmail
};
