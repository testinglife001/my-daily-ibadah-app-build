// src/components/SendWhatsApp.jsx
import React, { useState } from "react";
import axios from "axios";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";

const SendWhatsApp = () => {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length < 10 || !message.trim()) {
      alert("Please enter valid phone and message");
      return;
    }

    try {
      // 1. Save to Firestore (optional)
      await addDoc(collection(db, "whatsappMessages"), {
        phone: cleaned,
        message,
        createdAt: Date.now(),
      });

      // 2. Call backend API to send WhatsApp
      const res = await axios.post("http://localhost:5000/api/send-whatsapp", {
        to: cleaned,
        message: message.trim(),
      });

      if (res.data.success) {
        alert("✅ WhatsApp message sent!");
      } else {
        alert("❌ Failed to send.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("⚠️ Error sending message");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>Send WhatsApp Notification</h3>
      <input
        type="text"
        placeholder="Phone number (with country code)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ width: "300px", marginBottom: "10px" }}
      />
      <br />
      <textarea
        placeholder="Enter message"
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "300px" }}
      />
      <br />
      <button onClick={handleSend} style={{ marginTop: "10px" }}>
        📤 Send WhatsApp
      </button>
    </div>
  );
};

export default SendWhatsApp;
