from netmiko import ConnectHandler
import re

def get_cisco_informations(host, username='admin', password='admin123'):

    version_pattern = re.compile(r'Cisco IOS Software, .*Version ([\S]+),')
    hostname_pattern = re.compile(r'hostname (\S+)')

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
        
        hostname = hostname_match.group(1) if hostname_match else "Hostname not found"
        os_version = version_match.group(1) if version_match else "OS version not found"
        
        net_connect.disconnect()
        
        return {
            'hostname': hostname,
            'os_version': os_version
        }
    
    except Exception as e:
        return str(e)