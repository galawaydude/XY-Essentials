import { useState } from 'react';
import './App.css';
import AppRoutes from './Routes';
import Sidebar from './components/sidebar/Sidebar';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;
