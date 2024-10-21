from flask import Flask, request, jsonify
from flask_cors import CORS
from set_juniper_interfaces_config import configure_juniper
from set_cisco_interfaces_config import configure_cisco
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash
from get_cisco_interfaces import get_cisco_interfaces
from get_cisco_informations import get_cisco_informations
from get_juniper_interfaces import get_juniper_interfaces
from get_juniper_informations import get_juniper_informations
from device_reachable import is_device_reachable
from database_access import *

app = Flask(__name__)
CORS(app)

###### Database access parameters ######
app.config['MYSQL_HOST'] = '172.17.0.2'
app.config['MYSQL_PORT'] = 3306
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'admin123'
app.config['MYSQL_DB'] = 'mydatabase'

mysql = MySQL(app)

##### CONNECTIONS ROUTES #####

@app.route('/get_connections', methods=['GET'])
def get_connections():
    result = get_connections_db(mysql)
    return jsonify(result)

@app.route('/add_connection', methods=['POST'])
def add_connection():
    id_interface_a = request.json['id_interface_a']
    id_interface_z = request.json['id_interface_z']
    action_connection_to_db(mysql,'POST', id_interface_a,id_interface_z)
    return "Connection added!"

@app.route('/delete_connection', methods=['DELETE'])
def delete_connection():
    id_interface_a = request.json['id_interface_a']
    id_interface_z = request.json['id_interface_z']
    action_connection_to_db(mysql,'DELETE', id_interface_a,id_interface_z)
    return "Connection deleted!"

##### USER ROUTES #####

@app.route('/api/user', methods=['POST', 'GET', 'DELETE'])
def handle_user():
    user_id = request.args.get('user_id')
    
    if request.method == 'POST':
        username = request.json.get('username')
        password = request.json.get('password')
        fullName = request.json.get('fullName')
        profile_picture = request.json.get('profile_picture')
        role = request.json.get('role')
        email = request.json.get('email')
        phoneNumber = request.json.get('phoneNumber')
        status = request.json.get('status')

        if not all([username, password, role, email]):
            return "Missing required fields!", 400

        hashed_password = generate_password_hash(password)
        try:
            add_user_to_database(mysql, username, hashed_password, role, email, phoneNumber, status, fullName, profile_picture)
            return "User added!", 201 
        except Exception as e:
            return f"Error adding user: {str(e)}", 500

    elif request.method == 'GET' and not user_id:
        try:
            users = get_users(mysql)
            return jsonify(users), 200
        except Exception as e:
            return f"Error fetching users: {str(e)}", 500
        
    elif request.method == 'GET' and user_id:
        if not user_exists(mysql, user_id):
            return f"User with ID {user_id} does not exist!", 404

        user = get_user_by_id(mysql, user_id)

        return jsonify(user)
    elif request.method == 'DELETE':
        if not user_id:
            return "User ID is required!", 400
        
        if not user_exists(mysql, user_id):
            return f"User with ID {user_id} does not exist!", 404
        
        delete_user_by_id(mysql, user_id)

        return f"User with ID {user_id} deleted!", 200

@app.route('/update_user_field', methods=['PATCH'])
def update_user_field():
    user_id = request.args.get('user_id')

    if not user_id:
        return "User ID is required!", 400

    if not user_exists(mysql, user_id):
        return f"User with ID {user_id} does not exist!", 404

    data = request.get_json()
    if not data or 'field' not in data or 'new_value' not in data:
        return "Field and new value are required!", 400

    field = data.get('field')
    new_value = data.get('new_value')

    if field == "password":
        new_value = generate_password_hash(new_value)

    try:
        update_user_field_by_id(mysql, field, new_value, user_id)
    except Exception as e:
        return f"Error updating user: {str(e)}", 500

    return f"User {field} updated successfully!", 200



##### DEVICES ROUTES #####

@app.route('/delete_device', methods=['DELETE'])
def delete_device():
    mgmt_ip = request.args.get('mgmt_ip')

    try:
        delete_device_to_database(mysql, mgmt_ip)
    except Exception as e:
        return f"Error deleting device: {str(e)}", 500
    
    return f"Device with MGTM IP {mgmt_ip} deleted!", 200

@app.route('/add_device', methods=['POST'])
def add_device():
    data = request.json
    mgmt_ip = data.get('mgmt_ip')
    vendor = data.get('vendor')

    try:
        add_device_to_database(mysql, mgmt_ip, vendor)
    except Exception as e:
        return f"Error adding device: {str(e)}", 500
    
    if not is_device_reachable(mgmt_ip):
        return jsonify({"status": "error", "message": f"Device {mgmt_ip} is not reachable"}), 500
    
    if vendor.lower() == 'cisco':
        device_informations = get_cisco_informations(mgmt_ip)
        is_juniper = False
    elif vendor.lower() == 'juniper':
        device_informations = get_juniper_informations(mgmt_ip)
        is_juniper = True
        
    else:
        return jsonify({"status":"error", "message": "Vendor {vendor} not supported"}), 400

    if not all([device_informations]):
        return jsonify({"status":"error", "message": "Missing parameters"}), 400
    
    try:
        update_device_informations(mysql, mgmt_ip, device_informations)
    except Exception as e:
        return f"Error updating device informations: {str(e)}", 500
    
    result = get_device_by_ip_database(mysql, mgmt_ip)
    return jsonify(result)

@app.route('/update_device', methods=['PATCH'])
def update_device():
    mgmt_ip = request.args.get('mgmt_ip')
    vendor = request.args.get('vendor')

    if not is_device_reachable(mgmt_ip):
        return jsonify({"status": "error", "message": f"Device {mgmt_ip} is not reachable"}), 500
    
    try:

        if vendor.lower() == 'cisco':
            device_informations = get_cisco_informations(mgmt_ip)
        elif vendor.lower() == 'juniper':
            device_informations = get_juniper_informations(mgmt_ip)

        update_device_informations(mysql, mgmt_ip, device_informations)
    except Exception as e:
        return f"Error updating device informations: {str(e)}", 500
    
    result = get_device_by_ip_database(mysql, mgmt_ip)
    return jsonify(result)

##### INTERFACES ROUTES #####

@app.route('/update_interfaces', methods=['GET'])
def update_interfaces():
    all_interfaces = []
    devices = get_devices(mysql)
    
    for device in devices:
        device_id, device_name, mgmt_ip, vendor, os_version  = device
        
        if not is_device_reachable(mgmt_ip):
            all_interfaces.append({
                'id': device_id,
                'device_name': device_name,
                'mgmt_ip': mgmt_ip,
                'vendor': vendor,
                'error': f"Device {mgmt_ip} is not reachable"
            })
            continue 
        
        if vendor.lower() == 'cisco':
            interfaces = get_cisco_interfaces(mgmt_ip)
            is_juniper = False
        elif vendor.lower() == 'juniper':
            interfaces = get_juniper_interfaces(mgmt_ip)
            is_juniper = True
        else:
            all_interfaces.append({
                'id': device_id,
                'device_name': device_name,
                'mgmt_ip': mgmt_ip,
                'vendor': vendor,
                'error': f"Vendor {vendor} not supported"
            })
            continue 

        save_interfaces_to_db(mysql, device_id, interfaces, is_juniper)

        all_interfaces.append({
            'id': device_id,
            'device_name': device_name,
            'mgmt_ip': mgmt_ip,
            'vendor': vendor,
            'interfaces': interfaces
        })

    return jsonify(all_interfaces)


@app.route('/configure/juniper', methods=['POST'])
def configure_juniper_device():
    data = request.json
    host = data.get('host')
    description = data.get('description')
    interface = data.get('interface')
    ip = data.get('ip')

    if not is_device_reachable(host):
        return jsonify({"status": "error", "message": f"Device {host} is not reachable"}), 500

    if not all([host,description,interface,ip]):
        return jsonify({"status":"error", "message": "Missing parameters"}), 400
    
    result = configure_juniper(host,description,interface,ip)
    return jsonify(result)

@app.route('/configure/cisco', methods=['POST'])
def configure_cisco_device():
    data = request.json
    host = data.get('host')
    description = data.get('description')
    interface = data.get('interface')
    ip = data.get('ip')

    if not is_device_reachable(host):
        return jsonify({"status": "error", "message": f"Device {host} is not reachable"}), 500

    if not all([host,description,interface,ip]):
        return jsonify({"status":"error", "message": "Missing parameters"}), 400
    
    result = configure_cisco(host, description, interface, ip)
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)