from flask import request, jsonify, Blueprint
from database.database_access import *

from cisco.set_cisco_interfaces_config import configure_cisco
from cisco.get_cisco_interfaces import get_cisco_interfaces
from cisco.get_cisco_interfaces_status import get_cisco_interfaces_status

from juniper.set_juniper_interfaces_config import configure_juniper
from juniper.get_juniper_interfaces import get_juniper_interfaces
from utils.device_reachable import is_device_reachable


interfaces = Blueprint('interfaces', __name__)

@interfaces.route('/interface', methods=['GET'])
def getAllinterfaces():
    result = get_interfaces(get_db())
    return jsonify(result)

@interfaces.route('/update_interfaces', methods=['GET'])
def update_interfaces():
    interfaces_all_details = {}
    devices = get_devices(get_db())
    
    for device in devices:
        device_id = device.get('id')
        device_name = device.get('device_name')
        mgmt_ip = device.get('mgmt_ip')
        vendor = device.get('vendor')
        
        if vendor.lower() == 'cisco' and is_device_reachable(mgmt_ip):
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

        elif vendor.lower() == 'juniper' and is_device_reachable(mgmt_ip):
            interfaces_all_details = get_juniper_interfaces(mgmt_ip)
            is_juniper = True

        save_interfaces_to_db(get_db(), device_id, interfaces_all_details)

    return jsonify(interfaces_all_details)

@interfaces.route('/interface/update', methods=['POST'])
def set_interface_update():
    data = request.json
    device_id = data.get('device_id')
    description = data.get('description')
    interface = data.get('interface_name')
    ip = data.get('ip')

    deviceInformation = get_device_access_information_db_by_id(get_db(), device_id)
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

@interfaces.route('/api/interface/status', methods=['GET'])
def set_interface_status():
    host = request.args.get('host')
    return jsonify(get_cisco_interfaces_status(host))
