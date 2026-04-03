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
          login(res.data.token, res.data.user);
          
          // Force full reload so AuthContext + App re-initialize properly
          window.location.href = '/';
          // Alternative (even more reliable): window.location.reload();
        })
        .catch((err) => {
          console.error(err);
          alert('Invalid or expired magic link');
          window.location.href = '/';
        });
    }
  }, [login]);

  return <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '1.2rem' }}>
    Verifying your magic link... Please wait.
  </div>;
};

export default AuthVerify;
