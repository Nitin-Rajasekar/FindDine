from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlite3.connect('zomato.db')
    conn.row_factory = sqlite3.Row
    return conn

def fetch_country_codes():
    conn = get_db_connection()
    countries = conn.execute('SELECT * FROM countries').fetchall()
    conn.close()
    return {country['Country Code']: country['Country'] for country in countries}

country_code_mapping = fetch_country_codes()

@app.route('/restaurant/<int:restaurant_id>', methods=['GET'])
def get_restaurant(restaurant_id):
    conn = get_db_connection()
    restaurant = conn.execute('SELECT * FROM restaurants WHERE restaurant_id = ?', (restaurant_id,)).fetchone()
    conn.close()
    if restaurant is None:
        return jsonify({'error': 'Restaurant not found'}), 404
    return jsonify(dict(restaurant))

@app.route('/restaurants', methods=['GET'])
def get_restaurants():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    country = request.args.get('country', type=int)
    min_cost = request.args.get('min_cost', type=int)
    max_cost = request.args.get('max_cost', type=int)
    cuisines = request.args.get('cuisines')
    search = request.args.get('search')
    currency = request.args.get('currency')

    query = 'SELECT * FROM restaurants WHERE 1=1'
    params = []

    if country:
        query += ' AND country_code = ?'
        params.append(country)
    if min_cost:
        query += ' AND average_cost_for_two >= ?'
        params.append(min_cost)
    if max_cost:
        query += ' AND average_cost_for_two <= ?'
        params.append(max_cost)
    if cuisines:
        query += ' AND cuisines LIKE ?'
        params.append(f'%{cuisines}%')
    if search:
        query += ' AND (restaurant_name LIKE ? OR address LIKE ? OR locality LIKE ? OR locality_verbose LIKE ?)'
        params.extend([f'%{search}%', f'%{search}%', f'%{search}%', f'%{search}%'])
    if currency:
        query += ' AND currency = ?'
        params.append(currency)

    query += ' LIMIT ? OFFSET ?'
    params.extend([per_page, (page - 1) * per_page])

    conn = get_db_connection()
    restaurants = conn.execute(query, params).fetchall()
    conn.close()

    return jsonify([dict(row) for row in restaurants])

@app.route('/currencies', methods=['GET'])
def get_currencies():
    conn = get_db_connection()
    currencies = conn.execute('SELECT DISTINCT currency FROM restaurants').fetchall()
    conn.close()
    return jsonify([currency['currency'] for currency in currencies])

@app.route('/cuisines', methods=['GET'])
def get_cuisines():
    conn = get_db_connection()
    cuisines = conn.execute('SELECT DISTINCT cuisines FROM restaurants').fetchall()
    conn.close()

    unique_cuisines = set()
    for row in cuisines:
        if row['cuisines']:
            for cuisine in row['cuisines'].split(','):
                unique_cuisines.add(cuisine.strip())

    return jsonify(sorted(unique_cuisines))

@app.route('/countries', methods=['GET'])
def get_countries():
    conn = get_db_connection()
    countries = conn.execute('SELECT DISTINCT country_code FROM restaurants').fetchall()
    conn.close()

    unique_countries = [{'code': row['country_code'], 'name': country_code_mapping.get(row['country_code'], 'Unknown')} for row in countries]

    return jsonify(unique_countries)

if __name__ == '__main__':
    app.run(debug=True)
