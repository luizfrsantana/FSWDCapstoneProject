import {useEffect, useState} from 'react';
import "./devicepage.css"

import DataTable from  "react-data-table-component";

const DevicePage = () => {

  const columns = [
    {name:"ID", selector:row=>row.id},
    {name:"Device Name", selector:row=>row.device_name},
    {name:"MGMT IP", selector:row=>row.mgmt_ip},
    {name:"Vendor", selector:row=>row.vendor},
    {name:"OS Version", selector:row=>row.os_version},
    {name:"Serial Number", selector:row=>row.serial_number},
    {name:"Model", selector:row=>row.model},
    {name:"Status", selector:row=>row.status},
    {name:"Installation Date", selector:row=>row.installation_date},
    {name:"Warranty Expiration", selector:row=>row.warranty_expiration},
    {name:"Last Maintenance", selector:row=>row.last_maintenance},
    {name:"Support Contact", selector:row=>row.support_contact},
    {name:"Notes", selector:row=>row.notes},
  ];
  
  const [devices,setDevices] = useState([]);
  
  const getAllDevices = async () => {
    try {
      const response = await fetch("http://192.168.56.107:5000/api/device");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      setDevices(data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }
  
  useEffect(()=>{
    getAllDevices();
  },[])

  return (
      <div className='devicepage'>
        <DataTable columns={columns} data={devices} fixedHeader pagination></DataTable>
      </div>
  );
}


export default DevicePage