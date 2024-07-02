import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './RestaurantDetailPage.css';

function RestaurantDetailPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/restaurant/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched data:', data);
        setRestaurant(data);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        setError(error);
      });
  }, [id]);

  const renderStars = (priceRange) => {
    const stars = [];
    for (let i = 0; i < priceRange; i++) {
      stars.push('★');
    }
    for (let i = priceRange; i < 5; i++) {
      stars.push('☆');
    }
    return stars.join(' ');
  };

  if (error) {
    return <div className="error">Error: {error.message}</div>;
  }

  if (!restaurant) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="header">
        <h1 className="logo">FindDine</h1>
      </div>
      <h1 className="title">{restaurant.restaurant_name}</h1>
      <div className="detail">
        <p><strong>Address:</strong> {restaurant.address}</p>
        <p><strong>City:</strong> {restaurant.city}</p>
        <p><strong>Cuisines:</strong> {restaurant.cuisines}</p>
        <p>
          <strong>Average Cost for Two:</strong> {restaurant.average_cost_for_two} {restaurant.currency}
          <span className="stars"> ({renderStars(restaurant.price_range)})</span>
        </p>
        <p><strong>Aggregate Rating:</strong> {restaurant.aggregate_rating} ({restaurant.votes} votes)</p>
        <div className="statuses">
          <div className={`status-box ${restaurant.has_online_delivery === 'Yes' ? 'green' : 'red'}`}>
            {restaurant.has_online_delivery === 'Yes' ? 'Online Delivery' : 'No Online Delivery'}
          </div>
          <div className={`status-box ${restaurant.has_table_booking === 'Yes' ? 'green' : 'red'}`}>
            {restaurant.has_table_booking === 'Yes' ? 'Table Booking' : 'No Table Booking'}
          </div>
          <div className={`status-box ${restaurant.is_delivering_now === 'Yes' ? 'green' : 'red'}`}>
            {restaurant.is_delivering_now === 'Yes' ? 'Delivering Now' : 'Not Delivering Now'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantDetailPage;
