const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.post("/send-email", async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Your email address where you want to receive emails
  const recipientEmail = "tanmoy.mckvie@gmail.com";

  // Basic validation
  if (!name || !email || !subject || !message) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  // Create a Nodemailer transporter
  // Ensure your .env file has EMAIL_USER and EMAIL_PASS
  let transporter = nodemailer.createTransport({
    service: "gmail", // Or your email provider
    auth: {
      user: process.env.EMAIL_USER, // Your email address from .env
      pass: process.env.EMAIL_PASS, // Your email password or app password from .env
    },
    tls: {
      rejectUnauthorized: false, // Necessary for some local environments, review for production
    },
  });

  // Email options
  let mailOptions = {
    from: `"${name}" <${process.env.EMAIL_USER}>`, // Sender will be your authenticated email
    replyTo: email, // So you can reply directly to the form submitter
    to: recipientEmail, // Where the email will be sent
    subject: `New Contact Form Submission: ${subject}`, // Subject line
    text: `You have received a new message from your portfolio contact form.\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`, // Plain text body
    html: `
          <p>You have received a new message from your portfolio contact form.</p>
          <h3>Contact Details:</h3>
          <ul>
              <li><strong>Name:</strong> ${name}</li>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Subject:</strong> ${subject}</li>
          </ul>
          <h3>Message:</h3>
          <p>${message.replace(/\n/g, "<br>")}</p>
      `, // HTML body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", recipientEmail);
    res
      .status(200)
      .json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
