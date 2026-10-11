
import { useState } from "react";
import emailjs from "@emailjs/browser";
import "./contact.css";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [isSending, setIsSending] = useState(false);

  const showToast = (message, type = "success") => {
    sessionStorage.setItem(
      "nexoraToast",
      JSON.stringify({ message, type })
    );

    window.dispatchEvent(new Event("nexora-toast"));
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (isSending) return;

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.subject.trim() ||
      !form.message.trim()
    ) {
      showToast("Please fill in all the fields.", "error");
      return;
    }

    setIsSending(true);

    try {
      await emailjs.send(
        "service_7cp9b49",
        "template_3s99c0i",
        {
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim()
        },
        "FjfopWTtheTG-NIEi"
      );

      setForm({
        name: "",
        email: "",
        subject: "",
        message: ""
      });

      showToast(
        "Message sent successfully!",
        "success"
      );
    } catch (error) {
      console.error("EmailJS error:", error);

      showToast(
        "Failed to send your message. Please try again.",
        "error"
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="contact-page">

      {/* Banner */}
      <div className="contact-banner">
        <h1>Contact Nexora</h1>
        <p>
          We're here to help you with orders,
          products, and support.
        </p>
      </div>

      {/* Contact Cards */}
      <div className="contact-cards">

        <div className="contact-card">
          <h3>📧 Email Support</h3>
          <p>nexora7workmail@gmail.com</p>
        </div>

        <div className="contact-card">
          <h3>📞 Call Us</h3>
          <p>+91 83000 79445</p>
        </div>

        <div className="contact-card">
          <h3>📍 Location</h3>
          <p>Madurai, Tamil Nadu</p>
        </div>

      </div>

      {/* Contact Form */}
      <div className="contact-container">

        <div className="contact-form">
          <h2>Send Us a Message</h2>

          <form onSubmit={sendMessage}>

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              disabled={isSending}
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={isSending}
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
              required
              disabled={isSending}
            />

            <textarea
              rows="6"
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              required
              disabled={isSending}
            />

            <button type="submit" disabled={isSending}>
              {isSending ? "Sending..." : "Send Message"}
            </button>

          </form>
        </div>

        <div className="contact-info">

          <h2>Customer Support</h2>

          <p>
            Our support team is available
            24/7 to assist you with your
            shopping experience.
          </p>

          <div className="info-box">
            <h4>Working Hours</h4>
            <p>Monday - Sunday</p>
            <p>9:00 AM - 10:00 PM</p>
          </div>

          <div className="info-box">
            <h4>Quick Help</h4>
            <p>Order Tracking</p>
            <p>Returns & Refunds</p>
            <p>Account Assistance</p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Contact;