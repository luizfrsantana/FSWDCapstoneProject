from netmiko import ConnectHandler
import re

def get_cisco_informations(host, username='admin', password='admin123'):

    version_pattern = re.compile(r'Cisco IOS Software, .*Version ([\S]+),')
    hostname_pattern = re.compile(r'hostname (\S+)')
    serial_pattern = re.compile(r'System serial number\s+:\s+(\S+)')
    model_pattern = re.compile(r'[Cc]isco (\S+) .*bytes of memory')

    try:
        cisco_device = {
            'device_type': 'cisco_ios',
            'host': host,
            'username': username,
            'password': password,
        }
        net_connect = ConnectHandler(**cisco_device)

        version_output = net_connect.send_command("show version")
        config_output = net_connect.send_command("show run | include hostname")

        hostname_match = hostname_pattern.search(config_output)
        version_match = version_pattern.search(version_output)
        serial_match = serial_pattern.search(version_output)
        model_match = model_pattern.search(version_output)
        
        hostname = hostname_match.group(1) if hostname_match else "Hostname not found"
        os_version = version_match.group(1) if version_match else "OS version not found"
        serial_number = serial_match.group(1) if serial_match else "Serial number not found"
        model = model_match.group(1) if model_match else "Model not found"
        
        net_connect.disconnect()
        
        return {
            'hostname': hostname,
            'os_version': os_version,
            'serial_number': serial_number,
            'model': model
        }
    
    except Exception as e:
        return str(e)