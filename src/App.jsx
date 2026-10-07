import React from 'react';
import { HomePage } from './pages/HomePage';
import { Header } from './components/Header';

export function App() {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <HomePage />
      <Header />
    </div>
  );
}

export default App;