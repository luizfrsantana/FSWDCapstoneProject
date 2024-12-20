from netmiko import ConnectHandler
from utils.config_loader import load_config
import re
import ipaddress
import yaml

config = load_config()

def convert_to_cidr(ip, mask):
    ip_interface = ipaddress.IPv4Interface(f"{ip}/{mask}")
    return str(ip_interface.with_prefixlen)

def get_cisco_interfaces(host, username=config["DEVICE_USER"], password=config["DEVICE_PASSWORD"]):

    pattern = re.compile(r'^interface (\S+)(?:\n\s*description (.+))?(?:[\s\S]*?ip address (\S+ \S+))?', re.MULTILINE)
    interfaces = []

    try:
        cisco_device = {
            'device_type': 'cisco_ios',
            'host': host,
            'username': username,
            'password': password,
        }
        net_connect = ConnectHandler(**cisco_device)
        config_output = net_connect.send_command("show run")
        
        for match in pattern.finditer(config_output):
            interface_name = match.group(1)
            description = match.group(2) if match.group(2) else "No description"
            ip_address = match.group(3) if match.group(3) else "No IP"
            if ip_address != "No IP":
                ip, mask = str(ip_address).split()
                ip_address = convert_to_cidr(ip, mask)
            
            interfaces.append({
                'interface_name': interface_name,
                'description': description,
                'ip_address': ip_address,
            })

        net_connect.disconnect()
        return interfaces
    except Exception as e:
        return str(e)