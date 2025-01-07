from flask import Flask, request, jsonify
import sqlite3
import jwt
import requests
import json
import subprocess  # For executing a shell command
import os
import db_init
from flask_restx import Api, Resource, fields

app = Flask(__name__)
api = Api(app, version='1.0', title='Python Flask API', description='API documentation')

ns = api.namespace('api', description='API operations')

user_model = api.model('User', {
    'fullName': fields.String(required=True, description="The client's full name"),
    'userName': fields.String(required=True, description="The client's username"),
    'email': fields.String(required=True, description="The client's email"),
    'password': fields.String(required=True, description="The client's password"),
    'phone': fields.String(required=True, description="The client's phone number"),
})

login_model = api.model('Login', {
    'userName': fields.String(description="The client's username"),
    'email': fields.String(description="The client's email"),
    'password': fields.String(required=True, description="The client's password"),
})

update_model = api.model('UpdatePassword', {
    'token': fields.String(required=True, description="The client's authentication token"),
    'currentPassword': fields.String(required=True, description="The client's current password"),
    'newPassword': fields.String(required=True, description="The client's new password"),
})

def get_db_connection():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    return conn

def generateJWT(payload):
    secret = '123456'
    algorithm = 'HS256'
    token = jwt.encode(payload, secret, algorithm=algorithm)
    print(token)
    return token

def decodeNoneJwt(token):
    secret = '123456'
    algorithm = 'HS256'
    data = jwt.decode(token, secret, options={"verify_signature": False})
    print(data)
    return data

@ns.route("/")
class Hello(Resource):
    def get():
        """
        Get Hello World
        """
        dbConn = get_db_connection()
        testConn = dbConn.cursor()
        testConn = dbConn.execute('select * from users').fetchall()
        dbConn.close()
        print(testConn)
        return "<p>Hello, World!</p>"

@ns.route("/health")
class Health(Resource):
    def get():
        """
        Get Health Status
        """
        dbConn = get_db_connection()
        testConn = dbConn.cursor()
        testConn = dbConn.execute('SELECT name FROM sqlite_master WHERE type="table"').fetchall()
        dbConn.close()
        print(testConn)
        return "{'status':'up'}"

@ns.route('/client_registeration')
class Register(Resource):
    @api.expect(user_model)
    def post(self):
        """
        Register a new client
        """
        fullName = request.json['fullName']
        userName = request.json['userName']
        email = request.json['email']
        password = request.json['password']
        phone = request.json['phone']
        if fullName != '' and userName != '' and email != '' and password != '' and phone != '':
            dbConn = get_db_connection()
            dbCursor = dbConn.cursor()
            q = 'select userName from users where email = "' + email + '"'
            dbData = dbCursor.execute(q).fetchall()
            if len(dbData) > 0:
                return {'msg':'Email already Exist'}
            
            dbCursor.execute("INSERT INTO users (fullName, userName, email, password, phone, privillage) VALUES (?, ?, ?, ?, ?, ?)",
                (fullName, userName, email, password, phone, 2)
                )
            dbConn.commit()
            dbConn.close()       
            return {'msg':'User Registered'}
        else:
            return {'msg':'Invalid Data'}

@ns.route('/client_login')
class Login(Resource):
    @api.expect(login_model)
    def post(self):
        """
        Client login
        """
        print('request.json')
        print('request.json',request.json.get('userName'))
        # print(request.json.get('userName'))
        userName = request.json.get('userName')
        email = request.json.get('email')
        password = request.json['password']
        qMail = 'select privillage from users where email = "' + email +'" and password = "' + password + '"'
        qUser = 'select privillage from users where userName = "' + userName +'"'
        dbConn = get_db_connection()
        dbCursor = dbConn.cursor()
        if email:
            dbData = dbCursor.execute(qMail).fetchall()
            if len(dbData) > 0:
                role = dbData[0][0]
                payload = {'userName':userName,'email':email,'role':role}
                token = generateJWT(payload)
                return {'token':token}
            else:
                return {'msg':'In correct email or password'}
        
        elif userName:
            dbData = dbCursor.execute(qUser).fetchall()
            if len(dbData) > 0:
                role = dbData[0][0]
                payload = {'userName':userName,'email':email,'role':role}
                token = generateJWT(payload)
                return {'token':token}
            else:
                return {'msg':'In correct username or password'}
            
        else:
            return {'msg':'Failed'}

@ns.route('/update_info')
class UpdatePassword(Resource):
    @api.expect(update_model)
    def post(self):
        """
        Update user password
        """
        token = request.json['token']
        currentPassword = request.json['currentPassword']
        newPassword = request.json['newPassword']
        
        try:
            data = decodeNoneJwt(token)
            updatePassByUsername = 'update users set password = "' + newPassword + '" where userName = "' + data['userName'] + '"'
            updatePassByEmail = 'update users set password = "' + newPassword + '" where userName = "' + data['email'] + '"'
            selectQ = 'select privillage from users where userName = "{userName}" and email = "{email}" and password = "{password}"'.format(userName = data['userName'], email=data['email'], password = currentPassword)
            dbConn = get_db_connection()
            dbCursor = dbConn.cursor()
            dbData = dbCursor.execute(selectQ).fetchall()
            if data['role'] == 1:
                dbCursor.execute(updatePassByUsername)
                dbConn.commit()
                dbConn.close()
                return {'msg':'Password Reset Forced By Admin Role'}
            
            if len(dbData) > 0:
                dbCursor.execute(updatePassByUsername)
                dbConn.commit()
                dbConn.close()
                return {'msg':'Password Reset'}
            else:
                return {'msg':'Invalid Data'}

        except:
            return {'msg':'Token Not Valid'}

        return {'msg':'Error'}

@ns.route('/products')
class Products(Resource):
    @api.doc(params={'source': 'The source URL for the product list'})
    def get(self):
        """
        List products
        """
        try:
            source = request.args.get('source', 'https://dummyjson.com/products')
            data = requests.get(source).content
            jsonData = {}
            try:
                jsonData = json.loads(data)
                return jsonData
            except:
                return data
        except:
            return {'msg':'Error'}

api.add_namespace(ns)

if __name__ == '__main__':
    print('Starting Server')
    initialize_database = bool(os.environ.get('RE_INITIALIZE_DB', 'False'))
    print('initialize_database:', initialize_database)
    if initialize_database == True:
        db_init.initialize_database()
    app.run(host='0.0.0.0', debug=True)
