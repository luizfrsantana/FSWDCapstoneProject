from netmiko import ConnectHandler

def configure_cisco(host, description, interface, ip):
    try:
        cisco_device = {
            'device_type': 'cisco_ios', 
            'host': host,       
            'username': 'admin',        
            'password': 'admin123', 
        }

        net_connect = ConnectHandler(**cisco_device)
        config_commands = [
            f'interface {interface}',
            f'description {description}',
            f'ip address {ip} 255.255.255.0',
            'no shutdown',
        ]

        output = net_connect.send_config_set(config_commands)
        net_connect.exit_config_mode()
        net_connect.disconnect()

        return {"status": "success", "message": "Configuration applied successfully!"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
