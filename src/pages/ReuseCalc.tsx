"use client"

import { useState, useEffect } from "react"
import { getWaterRefills, subscribeToDataChanges } from "../services/dataService"
import 'animate.css';

function ReuseCalc() {
  const [totalWaterRefills, setTotalWaterRefills] = useState(0)
  const [loading, setLoading] = useState(true)

  // Base values per water refill
  const CARBON_FOOTPRINT_PER_REFILL = 4.4 // kg
  const WATER_CONSERVED_PER_REFILL = 92708 // liters

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const waterRefills = await getWaterRefills()
        setTotalWaterRefills(waterRefills)
      } catch (error) {
        console.error("Error loading water refills data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()

    // Subscribe to real-time changes
    const unsubscribe = subscribeToDataChanges(async () => {
      const waterRefills = await getWaterRefills()
      setTotalWaterRefills(waterRefills)
    })

    // Cleanup subscription on unmount
    return unsubscribe
  }, [])

  // Calculate display values based on total water refills
  const carbonFootprintReduced = (totalWaterRefills * CARBON_FOOTPRINT_PER_REFILL).toFixed(1)
  const waterConserved = totalWaterRefills * WATER_CONSERVED_PER_REFILL

  // Format large numbers with commas for better readability
  const formatNumber = (num) => {
    return num.toLocaleString()
  }

  return (
    <div className="min-h-screen flex items-start justify-start p-0 relative animate__animated animate__slideInRight">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/reusebg.mp4" type="video/mp4" />
      </video>
      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0"></div>

      <div className="flex flex-col items-start justify-start relative z-10 mt-80 ml-80">
        {loading ? (
          <div className="py-20 px-16 shadow-2xl w-full max-w-6xl" style={{ backgroundColor: "#00468B" }}>
            <p className="text-4xl text-white font-bold">Loading data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-8 w-full max-w-[59rem]">
          {/* Row 1: Water Refills and Carbon Footprint Reduced */}
          <div className="py-12 px-12 shadow-2xl" style={{ backgroundColor: "#00468B" }}>
            <div className="text-left flex flex-col justify-start h-full">
              <p className="text-6xl font-bold text-white drop-shadow-lg mb-4">{totalWaterRefills}</p>
              <p className="text-4xl text-white mb-4">Water refills</p>
            </div>
          </div>

          <div className="py-12 px-12 shadow-2xl" style={{ backgroundColor: "#00468B" }}>
            <div className="text-left flex flex-col justify-start h-full">
              <p className="text-6xl font-bold text-white drop-shadow-lg mb-4">{carbonFootprintReduced} kgs</p>
              <p className="text-4xl text-white mb-4">Carbon footprint reduced</p>
              {/* <p className="text-sm text-gray-300">({totalWaterRefills} × {CARBON_FOOTPRINT_PER_REFILL} kg per refill)</p> */}
            </div>
          </div>

          {/* Row 2: Water Conserved (spans full width) */}
          <div className="col-span-2 py-12 px-12 shadow-2xl" style={{ backgroundColor: "#00468B" }}>
            <div className="text-left">
              <p className="text-6xl font-bold text-white drop-shadow-lg mb-8 max-w-[500px]">{formatNumber(waterConserved)} liters</p>
              <p className="text-4xl text-white">Water conserved by empowering and training farmers through AWD Farming technique</p>
              <p className="text-sm text-gray-300 mt-2">
                {/* Calculation: {totalWaterRefills} refills × {formatNumber(WATER_CONSERVED_PER_REFILL)} liters per refill */}
              </p>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  )
}

export default ReuseCalc