import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [serviceName, setServiceName] = useState('Deployer');
  const [ip, setIP] = useState('');
  const [serverResp, setServerResp] = useState('');
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    fetchDataAndSetDeviceData();
    setRenderCount(prevCount => prevCount + 1); // Increment render count after initial render
  }, []); // Empty dependency array ensures this runs only once on mount

  const fetchDataAndSetDeviceData = async () => {
    try {
      const ipData = await getIPData();
      console.log('IP data:', ipData, ip ? "Yes" : "No", (ipData !== ip));

      if (ipData && ipData !== ip) {
        setIP(ipData); // Update ip state with fetched IP
        await setDeviceData(ipData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getIPData = async () => {
    console.log('Fetching IP address...');
    try {
      const res = await axios.get("https://api.ipify.org/?format=json");
      return res?.data?.ip;
    } catch (error) {
      console.error('Error fetching IP address:', error);
      return null;
    }
  };

  const setDeviceData = async (ip) => {
    console.log('Sending device data...');
    try {
      const params = {
        ip_address: ip,
      };
      const res = await axios.post('http://127.0.0.1:5000/api/message', params);
      console.log('Server response:', res.data);
      if (res && res !== serverResp) {
        setServerResp(res?.data);
      }
    } catch (error) {
      console.error('Error sending device data:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Your service {serviceName} is up and running.
          {serverResp &&
            <>
              <br />
              <br />
              Server Response: {JSON.stringify(serverResp)}
            </>
          }
          <br />
          <br />
          IP address: {ip}
          <br />
          <br />
          User Agent: {navigator.userAgent}
          <br />
          <br />
          Component has rendered {renderCount} times.
        </p>
      </header>
    </div>
  );
}

export default App;
