import React, { useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AuthVerify = () => {
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      axios.get(`/api/auth/verify?token=${token}`)
        .then((res) => {
          console.log('✅ Magic link verified - logging in');
          login(res.data.token, res.data.user);
          
          // Full page reload ensures everything (App + Articles + modal) resets correctly
          setTimeout(() => {
            window.location.href = '/';
          }, 300);
        })
        .catch((err) => {
          console.error(err);
          alert('Invalid or expired magic link');
          window.location.href = '/';
        });
    }
  }, [login]);

  return (
    <div style={{ 
      textAlign: 'center', 
      marginTop: '120px', 
      fontSize: '1.3rem',
      color: '#333'
    }}>
      Verifying your magic link... Please wait a moment.
    </div>
  );
};

export default AuthVerify;
