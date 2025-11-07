"use client"

import { useEffect, useState } from "react"

export default function Dashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/data")
      const json = await res.json()
      setData(json)
    }

    fetchData() // Initial fetch
    const interval = setInterval(fetchData, 5000) // Refresh every 5s
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Piezo Powered Dashboard</h1>
          <p className="text-slate-400">Real-time monitoring system for piezo sidewalk energy generation</p>
        </div>

        {/* Street Lights Status Indicator */}
        <div className="mb-8">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all">
            <div className="flex items-center gap-4">
              <div
                className={`w-4 h-4 rounded-full ${data?.lights_on ? "bg-emerald-500 animate-pulse" : "bg-slate-600"}`}
              ></div>
              <div>
                <h3 className="text-slate-300 text-sm font-medium">Street Lights</h3>
                <p className="text-white text-lg font-semibold">{data?.lights_on ? "ON" : "OFF"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Solar Energy */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Solar Energy Generated</h3>
            <p className="text-4xl font-bold text-amber-400">{data?.solar_energy || 0} W</p>
            <p className="text-slate-500 text-xs mt-2">Current output</p>
          </div>

          {/* Total Energy Stored */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Energy Stored</h3>
            <p className="text-4xl font-bold text-cyan-400">{data?.energy_stored || 0} kWh</p>
            <p className="text-slate-500 text-xs mt-2">Total capacity</p>
          </div>

          {/* Temperature */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Temperature</h3>
            <p className="text-4xl font-bold text-orange-400">{data?.temperature || 0} °C</p>
            <p className="text-slate-500 text-xs mt-2">Environment</p>
          </div>

          {/* Humidity */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Humidity</h3>
            <p className="text-4xl font-bold text-blue-400">{data?.humidity || 0} %</p>
            <p className="text-slate-500 text-xs mt-2">Air moisture</p>
          </div>
        </div>

        {/* Loading State */}
        {!data && (
          <div className="text-center py-12">
            <p className="text-slate-400">Connecting to sensors...</p>
          </div>
        )}
      </div>
    </div>
  )
}
