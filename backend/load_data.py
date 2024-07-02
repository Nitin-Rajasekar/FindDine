import pandas as pd
import sqlite3

restaurant_data = pd.read_csv('zomato.csv', encoding='latin1')
country_data = pd.read_excel('Country-Code.xlsx', engine='openpyxl')

conn = sqlite3.connect('zomato.db')

create_restaurant_table_query = '''
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

create_country_table_query = '''
CREATE TABLE IF NOT EXISTS countries (
    "Country Code" INTEGER PRIMARY KEY,
    "Country" TEXT
);
'''

conn.execute(create_restaurant_table_query)
conn.execute(create_country_table_query)

restaurant_data.columns = [
    'restaurant_id', 'restaurant_name', 'country_code', 'city', 'address', 
    'locality', 'locality_verbose', 'longitude', 'latitude', 'cuisines', 
    'average_cost_for_two', 'currency', 'has_table_booking', 'has_online_delivery', 
    'is_delivering_now', 'switch_to_order_menu', 'price_range', 'aggregate_rating', 
    'rating_color', 'rating_text', 'votes'
]

restaurant_data.to_sql('restaurants', conn, if_exists='replace', index=False)
country_data.to_sql('countries', conn, if_exists='replace', index=False)

conn.commit()
conn.close()
