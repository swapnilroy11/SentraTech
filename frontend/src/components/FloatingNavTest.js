import React from 'react';

const FloatingNavTest = () => {
  console.log('FloatingNavTest rendering...');
  
  return (
    <div 
      style={{
        position: 'fixed',
        left: '20px',
        top: '50vh',
        width: '60px',
        height: '60px',
        backgroundColor: 'red',
        borderRadius: '30px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px',
        cursor: 'pointer'
      }}
    >
      ☰
    </div>
  );
};

export default FloatingNavTest;