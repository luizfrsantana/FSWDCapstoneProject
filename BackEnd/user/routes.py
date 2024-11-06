from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash,check_password_hash
from database.database_access import *

user = Blueprint('user', __name__)

@user.route('/user', methods=['POST', 'GET', 'DELETE', 'PUT'])
def handle_user():
    user_id = request.args.get('user_id')
    
    if request.method == 'POST': # Retrieve user details from JSON payload for adding a new user
        username = request.json.get('username')
        password = request.json.get('password')
        fullName = request.json.get('fullname')
        profile_picture = request.json.get('profile_picture')
        role = request.json.get('role')
        email = request.json.get('email')
        phoneNumber = request.json.get('phonenumber')
        status = request.json.get('status')

        # Validate required fields
        if not all([username, password, role, email]):
            return "Missing required fields!", 400

        # Hash password before saving
        hashed_password = generate_password_hash(password)
        try:
            add_user_to_database(get_db(), username, hashed_password, role, email, phoneNumber, status, fullName, profile_picture)
            return "User added!", 201 
        except Exception as e:
            return f"Error adding user: {str(e)}", 500

    elif request.method == 'GET' and not user_id: # Retrieve all users if no specific user ID is provided
        try:
            users = get_users(get_db())
            return jsonify(users), 200
        except Exception as e:
            return f"Error fetching users: {str(e)}", 500
        
    elif request.method == 'GET' and user_id: # Retrieve specific user details by user ID
        if not user_exists(get_db(), user_id):
            return f"User with ID {user_id} does not exist!", 404

        user = get_user_by_id(get_db(), user_id)

        return jsonify(user)
    elif request.method == 'DELETE': # Delete user by ID
        if not user_id:
            return "User ID is required!", 400
        
        if not user_exists(get_db(), user_id):
            return f"User with ID {user_id} does not exist!", 404
        
        delete_user_by_id(get_db(), user_id)

        return f"User with ID {user_id} deleted!", 200
    
    elif request.method == 'PUT' and user_id: # Update user details by ID
        if not user_exists(get_db(), user_id):
            return f"User with ID {user_id} does not exist!", 404
        
        # Retrieve user details for update
        username = request.json.get('username')
        password = request.json.get('password')
        fullName = request.json.get('fullname')
        profile_picture = request.json.get('profile_picture')
        role = request.json.get('role')
        email = request.json.get('email')
        phoneNumber = request.json.get('phonenumber')
        status = request.json.get('status')

        # Hash password before saving
        hashed_password = generate_password_hash(password)

        # Validate required fields
        if not all([username, role, email]):
            return "Missing required fields!", 400

        try:
            update_user_field_by_id(mysql, username,hashed_password, role, email, phoneNumber, status, fullName, profile_picture, user_id)
            return "User added!", 201 
        except Exception as e:
            return f"Error adding user: {str(e)}", 500