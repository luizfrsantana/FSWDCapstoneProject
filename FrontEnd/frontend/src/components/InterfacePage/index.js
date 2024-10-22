import {useEffect, useState} from 'react';
import "./interfacepage.css"

import DataTable from  "react-data-table-component";

const InterfacePage = () => {

  const columns = [
    {name:"ID", selector:row=>row.id},
    {name:"Interface Name", selector:row=>row.interface_name},
    {name:"Device Name", selector:row=>row.device_name},
    {name:"MGMT IP", selector:row=>row.ip},
    {name:"Vendor", selector:row=>row.vendor},
    {name:"OS Version", selector:row=>row.speed},
    {name:"Serial Number", selector:row=>row.vlan},
    {name:"Model", selector:row=>row.last_active},
  ];
  
  const [interfaces,setInterfaces] = useState([]);
  
  const getAllDevices = async () => {
    try {
      const response = await fetch("http://192.168.56.107:5000/api/interface");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      setInterfaces(data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }
  
  useEffect(()=>{
    getAllDevices();
  },[])

  return (
      <div className='interfacepage'>
        <DataTable columns={columns} data={interfaces} fixedHeader pagination></DataTable>
      </div>
  );
}


export default InterfacePage