from netmiko import ConnectHandler
import ipaddress

def convert_from_cidr(cidr):
    network = ipaddress.IPv4Network(cidr, strict=False)
    host_ip = str(cidr).split('/')[0]
    mask = str(network.netmask)
    return f'{host_ip} {mask}'

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
            f'ip address {convert_from_cidr(ip)}',
            'no shutdown',
        ]

        output = net_connect.send_config_set(config_commands)
        net_connect.exit_config_mode()
        net_connect.disconnect()

        return {"status": "success", "message": "Configuration applied successfully!"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
