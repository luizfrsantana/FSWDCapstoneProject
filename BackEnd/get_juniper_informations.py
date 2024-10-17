from jnpr.junos import Device
from lxml import etree

def get_juniper_informations(host, username='admin', password='admin123'):

    try:
        dev = Device(host=host, user=username, passwd=password)
        dev.open()

        version_info = dev.rpc.get_software_information()
        os_version = version_info.findtext('package-information[1]/comment')
        
        config_info = dev.rpc.get_configuration()
        hostname = config_info.findtext('system/host-name')

        dev.close()
        
        return {
            'hostname': hostname if hostname else "Hostname not found",
            'os_version': os_version if os_version else "OS version not found"
        }
    
    except Exception as e:
        return str(e)
