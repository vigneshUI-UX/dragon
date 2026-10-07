import React from 'react';

export const Header = () => {
  return (
    <header style={{
      position: 'absolute',
      bottom: '24px',
      width: '100%',
      textAlign: 'center',
      pointerEvents: 'none',
      userSelect: 'none',
      zIndex: 10
    }}>
      <h1 style={{
        fontSize: '1.25rem',
        fontWeight: 800,
        letterSpacing: '1.5px',
        color: '#ffffff',
        textTransform: 'uppercase'
      }}>
        Cyber Dragon
      </h1>
    </header>
  );
};