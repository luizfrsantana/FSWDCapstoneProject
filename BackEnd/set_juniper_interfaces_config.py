from jnpr.junos import Device
from jnpr.junos.utils.config import Config

def configure_juniper(host, description, interface, ip):
    try:
        dev = Device(host=host, user='admin', password='admin123')
        dev.open()

        cu = Config(dev)
        delete_interface_config = f"delete interfaces {interface} unit 0"
        interface_config = f"set interfaces {interface} unit 0 family inet address {ip}"
        description_config = f'set interfaces {interface} unit 0 description "{description}"'

        cu.load(delete_interface_config, format='set')
        cu.load(interface_config, format='set')
        cu.load(description_config, format='set')

        cu.commit()
        dev.close()

        return {"status": "success", "message": "Configuration applied successfully!"}
    except Exception as e:
        print ({"status": "error", "message": str(e)})