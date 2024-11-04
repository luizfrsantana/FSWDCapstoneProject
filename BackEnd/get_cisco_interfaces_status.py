from netmiko import ConnectHandler
import re
import yaml

with open("config.yaml") as f:
    config = yaml.safe_load(f)

def get_cisco_interfaces_status(host, username=config["DEVICE_USER"], password=config["DEVICE_PASSWORD"]):

    regexVlan = r"interface (\S+)\n(?:\s*description .*\n)?\s*encapsulation dot1Q (\d+)"
    regexStatus = r"(\S+) is (administratively )?(\S+), line protocol is (\S+)"
    regexLastActive = r"\*.*?%LINK-\d+-\w+: Interface (\S+), changed state to (up|down|administratively down)"
    regexTimestamp = r"\*(\w+ \d+ \d{2}:\d{2}:\d{2}\.\d+):"

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
        
        for line in show_log_output.splitlines():
            timestamp_match = patternTimestamp.search(line)
            last_active_match = patternLastActive.search(line)

            if timestamp_match and last_active_match:
                timestamp = timestamp_match.group(1)
                interface, state = last_active_match.groups()

                if interface not in interfaces:
                    interfaces[interface] = {
                        "last_up": None,
                        "last_down": None,
                        "physical_status": None,
                        "protocol_status": None,
                        "vlan": "No VLAN"
                    }

                # Update last up/down times based on state
                if state == "up":
                    interfaces[interface]["last_up"] = timestamp
                elif state in ["down", "administratively down"]:
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