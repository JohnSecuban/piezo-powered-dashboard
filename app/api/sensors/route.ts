// API endpoint to receive sensor data from ESP32
export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate incoming data from ESP32
    const { solarEnergy, piezoEnergy, temperature, humidity, energyStored } = data

    if (
      typeof solarEnergy !== "number" ||
      typeof piezoEnergy !== "number" ||
      typeof temperature !== "number" ||
      typeof humidity !== "number" ||
      typeof energyStored !== "number"
    ) {
      return Response.json({ error: "Invalid sensor data" }, { status: 400 })
    }

    // Return success response
    return Response.json(
      {
        success: true,
        message: "Sensor data received",
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )
  } catch (error) {
    return Response.json({ error: "Failed to process sensor data" }, { status: 500 })
  }
}
