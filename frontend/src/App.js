
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RestaurantListPage from './RestaurantListPage';
import RestaurantDetailPage from './RestaurantDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
        <Route path="/" element={<RestaurantListPage />} />
      </Routes>
    </Router>
  );
}

export default App;




