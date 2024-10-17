from netmiko import ConnectHandler
import re

def get_cisco_interfaces(host, username='admin', password='admin123'):

    pattern = re.compile(r'^interface (\S+)\n(?: description (.+))?.*\n(?: ip address (\S+ \S+))?', re.MULTILINE)
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
            
            interfaces.append({
                'interface_name': interface_name,
                'description': description,
                'ip_address': ip_address
            })

        net_connect.disconnect()
        return interfaces
    except Exception as e:
        return str(e)