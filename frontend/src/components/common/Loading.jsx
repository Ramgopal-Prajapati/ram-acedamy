import React from 'react';

const Loading = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'var(--primary-bg)'
    }}>
      <div className="loading-spinner"></div>
    </div>
  );
};

export default Loading;