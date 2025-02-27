import sqlite3

def initialize_database():
    connection = sqlite3.connect('database.db')


    with open('schema.sql') as f:
        connection.executescript(f.read())

    cur = connection.cursor()

    cur.execute("INSERT INTO users (fullName, userName, email, password, phone, privillage) VALUES (?, ?, ?, ?, ?, ?)",
                ('Administrator', 'Admin', 'admin@test.com', 'admin@1234', 'x', 1)
                )



    connection.commit()
    connection.close()

if __name__ == '__main__':
    initialize_database()