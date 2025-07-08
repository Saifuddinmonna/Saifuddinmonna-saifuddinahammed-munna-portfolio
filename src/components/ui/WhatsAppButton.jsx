import { FaWhatsapp } from "react-icons/fa";
import { useState } from "react";

const WhatsAppButton = () => {
  const phone = "8801623361191"; // User's WhatsApp number
  const message = "Hello, আমি আপনার ওয়েবসাইট থেকে যোগাযোগ করছি।";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  const [hovered, setHovered] = useState(false);

  // Responsive bottom position: 10% for desktop, 15% for mobile
  const bottom = window.innerWidth < 600 ? "15%" : "10%";

  return (
    <div
      style={{
        position: "fixed",
        bottom: bottom,
        right: 20,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tooltip */}
      {hovered && (
        <div
          style={{
            marginBottom: 10,
            background: "rgba(34,34,34,0.95)",
            color: "#fff",
            padding: "8px 14px",
            borderRadius: 8,
            fontSize: 14,
            boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
            whiteSpace: "pre-line",
            textAlign: "center",
            maxWidth: 180,
            pointerEvents: "none",
          }}
        >
          Need help? Chat with us\nসাহায্য লাগবে? WhatsApp-এ মেসেজ করুন
        </div>
      )}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          backgroundColor: "#25D366",
          color: "white",
          borderRadius: "50%",
          width: 60,
          height: 60,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          fontSize: 30,
          cursor: "pointer",
          animation: "whatsapp-bounce 1.2s infinite alternate",
        }}
        aria-label="Chat on WhatsApp"
        title="Need help? Chat with us | সাহায্য লাগবে? WhatsApp-এ মেসেজ করুন"
      >
        <FaWhatsapp />
      </a>
      {/* Animation keyframes */}
      <style>{`
        @keyframes whatsapp-bounce {
          0% { transform: translateY(0) scale(1); }
          60% { transform: translateY(-10px) scale(1.08); }
          100% { transform: translateY(-4px) scale(1.04); }
        }
      `}</style>
    </div>
  );
};

export default WhatsAppButton;
