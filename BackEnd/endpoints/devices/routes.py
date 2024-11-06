from flask import Blueprint, request, jsonify
from database.database_access import *

from utils.device_reachable import is_device_reachable
from cisco.get_cisco_informations import get_cisco_informations
from juniper.get_juniper_informations import get_juniper_informations


devices = Blueprint('devices',__name__)

@devices.route('/device', methods=['GET','POST','DELETE','PATCH'])
def handle_device():
    mgmt_ip = request.args.get('mgmt_ip')
    id = request.args.get('id')

    if request.method == "GET": # Retrieve all devices
        result = get_devices(get_db())
        return jsonify(result)
    
    elif request.method == 'POST': # Add new device
        data = request.json
        mgmt_ip = data.get('mgmt_ip')
        vendor = data.get('vendor')

        location = data.get('location')
        installation_date = None if data.get('installation_date') == "NaN-NaN-NaN" else data.get('installation_date')
        warranty_expiration = None if data.get('warranty_expiration') == "NaN-NaN-NaN" else data.get('warranty_expiration')
        last_maintenance = None if data.get('last_maintenance') == "NaN-NaN-NaN" else data.get('last_maintenance')
        support_contact = data.get('support_contact')
        notes = data.get('notes')

        # Check device status and add it to the database
        status = "DOWN" if not is_device_reachable(mgmt_ip) else "UP"

        try:
            add_device_to_database(get_db(), mgmt_ip, vendor, location, installation_date,warranty_expiration,last_maintenance,support_contact,notes, status)
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
                update_device_informations_from_device(get_db(), mgmt_ip, device_informations)
            except Exception as e:
                return f"Error updating device informations: {str(e)}", 500
        
        result = get_device_by_ip_database(get_db(), mgmt_ip)
        return jsonify(result)
    
    elif request.method == "DELETE" and id: # Delete device by ID
        try:
            delete_device_to_database(get_db(), id)
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
                update_device_informations_from_device(get_db(), mgmt_ip, device_informations)

        elif vendor.lower() == 'juniper' and status == "UP":
                device_informations = get_juniper_informations(mgmt_ip)
                update_device_informations_from_device(get_db(), mgmt_ip, device_informations)
        try:
            update_device_informations(get_db(), mgmt_ip, vendor,location, installation_date, warranty_expiration, last_maintenance, support_contact, notes, status)
        except Exception as e:
            print(f"Error updating device informations in database: {str(e)}")
    except Exception as e:
        return f"General error: {str(e)}", 500
    
    result = get_device_by_ip_database(get_db(), mgmt_ip)
    return jsonify(result)