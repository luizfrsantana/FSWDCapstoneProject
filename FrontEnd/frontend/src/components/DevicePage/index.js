import {useEffect, useState, useCallback} from 'react';
import "./devicepage.css"

import DataTable from  "react-data-table-component";

const formatDateForInput = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`; 
};

const getStatus = (status) => {
  return status.toLowerCase() === 'up' ? 'status-up' : 'status-down';
};

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
      name: "Location",
      selector: row => row.location,
      cell: row => <div title={row.location}>{row.location}</div>,
    },
    {
      name: "Status",
      selector: row => row.status,
      cell: row => (
      <div className={getStatus(row.status)} title={row.status}>
        {row.status}
      </div>
      ),
    },
    {
      name: "Installation Date",
      selector: row => row.installation_date,
      cell: row => (
      <div title={formatDateForInput(row.installation_date)}>{formatDateForInput(row.installation_date)}</div>
      ),
    },
    {
      name: "Warranty Expiration",
      selector: row => row.warranty_expiration,
      cell: row => (
      <div title={formatDateForInput(row.warranty_expiration)}>{formatDateForInput(row.warranty_expiration)}</div>
      ),
    },
    {
      name: "Last Maintenance",
      selector: row => row.last_maintenance,
      cell: row => (
      <div title={formatDateForInput(row.last_maintenance)}>{formatDateForInput(row.last_maintenance)}</div>
      ),
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
  const [vendor, setVendor] = useState("Not Found")
  const [location, setLocation] = useState("")
  const [installation_date, setInstallation_date] = useState("")
  const [warranty_expiration, setWarranty_expiration] = useState("")
  const [last_maintenance, setLast_maintenance] = useState("")
  const [support_contact, setSupport_contact] = useState("")
  const [notes, setNotes] = useState("")

  const fillInputbox = (device) => {
    setMgmt_ip(device.mgmt_ip)
    setVendor(device.vendor)
    setLocation(device.location || '')
    setInstallation_date(formatDateForInput(device.installation_date) || '')
    setWarranty_expiration(formatDateForInput(device.warranty_expiration) || '')
    setLast_maintenance(formatDateForInput(device.last_maintenance)|| '')
    setSupport_contact(device.support_contact || '')
    setNotes(device.notes || '')
  } 
  
  
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
    if (selectedRows && selectedRows.selectedRows.length > 0) { 
      const selectedDevice = selectedRows.selectedRows[0];
      setSelectedDevice(selectedDevice);
      fillInputbox(selectedDevice)
    };

    
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
      location,
      installation_date,
      warranty_expiration,
      last_maintenance,
      support_contact,
      notes,
    };

    console.log(vendor)
    console.log(mgmt_ip)

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

  const handleUpdBtnDevice = async () => {
    const newDeviceValues = {
      mgmt_ip,
      vendor,
      location,
      installation_date,
      warranty_expiration,
      last_maintenance,
      support_contact,
      notes,
    };
  
    try {
      const response = await fetch(`http://192.168.56.107:5000/api/device`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDeviceValues),
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

  const handlerLocation = (event) => {
    setLocation(event.target.value)
  }

  const handlerInstallation_date = (event) => {
    setInstallation_date(event.target.value)
  }

  const handlerWarranty_expiration = (event) => {
    setWarranty_expiration(event.target.value)
  }

  const handlerLast_maintenance = (event) => {
    setLast_maintenance(event.target.value)
  }

  const handlerSupport_contact = (event) => {
    setSupport_contact(event.target.value)
  }

  const handlerNotes = (event) => {
    setNotes(event.target.value)
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
                      <option>Not Found</option>
                      <option>cisco</option>
                      <option>juniper</option>
            </select>
          </div>

          <div className="addpaneldiv">  
            <label htmlFor="location">Location</label>  <br />
            <input className="addpanelinput"
                type="text"
                name="location" 
                id="location" 
                value={location} 
                onChange={handlerLocation} 
              />
          </div>


          
          
          <div className="addpaneldiv">
            <label htmlFor="installation_date">Installation Date</label> <br />
            <input className="addpanelinput" 
                    type="date" 
                    name="installation_date" 
                    id="installation_date"
                    value={installation_date}
                    onChange={handlerInstallation_date}
            />  
            <br />
          </div>

          <div className="addpaneldiv">
            <label htmlFor="warranty_expiration">Warranty Expiration</label> <br />
            <input className="addpanelinput" 
                    type="date" 
                    name="warranty_expiration" 
                    id="warranty_expiration"
                    value={warranty_expiration}
                    onChange={handlerWarranty_expiration}
            />  
            <br />
          </div>

          <div className="addpaneldiv">
            <label htmlFor="last_maintenance">Last Maintenance</label> <br />
            <input className="addpanelinput" 
                    type="date" 
                    name="last_maintenance" 
                    id="last_maintenance"
                    value={last_maintenance}
                    onChange={handlerLast_maintenance}
            />  
            <br />
          </div>

          <div className="addpaneldiv">
            <label htmlFor="support_contact">Support Contact</label> <br />
            <input className="addpanelinput" 
                    type="text" 
                    name="support_contact" 
                    id="support_contact"
                    value={support_contact}
                    onChange={handlerSupport_contact}
            />  
            <br />
          </div>

          <div className="addpaneldiv">
            <label htmlFor="notes">Notes</label> <br />
            <input className="addpanelinput" 
                    type="text" 
                    name="notes" 
                    id="notes"
                    value={notes}
                    onChange={handlerNotes}
            />  
            <br />
          </div>

          <button className="addBtnDevice" onClick={handleAddBtnDevice}>Add</button>
          <button className="delBtnDevice" onClick={handleDelBtnDevice}>Delete</button>
          <button className="updBtnDevice" onClick={handleUpdBtnDevice}>Update</button>
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