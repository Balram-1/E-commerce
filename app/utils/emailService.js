const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendReceipt = async (order) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_HOST) {
    console.warn('⚠️  EMAIL config missing (HOST/USER/PASS). Skipping email send.');
    return;
  }

  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <img src="${item.image}" width="50" style="vertical-align: middle; margin-right: 10px;">
        ${item.name} (${item.size})
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        $${item.price.toFixed(2)}
      </td>
    </tr>
  `).join('');

  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a1a;">
      <h1 style="font-size: 24px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase; margin-bottom: 20px; border-bottom: 4px solid #000; padding-bottom: 10px;">AETHER</h1>
      
      <p style="font-size: 16px; line-height: 1.5;">Thanks for your order, <strong>${order.shipping.firstName || 'Valued Customer'}</strong>.</p>
      <p style="color: #717171; font-size: 14px;">Order ID: ${order._id}</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 30px;">
        <thead>
          <tr style="background: #f8f8f8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
            <th style="padding: 10px; text-align: left;">Item</th>
            <th style="padding: 10px; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td style="padding: 10px; font-weight: bold; text-align: right;">TOTAL:</td>
            <td style="padding: 10px; font-weight: bold; text-align: right; font-size: 18px;">$${order.total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      <div style="margin-top: 40px; padding: 20px; background: #f8f8f8; font-size: 13px;">
        <h3 style="margin-top: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Shipping to:</h3>
        <p style="margin-bottom: 0;">
          ${order.shipping.firstName} ${order.shipping.lastName}<br>
          ${order.shipping.address}<br>
          ${order.shipping.city}, ${order.shipping.zip}
        </p>
      </div>

      <p style="margin-top: 40px; font-size: 12px; color: #717171; text-align: center;">
        &copy; 2025 AETHER PREMIUM STREETWEAR. ALL RIGHTS RESERVED.
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"AETHER" <${process.env.EMAIL_USER}>`,
      to: order.email,
      subject: `Order Confirmation - AETHER [${order.orderNumber}]`,
      html: htmlContent
    });
    console.log(`✅ Receipt sent to ${order.email}`);
  } catch (err) {
    console.error('❌ Failed to send email:', err.message);
  }
};
