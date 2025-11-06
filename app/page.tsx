"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Power, Zap, Droplets, Thermometer, AlertCircle } from "lucide-react"

export default function Dashboard() {
  const [lightsOn, setLightsOn] = useState(false)
  const [currentEnergy, setCurrentEnergy] = useState({ generated: 0, stored: 0 })
  const [solarEnergy, setSolarEnergy] = useState(0)
  const [piezoEnergy, setPiezoEnergy] = useState(0)
  const [currentTemp, setCurrentTemp] = useState(0)
  const [currentHumidity, setCurrentHumidity] = useState(0)
  const [energyHistory, setEnergyHistory] = useState<Array<{ time: string; generated: number; stored: number }>>([])
  const [solarHistory, setSolarHistory] = useState<Array<{ time: string; solar: number }>>([])
  const [piezoHistory, setPiezoHistory] = useState<Array<{ time: string; piezo: number }>>([])
  const [tempHistory, setTempHistory] = useState<Array<{ time: string; temp: number }>>([])
  const [humidityHistory, setHumidityHistory] = useState<Array<{ time: string; humidity: number }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const fetchSensorData = async () => {
    try {
      // In production, this would fetch from your ESP32 endpoint
      // For now, we simulate the data and keep the mock pattern
      const now = new Date()
      const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })

      const newEnergy = {
        time: timeStr,
        generated: Math.random() * 150 + 50,
        stored: Math.random() * 800 + 200,
      }
      setCurrentEnergy(newEnergy)

      const newSolar = { time: timeStr, solar: Math.random() * 120 + 40 }
      setSolarEnergy(newSolar.solar)

      const newPiezo = { time: timeStr, piezo: Math.random() * 80 + 20 }
      setPiezoEnergy(newPiezo.piezo)

      const newTemp = { time: timeStr, temp: Math.random() * 8 + 22 }
      setCurrentTemp(newTemp.temp)

      const newHumidity = { time: timeStr, humidity: Math.random() * 20 + 45 }
      setCurrentHumidity(newHumidity.humidity)

      // Update history
      setEnergyHistory((prev) => [...prev.slice(-11), newEnergy])
      setSolarHistory((prev) => [...prev.slice(-11), newSolar])
      setPiezoHistory((prev) => [...prev.slice(-11), newPiezo])
      setTempHistory((prev) => [...prev.slice(-11), newTemp])
      setHumidityHistory((prev) => [...prev.slice(-11), newHumidity])

      setError(null)
    } catch (err) {
      setError("Failed to fetch sensor data from ESP32")
      console.error("[v0] Sensor data fetch error:", err)
    }
  }

  useEffect(() => {
    // Initialize with some starting data
    const initialData = Array.from({ length: 5 }, (_, i) => {
      const time = new Date(Date.now() - (5 - i) * 2000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
      return {
        time,
        generated: Math.random() * 150 + 50,
        stored: Math.random() * 800 + 200,
      }
    })
    setEnergyHistory(initialData)
    setCurrentEnergy(initialData[initialData.length - 1])

    const solarData = Array.from({ length: 5 }, (_, i) => ({
      time: initialData[i].time,
      solar: Math.random() * 120 + 40,
    }))
    setSolarHistory(solarData)
    setSolarEnergy(solarData[solarData.length - 1].solar)

    const piezoData = Array.from({ length: 5 }, (_, i) => ({
      time: initialData[i].time,
      piezo: Math.random() * 80 + 20,
    }))
    setPiezoHistory(piezoData)
    setPiezoEnergy(piezoData[piezoData.length - 1].piezo)

    const tempData = Array.from({ length: 5 }, (_, i) => ({
      time: initialData[i].time,
      temp: Math.random() * 8 + 22,
    }))
    setTempHistory(tempData)
    setCurrentTemp(tempData[tempData.length - 1].temp)

    const humidityData = Array.from({ length: 5 }, (_, i) => ({
      time: initialData[i].time,
      humidity: Math.random() * 20 + 45,
    }))
    setHumidityHistory(humidityData)
    setCurrentHumidity(humidityData[humidityData.length - 1].humidity)

    setIsConnected(true)
    setLoading(false)

    // Set up interval for real-time updates
    const interval = setInterval(() => {
      fetchSensorData()
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Zap className="w-10 h-10 text-emerald-400" />
              Piezo Energy System
            </h1>
            <p className="text-slate-400">Real-time monitoring of sidewalk energy generation</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-emerald-400" : "bg-red-400"}`} />
            <span className="text-sm text-slate-300">{isConnected ? "ESP32 Connected" : "Disconnected"}</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-600/50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-300">{error}</p>
              <p className="text-xs text-red-400 mt-1">Check your ESP32 connection and API configuration</p>
            </div>
          </div>
        )}

        {/* Control Section */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Power className="w-5 h-5" />
              Street Lights Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className={`w-4 h-4 rounded-full animate-pulse ${lightsOn ? "bg-emerald-400" : "bg-slate-500"}`} />
              <span className="text-lg font-medium text-white">{lightsOn ? "Lights are ON" : "Lights are OFF"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          {/* Solar Energy Generated */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                Solar Energy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400">{solarEnergy.toFixed(1)}</div>
              <p className="text-xs text-slate-400 mt-1">Watts</p>
            </CardContent>
          </Card>

          {/* Piezo Energy Generated */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                Piezo Energy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400">{piezoEnergy.toFixed(1)}</div>
              <p className="text-xs text-slate-400 mt-1">Watts</p>
            </CardContent>
          </Card>

          {/* Energy Generated */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                Total Generated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-400">{currentEnergy.generated.toFixed(1)}</div>
              <p className="text-xs text-slate-400 mt-1">Watts</p>
            </CardContent>
          </Card>

          {/* Energy Stored */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                Energy Stored
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-400">{currentEnergy.stored.toFixed(0)}</div>
              <p className="text-xs text-slate-400 mt-1">mAh</p>
            </CardContent>
          </Card>

          {/* Temperature */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-orange-400" />
                Temperature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-400">{currentTemp.toFixed(1)}</div>
              <p className="text-xs text-slate-400 mt-1">°C</p>
            </CardContent>
          </Card>

          {/* Humidity */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                Humidity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">{currentHumidity.toFixed(1)}</div>
              <p className="text-xs text-slate-400 mt-1">%</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Solar Energy Chart */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Solar Energy Generation</CardTitle>
              <CardDescription>Real-time solar power output (Watts)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-around gap-2 bg-slate-900/30 rounded-lg p-4">
                {solarHistory.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className="w-full bg-gradient-to-t from-yellow-400 to-yellow-500 rounded-t transition-all"
                      style={{ height: `${(item.solar / 160) * 100}%` }}
                    />
                    <span className="text-xs text-slate-400">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Piezo Energy Chart */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Piezo Energy Generation</CardTitle>
              <CardDescription>Real-time piezo power output (Watts)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-around gap-2 bg-slate-900/30 rounded-lg p-4">
                {piezoHistory.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className="w-full bg-gradient-to-t from-purple-400 to-purple-500 rounded-t transition-all"
                      style={{ height: `${(item.piezo / 100) * 100}%` }}
                    />
                    <span className="text-xs text-slate-400">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Environmental Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Temperature Chart */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Temperature Trend</CardTitle>
              <CardDescription>Environmental temperature (°C)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-around gap-2 bg-slate-900/30 rounded-lg p-4">
                {tempHistory.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className="w-full bg-gradient-to-t from-orange-400 to-orange-500 rounded-t transition-all"
                      style={{ height: `${(item.temp / 35) * 100}%` }}
                    />
                    <span className="text-xs text-slate-400">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Humidity Chart */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Humidity Levels</CardTitle>
              <CardDescription>Relative humidity percentage (%)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-around gap-2 bg-slate-900/30 rounded-lg p-4">
                {humidityHistory.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className="w-full bg-gradient-to-t from-blue-400 to-blue-500 rounded-t transition-all"
                      style={{ height: `${(item.humidity / 100) * 100}%` }}
                    />
                    <span className="text-xs text-slate-400">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
