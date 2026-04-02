import React, { useState } from 'react';
import axios from 'axios';
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  width: 100%;
  max-width: 420px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
`;

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMagic = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage("");

    try {
      await axios.post('/api/auth/send-magic', { email });
      setMessage("✅ Magic link sent! Please check your email.");
      setEmail("");
    } catch (err) {
      setMessage("❌ Failed to send link. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Prevent closing when clicking inside the modal content
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={handleContentClick}>
        <h2>Login to the Blog</h2>
        <p>Enter your email to receive a magic login link.</p>

        <form onSubmit={handleSendMagic}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '12px', 
              margin: '15px 0', 
              fontSize: '1rem',
              border: '1px solid #ccc',
              borderRadius: '6px'
            }}
            required
            autoFocus
          />
          <button
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '12px', 
              background: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? "Sending..." : "Send Magic Link"}
          </button>
        </form>

        {message && (
          <p style={{ 
            marginTop: '1rem', 
            color: message.includes('✅') ? 'green' : 'red',
            fontWeight: '500'
          }}>
            {message}
          </p>
        )}

        <button 
          onClick={onClose} 
          style={{ 
            marginTop: '1.5rem', 
            background: 'none', 
            border: 'none', 
            color: '#666', 
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Close Window
        </button>
      </ModalContent>
    </ModalOverlay>
  );
};

export default LoginModal;
