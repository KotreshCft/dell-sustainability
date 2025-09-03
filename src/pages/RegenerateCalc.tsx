"use client"

import { useState, useEffect } from "react"
import { getCycleData, subscribeToDataChanges } from "../services/dataService"
import { DataLoader } from "../components/DataLoader"
import 'animate.css';


function RegenerateCalc() {
  const [totalCycleData, setTotalCycleData] = useState(0)

  // Constants for calculations
  const CARBON_EMISSION_PREVENTED_PER_LAMP = 125 // kg per solar lamp

  useEffect(() => {
    async function loadData() {
      try {
        const cycleData = await getCycleData()
        setTotalCycleData(cycleData)
      } catch (error) {
        console.error("Error loading cycle data:", error)
      }
    }

    loadData()

    // Subscribe to real-time changes
    const unsubscribe = subscribeToDataChanges(async () => {
      const cycleData = await getCycleData()
      setTotalCycleData(cycleData)
    })

    // Cleanup subscription on unmount
    return unsubscribe
  }, [])

  // Calculate values based on total cycle data
  const solarLamps = totalCycleData // 1 data = 1 solar lamp
  const carbonEmissionPrevented = totalCycleData * CARBON_EMISSION_PREVENTED_PER_LAMP // total × 125kg
  
  // Display values multiplied by 60 to show in minutes (converted from seconds)
  const displayTotalCycleData = totalCycleData
  const displaySolarLamps = solarLamps * 60
  const displayCarbonEmissionPrevented = carbonEmissionPrevented * 60

  return (
    <DataLoader>
      <div className="min-h-screen flex items-start justify-start p-0 relative animate__animated animate__fadeIn">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/regenbg.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0"></div>

        <div className="flex flex-col items-start justify-start relative z-10 mt-[300px] ml-[350px]">
          <div className="grid grid-cols-2 gap-4 w-full max-w-[57rem]">
            {/* Row 1: Total Data and Solar Lamps */}
            <div className="py-8 px-12 shadow-2xl" style={{ backgroundColor: "#00468B" }}>
              <div className="text-left flex flex-col justify-start h-full">
                <p className="text-5xl font-bold text-white drop-shadow-lg mb-4">{displayTotalCycleData.toLocaleString()}</p>
                <p className="text-[44px] font-light text-white mb-4">Minutes of cycling interactions​</p>
                {/* <p className="text-sm text-gray-300">
                  1 initiative = 1 solar lamp + 125kg carbon prevented
                </p> */}
              </div>
            </div>

            <div className="py-8 px-12 shadow-2xl" style={{ backgroundColor: "#00468B" }}>
              <div className="text-left flex flex-col justify-start h-full max-w-[400px]">
                <p className="text-5xl font-bold text-white drop-shadow-lg mb-4">{solarLamps.toLocaleString()}</p>
                <p className="text-[44px] font-light text-white mb-4">Solar lamps will be contributed that can light a student's future​</p>
                {/* <p className="text-sm text-gray-300">
                  Based on {totalCycleData} completed initiatives
                </p> */}
              </div>
            </div>

            {/* Row 2: Carbon Emission Prevented (spans full width) */}
            <div className="col-span-2 py-8 px-10 shadow-2xl" style={{ backgroundColor: "#00468B" }}>
              <div className="text-left">
                <p className="text-5xl font-bold text-white drop-shadow-lg mb-6">{carbonEmissionPrevented.toLocaleString()} kg</p>
                <p className="text-[44px] font-light text-white">Carbon emission prevented​</p>
                {/* <p className="text-sm text-gray-300 mt-4">
                  Calculation: {totalCycleData} solar lamps × {CARBON_EMISSION_PREVENTED_PER_LAMP}kg carbon prevention per lamp
                </p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DataLoader>
  )
}

export default RegenerateCalc