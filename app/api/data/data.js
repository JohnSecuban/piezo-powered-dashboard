let latestData = null;

export default function handler(req, res) {
  if (req.method === 'POST') {
    latestData = req.body;
    console.log("Received from ESP32:", latestData);
    return res.status(200).json({ message: "Data received" });
  }

  if (req.method === 'GET') {
    return res.status(200).json(latestData || { message: "No data yet" });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
