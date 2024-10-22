import {useEffect, useState, useCallback} from 'react';
import "./devicepage.css"

import DataTable from  "react-data-table-component";

const DevicePage = () => {

  const columns = [
    {
      name: "Device Name",
      selector: row => row.device_name,
      cell: row => <div title={row.device_name}>{row.device_name}</div>,
    },
    {
      name: "MGMT IP",
      selector: row => row.mgmt_ip,
      cell: row => <div title={row.mgmt_ip}>{row.mgmt_ip}</div>,
    },
    {
      name: "Vendor",
      selector: row => row.vendor,
      cell: row => <div title={row.vendor}>{row.vendor}</div>,
    },
    {
      name: "OS Version",
      selector: row => row.os_version,
      cell: row => <div title={row.os_version}>{row.os_version}</div>,
    },
    {
      name: "Serial Number",
      selector: row => row.serial_number,
      cell: row => <div title={row.serial_number}>{row.serial_number}</div>,
    },
    {
      name: "Model",
      selector: row => row.model,
      cell: row => <div title={row.model}>{row.model}</div>,
    },
    {
      name: "Status",
      selector: row => row.status,
      cell: row => <div title={row.status}>{row.status}</div>,
    },
    {
      name: "Installation Date",
      selector: row => row.installation_date,
      cell: row => <div title={row.installation_date}>{row.installation_date}</div>,
    },
    {
      name: "Warranty Expiration",
      selector: row => row.warranty_expiration,
      cell: row => <div title={row.warranty_expiration}>{row.warranty_expiration}</div>,
    },
    {
      name: "Last Maintenance",
      selector: row => row.last_maintenance,
      cell: row => <div title={row.last_maintenance}>{row.last_maintenance}</div>,
    },
    {
      name: "Support Contact",
      selector: row => row.support_contact,
      cell: row => <div title={row.support_contact}>{row.support_contact}</div>,
    },
    {
      name: "Notes",
      selector: row => row.notes,
      cell: row => <div title={row.notes}>{row.notes}</div>,
    },
  ];
  
  const [devices,setDevices] = useState([]);
  const [filteredDevices,setfilteredDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const [mgmt_ip, setMgmt_ip] = useState("")
  const [vendor, setVendor] = useState("")
  
  const getAllDevices = async () => {
    try {
      const response = await fetch("http://192.168.56.107:5000/api/device", {method: "GET"});
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setDevices(data);
      setfilteredDevices(data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }

  const handleSearch = (e) => {
    const filteredDevices = devices.filter(row=>row.device_name.toLowerCase().includes(e.target.value.toLowerCase()) || row.vendor.toLowerCase().includes(e.target.value.toLowerCase()))
    setfilteredDevices(filteredDevices)
  }

  const handleRowSelected = (selectedRows) => {
    const selectedDevice = selectedRows.selectedRows[0];
    setSelectedDevice(selectedDevice);
  };

  const handleDelBtnDevice = useCallback(async () => {
    try {
      const response = await fetch(`http://192.168.56.107:5000/api/device?id=${selectedDevice.id}`, {method: "DELETE"});
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      getAllDevices();
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }, [selectedDevice]);

  const handleAddBtnDevice = async () => {
    const newDevice = {
      mgmt_ip,
      vendor,
    };

    try {
      const response = await fetch(`http://192.168.56.107:5000/api/device`, 
        {method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDevice),
        });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      getAllDevices();
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };
  
  useEffect(()=>{
    getAllDevices();
  },[])

  const handlerInputVendor = (event) => {
    setVendor(event.target.value)
  }

  const handlerInputMgmt_ip = (event) => {
    setMgmt_ip(event.target.value)
  }

  return (
      <div className='devicepage'>
        <div className="addpanel">
          <div className="addpaneldiv">
            <label htmlFor="mgmt_ip">MGMT IP</label> <br />
            <input className="addpanelinput" 
                    type="text" 
                    name="mgmt_ip" 
                    id="mgmt_ip"
                    value={mgmt_ip}
                    onChange={handlerInputMgmt_ip}
            />  
            <br />
          </div>
          <div className="addpaneldiv">  
            <label htmlFor="vendor">Vendor</label>  <br />

            <select className="addpanelinput"
                    name="vendor" 
                    id="vendor" 
                    value={vendor} 
                    onChange={handlerInputVendor}>
                      <option>cisco</option>
                      <option>juniper</option>
            </select>
          </div>
          <button className="addBtnDevice" onClick={handleAddBtnDevice}>Add</button>
          <button className="delBtnDevice" onClick={handleDelBtnDevice}>Delete</button>
        </div>
        <input className="inputSearch" onChange={handleSearch} type="search" name="inputsearchdevice" id="inputsearchdevice" placeholder="Search Devices By Name or Vendor..." />
        <DataTable 
          columns={columns} 
          data={filteredDevices} 
          fixedHeader 
          pagination
          selectableRows
          selectableRowsSingle
          onSelectedRowsChange={handleRowSelected}
        />
      </div>
  );
}


export default DevicePage