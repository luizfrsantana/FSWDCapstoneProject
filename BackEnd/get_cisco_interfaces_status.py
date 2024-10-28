from netmiko import ConnectHandler
import re

def get_cisco_interfaces_status(host, username='admin', password='admin123'):

    regexVlan = r"interface (\S+)(?:\s+encapsulation dot1Q (\d+))?"
    regexStatus = r"(\S+) is (administratively )?(\S+), line protocol is (\S+)"
    regexLastActive = r"\*.*?%LINK-\d+-\w+: Interface (\S+), changed state to (up|down|administratively down)"
    regexTimestamp = r"\*(\S+ \S+ \S+):"

    patternVlan = re.compile(regexVlan) 
    patternStatus = re.compile(regexStatus)
    patternLastActive = re.compile(regexLastActive)
    patternTimestamp = re.compile(regexTimestamp)

    # Initialize the consolidated dictionary
    interfaces = {}

    try:
        cisco_device = {
            'device_type': 'cisco_ios',
            'host': host,
            'username': username,
            'password': password,
        }
        net_connect = ConnectHandler(**cisco_device)
        show_interfaces_output = net_connect.send_command("show interfaces")
        show_run_output = net_connect.send_command("show run")
        show_log_output = net_connect.send_command("show logging")
        
        for match in patternLastActive.findall(show_log_output):
            interface, state = match

            timestamp_match = patternTimestamp.search(show_log_output)
            timestamp = timestamp_match.group(1).strip() if timestamp_match else "Unknown"
            
            if interface not in interfaces:
                interfaces[interface] = {
                    "last_up": None,
                    "last_down": None,
                    "physical_status": None,
                    "protocol_status": None,
                    "vlan": "No VLAN"
                }

            if state == "up":
                interfaces[interface]["last_up"] = timestamp
            elif state == "down" or state == "administratively down":
                interfaces[interface]["last_down"] = timestamp 

        for match in patternStatus.findall(show_interfaces_output):
            interface = match[0]
            physical_status = match[2]
            protocol_status = match[3]

            if interface not in interfaces:
                interfaces[interface] = {
                    "last_up": None,
                    "last_down": None,
                    "physical_status": None,
                    "protocol_status": None,
                    "vlan": "No VLAN"
            }
                
            interfaces[interface]["physical_status"] = physical_status
            interfaces[interface]["protocol_status"] = protocol_status

        
        for match in patternVlan.findall(show_run_output):
            interface = match[0]
            vlan = match[1] if match[1] else "No VLAN"

            if interface not in interfaces:
                interfaces[interface] = {
                    "last_up": None,
                    "last_down": None,
                    "physical_status": None,
                    "protocol_status": None,
                    "vlan": "No VLAN"
                }


            interfaces[interface]["vlan"] = vlan

        return interfaces
    
    except Exception as e:
        return str(e)
    finally:
        if 'net_connect' in locals():
            net_connect.disconnect()