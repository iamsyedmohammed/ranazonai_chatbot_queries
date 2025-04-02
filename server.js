const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// ========== Root Route for Monitoring ==========
app.get('/ping', (req, res) => {
  res.status(200).send('pong 🏓 for Chat Bot Emails');
});


// Transporter setup for Hostinger (or other custom domain)
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",  // Change if you're using a different provider
  port: 465,  // Or 587 for TLS
  secure: true,  // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,  // Your email from .env
    pass: process.env.EMAIL_PASS   // Your email password or app password
  },
});

// Email template to make it look professional
function generateEmailContent(message) {
    return `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #333;
              line-height: 1.6;
            }
            h2 {
              color: #333;  /* Default color for the title */
            }
            p {
              font-size: 16px;
            }
            .message-content {
              background-color: #f9f9f9;
              padding: 15px;
              border: 1px solid #ddd;
              border-radius: 4px;
              margin-bottom: 15px;
            }
            .footer {
              color: #95a5a6;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <h2>🔔 You have a new message from <span style="color: #f16232;">RanzBot</span>!</h2> <!-- Changed the text -->
          <p><strong>Message Details:</strong></p>
          <div class="message-content">
            ${message}
          </div>
          <p class="footer">This is an automated message from the Ranazonai Chat service.</p>
        </body>
      </html>
    `;
  }
  
  
app.post('/send-chat', async (req, res) => {
  const { message } = req.body;

  const mailOptions = {
    from: process.env.FROM_EMAIL,  // Get "from" email from the .env file
    to: "contact@ranazonai.com",  // Or another email address
    subject: "📩 New Query Received from RanzBot!",
    html: generateEmailContent(message),  // Send formatted HTML content
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');  // Log success
    res.status(200).json({ success: true, msg: 'Message sent to email!' });
  } catch (error) {
    console.error("Error sending email:", error);  // Log error details
    res.status(500).json({ success: false, msg: 'Failed to send message.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
