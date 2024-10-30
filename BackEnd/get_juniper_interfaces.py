from jnpr.junos import Device
from lxml import etree

def get_juniper_interfaces(host, username='admin', password='admin123'):
    try:
        
        dev = Device(host=host, user=username, password=password)
        dev.open()

        rpc = dev.rpc.get_interface_information(normalize=True)

        interfaces_dict = {}
        for physical_interface in rpc.findall('physical-interface'):
            interface_name = physical_interface.findtext('name')
            oper_status = physical_interface.findtext('oper-status')
            admin_status = physical_interface.findtext('admin-status')
            last_flapped = physical_interface.findtext('interface-flapped')

            logical_interfaces = physical_interface.findall('logical-interface')
            for logical_interface in logical_interfaces:
                logical_name = logical_interface.findtext('name')
                description = logical_interface.findtext('description')
                vlan_tag = logical_interface.findtext('vlan-tag')
                address_family = logical_interface.find('address-family')
                ip_address = None

                if address_family is not None:
                    ip_address = address_family.findtext('interface-address/ifa-local')
                    prefix_length = address_family.findtext('interface-address/ifa-destination')

                if ip_address and prefix_length:
                    ip_address = f"{ip_address}/{prefix_length.split('/')[-1]}"
                else:
                    ip_address = 'No IP'

                interfaces_dict[interface_name] = {
                    'logical_name': logical_name,
                    'description': description if description else 'No description',
                    'ip_address': ip_address,
                    "last_down": last_flapped,
                    "last_up": last_flapped,
                    "physical_status": admin_status,
                    "protocol_status": oper_status,
                    "vlan": vlan_tag if vlan_tag else 'No VLAN'
                }

        dev.close()
        return interfaces_dict

    except Exception as e:
        return str(e)