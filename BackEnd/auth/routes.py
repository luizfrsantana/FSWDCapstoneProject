from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash
from database.database_access import *

auth = Blueprint('auth', __name__)

@auth.route("/login", methods=["POST"])
def login():
    # Retrieve username and password from JSON payload
    username = request.json.get("username")
    password = request.json.get("password")

    # Fetch user details from the database
    db = get_db()
    user = get_user_by_username(db,username)

    if not user:
        return jsonify({"msg": "User not found"}), 404
        
    stored_password_hash = user["password"]

    # Check if password is correct and generate JWT token if valid
    if check_password_hash(stored_password_hash, password):
        access_token = create_access_token(identity={"username": user["username"], "role": user["role"]}) 
        return jsonify(token=access_token), 200
    else:
        return jsonify({"msg": "Incorrect password"}), 401