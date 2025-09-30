import React from 'react';
import { HomePage } from './pages/HomePage';
import { AppProvider } from './context/AppContext';

export const App = () => {
  return (
    <AppProvider>
      <HomePage />
    </AppProvider>
  );
};
