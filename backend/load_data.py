import pandas as pd
import sqlite3

# Load the data from CSV
data = pd.read_csv('zomato.csv', encoding='latin1')

# Connect to SQLite database (or create it)
conn = sqlite3.connect('zomato.db')

# Create a table for restaurants (adjust schema as needed)
create_table_query = '''
CREATE TABLE IF NOT EXISTS restaurants (
    restaurant_id INTEGER PRIMARY KEY,
    restaurant_name TEXT,
    country_code INTEGER,
    city TEXT,
    address TEXT,
    locality TEXT,
    locality_verbose TEXT,
    longitude REAL,
    latitude REAL,
    cuisines TEXT,
    average_cost_for_two INTEGER,
    currency TEXT,
    has_table_booking INTEGER,
    has_online_delivery INTEGER,
    is_delivering_now INTEGER,
    switch_to_order_menu INTEGER,
    price_range INTEGER,
    aggregate_rating REAL,
    rating_color TEXT,
    rating_text TEXT,
    votes INTEGER
);
'''

conn.execute(create_table_query)

# Rename columns in the dataframe to match the table schema
data.columns = [
    'restaurant_id', 'restaurant_name', 'country_code', 'city', 'address', 
    'locality', 'locality_verbose', 'longitude', 'latitude', 'cuisines', 
    'average_cost_for_two', 'currency', 'has_table_booking', 'has_online_delivery', 
    'is_delivering_now', 'switch_to_order_menu', 'price_range', 'aggregate_rating', 
    'rating_color', 'rating_text', 'votes'
]

# Insert data into the table
data.to_sql('restaurants', conn, if_exists='replace', index=False)

# Commit and close the connection
conn.commit()
conn.close()




