// API endpoint to send control commands to ESP32
export async function POST(request: Request) {
  try {
    const { command, value } = await request.json()

    // Validate command
    if (!command || typeof command !== "string") {
      return Response.json({ error: "Invalid command" }, { status: 400 })
    }

    // Process different commands
    if (command === "lights") {
      if (typeof value !== "boolean") {
        return Response.json({ error: "Lights command requires boolean value" }, { status: 400 })
      }
      // Here you would send the command to your ESP32
      // For now, we just acknowledge receipt
      console.log(`[v0] Lights command received: ${value ? "ON" : "OFF"}`)
      return Response.json(
        {
          success: true,
          command: "lights",
          value: value,
          message: `Lights turned ${value ? "ON" : "OFF"}`,
        },
        { status: 200 },
      )
    }

    return Response.json({ error: "Unknown command" }, { status: 400 })
  } catch (error) {
    return Response.json({ error: "Failed to process control command" }, { status: 500 })
  }
}
