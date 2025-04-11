import React from 'react';
import { Toaster } from 'react-hot-toast';

const Notifications = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: '8px',
          background: '#fff',
          color: '#333',
          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
        },
        success: {
          iconTheme: {
            primary: '#10B981',
            secondary: '#FFFFFF',
          },
        },
        error: {
          iconTheme: {
            primary: '#EF4444',
            secondary: '#FFFFFF',
          },
        },
      }}
    />
  );
};

export default Notifications;