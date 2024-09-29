import sqlite3

# Connect to the database (or create it if it doesn't exist)
conn = sqlite3.connect('measurements.db')

# Create a cursor object
cursor = conn.cursor()

# Create the measurements table
cursor.execute('''
CREATE TABLE IF NOT EXISTS measurements (
    id INTEGER,
    latitude REAL,
    longitude REAL,
    timestep INTEGER,
    temperature REAL,
    bleaching REAL,
    filename TEXT
)
''')

# Commit the changes and close the connection
conn.commit()
conn.close()