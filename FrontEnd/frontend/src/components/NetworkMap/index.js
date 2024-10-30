import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network';
import 'vis-network/styles/vis-network.css';

const NetworkMap = ({ connections }) => {
  const networkRef = useRef(null);

  useEffect(() => {
    if (networkRef.current && connections.length) {
      const nodes = [];
      const edges = [];

      connections.forEach((connection, index) => {
        const deviceA = connection.device_name_a;
        const deviceZ = connection.device_name_z;

        if (!nodes.some(node => node.label === deviceA)) {
          nodes.push({ id: deviceA, label: deviceA });
        }
        if (!nodes.some(node => node.label === deviceZ)) {
          nodes.push({ id: deviceZ, label: deviceZ });
        }

        edges.push({ from: deviceA, to: deviceZ, label: connection.connection_type });
      });

      const data = {
        nodes,
        edges,
      };
      
      const options = {
        interaction: { hover: true },
        physics: { enabled: true },
      };

      new Network(networkRef.current, data, options);
    }
  }, [connections]);

  return <div ref={networkRef} style={{ width: '100%', height: '500px', border: '1px solid lightgray' }} />;
};

export default NetworkMap;