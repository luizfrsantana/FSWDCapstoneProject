from jnpr.junos import Device
from lxml import etree
from utils.config_loader import load_config

config = load_config()

def get_juniper_informations(host):
    username=config["DEVICE_USER"]
    password=config["DEVICE_PASSWORD"]

    try:
        dev = Device(host=host, user=username, passwd=password)
        dev.open()

        version_info = dev.rpc.get_software_information()
        os_version = version_info.findtext('package-information[1]/comment')
        
        config_info = dev.rpc.get_configuration()
        hostname = config_info.findtext('system/host-name')

        chassis_info = dev.rpc.get_chassis_inventory()
        serial_number = chassis_info.findtext('chassis/serial-number')
        model = chassis_info.findtext('chassis/description')

        dev.close()
        
        return {
            'hostname': hostname if hostname else "Hostname not found",
            'os_version': os_version if os_version else "OS version not found",
            'serial_number': serial_number if serial_number else "Serial number not found",
            'model': model if model else "Model not found"
        }
    
    except Exception as e:
        return str(e)
