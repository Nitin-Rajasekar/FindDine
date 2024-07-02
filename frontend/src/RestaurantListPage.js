import React, { useState, useEffect } from 'react';
import './RestaurantListPage.css';

function RestaurantListPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [country, setCountry] = useState('');
  const [minCost, setMinCost] = useState('');
  const [maxCost, setMaxCost] = useState('');
  const [cuisines, setCuisines] = useState('');
  const [search, setSearch] = useState('');
  const [currency, setCurrency] = useState('');
  const [currencies, setCurrencies] = useState([]);
  const [cuisineOptions, setCuisineOptions] = useState([]);
  const [countries, setCountries] = useState([]);

  const fetchData = () => {
    let url = `http://localhost:5000/restaurants?page=${page}`;
    if (country) url += `&country=${country}`;
    if (minCost) url += `&min_cost=${minCost}`;
    if (maxCost) url += `&max_cost=${maxCost}`;
    if (cuisines) url += `&cuisines=${cuisines}`;
    if (search) url += `&search=${search}`;
    if (currency) url += `&currency=${currency}`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched data:', data);
        setRestaurants(data);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        setError(error);
      });
  };

  const fetchCurrencies = () => {
    fetch('http://localhost:5000/currencies')
      .then(response => response.json())
      .then(data => {
        setCurrencies(data);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  const fetchCuisines = () => {
    fetch('http://localhost:5000/cuisines')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched cuisines:', data);
        setCuisineOptions(data);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  const fetchCountries = () => {
    fetch('http://localhost:5000/countries')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched countries:', data);
        setCountries(data);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  useEffect(() => {
    fetchData();
  }, [page, country, minCost, maxCost, cuisines, search, currency]);

  useEffect(() => {
    fetchCurrencies();
    fetchCuisines();
    fetchCountries();
  }, []);

  return (
    <div className="container">
      <div className="header">
        <h1 className="logo">FindDine</h1>
      </div>
      <h1 className="title">Restaurant List</h1>
      {error && <div className="error">Error: {error.message}</div>}

      <div className="filters">
        <select value={country} onChange={e => setCountry(e.target.value)}>
          <option value="">Select Country</option>
          {countries.map((country, index) => (
            <option key={index} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Min Cost"
          value={minCost}
          onChange={e => setMinCost(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Cost"
          value={maxCost}
          onChange={e => setMaxCost(e.target.value)}
        />
        <select value={currency} onChange={e => setCurrency(e.target.value)}>
          <option value="">Select Currency</option>
          {currencies.map((cur, index) => (
            <option key={index} value={cur}>
              {cur}
            </option>
          ))}
        </select>
        <select value={cuisines} onChange={e => setCuisines(e.target.value)}>
          <option value="">Select Cuisine</option>
          {cuisineOptions.map((cuisine, index) => (
            <option key={index} value={cuisine}>
              {cuisine}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button onClick={fetchData}>Apply Filters</button>
      </div>

      <ul className="restaurant-list">
        {restaurants.map(restaurant => (
          <li key={restaurant.restaurant_id} className="restaurant-item" onClick={() => window.location.href = `/restaurant/${restaurant.restaurant_id}`}>
            <div className="restaurant-link">
              <div className="restaurant-info">
                <div className="restaurant-name">{restaurant.restaurant_name}</div>
                <div className="restaurant-rating">Rating: {restaurant.aggregate_rating} ({restaurant.votes} votes)</div>
              </div>
              <div className={`status-box ${restaurant.is_delivering_now === 'Yes' ? 'green' : 'red'}`}>
                {restaurant.is_delivering_now === 'Yes' ? 'Delivering Now' : 'Not Delivering Now'}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <button onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

export default RestaurantListPage;
