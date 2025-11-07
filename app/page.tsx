import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/data');
      const json = await res.json();
      setData(json);
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Sensor Dashboard</h2>
      {data ? (
        <ul>
          <li>🌡️ Temperature: {data.temperature} °C</li>
          <li>💧 Humidity: {data.humidity} %</li>
          <li>🔆 Light Level: {data.light}</li>
          <li>💡 Lights: {data.lights_on ? 'ON' : 'OFF'}</li>
        </ul>
      ) : (
        <p>Waiting for data...</p>
      )}
    </div>
  );
}
