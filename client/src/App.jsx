import { useState } from 'react';
import './App.css';
import { UserProvider } from './context/UserContext';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './Routes';

function App() {
  return (
    <>
      <AuthProvider>
        <UserProvider>
          <AppRoutes />
        </UserProvider>
      </AuthProvider>
    </>
  );
}

export default App;
