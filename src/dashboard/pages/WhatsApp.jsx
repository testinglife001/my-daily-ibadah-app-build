import React, { useState } from "react";

const WhatsApp = () => {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    // Remove non-numeric characters (keep only digits)
    const cleanedPhone = phone.replace(/\D/g, "");
    const encodedMessage = encodeURIComponent(message);

    if (!cleanedPhone || !message) {
        console.log("Please enter both phone number and message.")
      alert("Please enter both phone number and message.");
      return;
    }

    const waLink = `https://wa.me/${cleanedPhone}?text=${encodedMessage}`;
    window.open(waLink, "_blank");
    console.log(waLink);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Send WhatsApp Message</h2>

      <input
        type="text"
        placeholder="Enter phone number (with country code)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={styles.input}
      />

      <textarea
        placeholder="Enter your message"
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={styles.textarea}
      />

      <button onClick={handleSend} style={styles.button}>
        📲 Send via WhatsApp
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "100px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
  },
  title: {
    marginBottom: "20px",
    color: "#25D366",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    resize: "none",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#25D366",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default WhatsApp;
