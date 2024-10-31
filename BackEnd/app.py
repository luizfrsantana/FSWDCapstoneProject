from flask import Flask, request, jsonify
from flask_cors import CORS
from set_juniper_interfaces_config import configure_juniper
from set_cisco_interfaces_config import configure_cisco
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash
from get_cisco_interfaces import get_cisco_interfaces
from get_cisco_informations import get_cisco_informations
from get_cisco_interfaces_status import get_cisco_interfaces_status
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

@app.route('/api/connections', methods=['GET','POST','DELETE'])
def handle_connections():
    
    if request.method == 'GET':
        result = get_connections_db(mysql)
        return jsonify(result)
    elif request.method == 'POST':
        connection = request.json
        action_connection_to_db(mysql,'POST', connection)
        return "Connection added!"

    elif request.method == 'DELETE':
        connection = request.json
        action_connection_to_db(mysql,'DELETE', connection)
        return "Connection deleted!"


##### USER ROUTES #####

@app.route('/api/user', methods=['POST', 'GET', 'DELETE', 'PUT'])
def handle_user():
    user_id = request.args.get('user_id')
    
    if request.method == 'POST':
        username = request.json.get('username')
        password = request.json.get('password')
        fullName = request.json.get('fullname')
        profile_picture = request.json.get('profile_picture')
        role = request.json.get('role')
        email = request.json.get('email')
        phoneNumber = request.json.get('phonenumber')
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
    
    elif request.method == 'PUT' and user_id:
        if not user_exists(mysql, user_id):
            return f"User with ID {user_id} does not exist!", 404
        
        username = request.json.get('username')
        fullName = request.json.get('fullname')
        profile_picture = request.json.get('profile_picture')
        role = request.json.get('role')
        email = request.json.get('email')
        phoneNumber = request.json.get('phonenumber')
        status = request.json.get('status')

        if not all([username, role, email]):
            return "Missing required fields!", 400

        try:
            update_user_field_by_id(mysql, username, role, email, phoneNumber, status, fullName, profile_picture, user_id)
            return "User added!", 201 
        except Exception as e:
            return f"Error adding user: {str(e)}", 500
        
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

@app.route('/api/device', methods=['GET','POST','DELETE','PATCH'])
def handle_device():
    mgmt_ip = request.args.get('mgmt_ip')
    id = request.args.get('id')

    if request.method == "GET":
        result = get_devices(mysql)
        return jsonify(result)
    
    elif request.method == 'POST':
        data = request.json
        mgmt_ip = data.get('mgmt_ip')
        vendor = data.get('vendor')

        location = data.get('location')
        installation_date = None if data.get('installation_date') == "NaN-NaN-NaN" else data.get('installation_date')
        warranty_expiration = None if data.get('warranty_expiration') == "NaN-NaN-NaN" else data.get('warranty_expiration')
        last_maintenance = None if data.get('last_maintenance') == "NaN-NaN-NaN" else data.get('last_maintenance')
        support_contact = data.get('support_contact')
        notes = data.get('notes')

        status = "DOWN" if not is_device_reachable(mgmt_ip) else "UP"

        try:
            add_device_to_database(mysql, mgmt_ip, vendor, location, installation_date,warranty_expiration,last_maintenance,support_contact,notes, status)
        except Exception as e:
            return f"Error adding device: {str(e)}", 500
        
        if is_device_reachable(mgmt_ip):
        
            if vendor.lower() == 'cisco':
                device_informations = get_cisco_informations(mgmt_ip)
            elif vendor.lower() == 'juniper':
                device_informations = get_juniper_informations(mgmt_ip)
            else:
                return jsonify({"status":"error", "message": "Vendor {vendor} not supported"}), 400

            if not all([device_informations]):
                return jsonify({"status":"error", "message": "Missing parameters"}), 400
        
            try:
                update_device_informations_from_device(mysql, mgmt_ip, device_informations)
            except Exception as e:
                return f"Error updating device informations: {str(e)}", 500
        
        result = get_device_by_ip_database(mysql, mgmt_ip)
        return jsonify(result)
    
    elif request.method == "DELETE" and id:
        try:
            delete_device_to_database(mysql, id)
        except Exception as e:
            return f"Error deleting device: {str(e)}", 500
        
        return f"Device deleted!", 200
    
    elif request.method == "PATCH":
        mgmt_ip = request.json.get("mgmt_ip")
        vendor = request.json.get("vendor")
        location = request.json.get("location")
        installation_date = None if request.json.get("installation_date") == "" else request.json.get("installation_date")
        warranty_expiration = None if request.json.get("warranty_expiration") == "" else request.json.get("warranty_expiration")
        last_maintenance = None if request.json.get("last_maintenance") == "" else request.json.get("last_maintenance")
        support_contact = request.json.get("support_contact")
        notes = request.json.get("notes")

        status = "DOWN" if not is_device_reachable(mgmt_ip) else "UP"
        
    try:
        if vendor.lower() == 'cisco' and status == "UP":
                device_informations = get_cisco_informations(mgmt_ip)
                update_device_informations_from_device(mysql, mgmt_ip, device_informations)

        elif vendor.lower() == 'juniper' and status == "UP":
                device_informations = get_juniper_informations(mgmt_ip)
                update_device_informations_from_device(mysql, mgmt_ip, device_informations)
        try:
            update_device_informations(mysql, mgmt_ip, vendor,location, installation_date, warranty_expiration, last_maintenance, support_contact, notes, status)
        except Exception as e:
            print(f"Error updating device informations in database: {str(e)}")
    except Exception as e:
        return f"General error: {str(e)}", 500
    
    result = get_device_by_ip_database(mysql, mgmt_ip)
    return jsonify(result)

##### INTERFACES ROUTES #####

@app.route('/api/interface', methods=['GET'])
def getAllinterfaces():
    result = get_interfaces(mysql)
    return jsonify(result)

@app.route('/api/update_interfaces', methods=['GET'])
def update_interfaces():
    interfaces_all_details = {}
    devices = get_devices(mysql)
    
    for device in devices:
        device_id = device.get('id')
        device_name = device.get('device_name')
        mgmt_ip = device.get('mgmt_ip')
        vendor = device.get('vendor')
        
        if vendor.lower() == 'cisco':
            dict1 = get_cisco_interfaces(mgmt_ip)
            dict2 = get_cisco_interfaces_status(mgmt_ip)

            interfaces_partial_details = {entry['interface_name']: entry for entry in dict1}
            

            for interface_name, details in dict2.items():
                description = interfaces_partial_details.get(interface_name, {}).get('description', 'No description')
                ip_address = interfaces_partial_details.get(interface_name, {}).get('ip_address', 'No IP')

                interfaces_all_details[interface_name] = {
                    "last_down": details.get("last_down"),
                    "last_up": details.get("last_up"),
                    "physical_status": details.get("physical_status"),
                    "protocol_status": details.get("protocol_status"),
                    "vlan": details.get("vlan"),
                    "description": description,
                    "ip_address": ip_address
                }

            for interface_name, details in interfaces_partial_details.items():
                if interface_name not in interfaces_all_details:
                    interfaces_all_details[interface_name] = {
                        "last_down": None,
                        "last_up": None,
                        "physical_status": "Unknown",
                        "protocol_status": "Unknown",
                        "vlan": "No VLAN",
                        "description": details.get("description", "No description"),
                    }

            is_juniper = False

        elif vendor.lower() == 'juniper':
            interfaces_all_details = get_juniper_interfaces(mgmt_ip)
            is_juniper = True

        save_interfaces_to_db(mysql, device_id, interfaces_all_details, is_juniper)

    return jsonify(interfaces_all_details)


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

@app.route('/api/interface/update', methods=['POST'])
def set_interface_update():
    data = request.json
    device_id = data.get('device_id')
    description = data.get('description')
    interface = data.get('interface_name')
    ip = data.get('ip')

    deviceInformation = get_device_access_information_db_by_id(mysql, device_id)
    host = deviceInformation[0]["mgmt_ip"]
    vendor = deviceInformation[0]["vendor"]


    
    if not is_device_reachable(host):
        return jsonify({"status": "error", "message": f"Device {host} is not reachable"}), 500

    if not all([host,description,interface,ip]):
        return jsonify({"status":"error", "message": "Missing parameters"}), 400
    
    if vendor == "cisco":
        result = configure_cisco(host, description, interface, ip)
    elif vendor == "juniper":
        result = configure_juniper(host, description, interface, ip)
        
    return jsonify(result)

@app.route('/api/interface/status', methods=['GET'])
def set_interface_status():
    host = request.args.get('host')
    return jsonify(get_cisco_interfaces_status(host))
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)