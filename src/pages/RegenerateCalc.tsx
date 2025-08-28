"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

function RegenerateCalc() {
  const [totalCycleData, setTotalCycleData] = useState(0)
  const [loading, setLoading] = useState(true)

  // Constants for calculations
  const CARBON_EMISSION_PREVENTED_PER_LAMP = 125 // kg per solar lamp

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Fetch cycle data from all IDs and sum them up
        const { data, error } = await supabase
          .from("cycle")
          .select("data")
          .in("id", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) // Fetch from all IDs

        if (error) {
          console.error("Error fetching cycle data:", error)
          throw error
        }

        if (data) {
          // Sum all the data values to get total
          const total = data.reduce((acc, currentRow) => acc + currentRow.data, 0)
          setTotalCycleData(total)
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching data:", error.message)
        } else {
          console.error("Error fetching data:", error)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate values based on total cycle data
  const solarLamps = totalCycleData // 1 data = 1 solar lamp
  const carbonEmissionPrevented = totalCycleData * CARBON_EMISSION_PREVENTED_PER_LAMP // total × 125kg
  
  // Display values multiplied by 60 to show in seconds
  const displayTotalCycleData = totalCycleData * 60
  const displaySolarLamps = solarLamps * 60
  const displayCarbonEmissionPrevented = carbonEmissionPrevented * 60

  return (
    <div
      className="min-h-screen flex items-start justify-start p-0 relative"
      style={{
        backgroundImage: "url(/regenbg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0"></div>

      <div className="flex flex-col items-start justify-start relative z-10 mt-80 ml-80">
        {loading ? (
          <div className="py-20 px-16 shadow-2xl w-full max-w-6xl" style={{ backgroundColor: "#00468B" }}>
            <p className="text-4xl text-white font-bold">Loading data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-8 w-full max-w-[59rem]">
            {/* Row 1: Total Data and Solar Lamps */}
            <div className="py-12 px-12 shadow-2xl" style={{ backgroundColor: "#00468B" }}>
              <div className="text-left flex flex-col justify-start h-full">
                <p className="text-6xl font-bold text-white drop-shadow-lg mb-4">{displayTotalCycleData.toLocaleString()}</p>
                <p className="text-4xl text-white mb-4">Seconds of cycling interactions​</p>
                {/* <p className="text-sm text-gray-300">
                  1 initiative = 1 solar lamp + 125kg carbon prevented
                </p> */}
              </div>
            </div>

            <div className="py-12 px-12 shadow-2xl" style={{ backgroundColor: "#00468B" }}>
              <div className="text-left flex flex-col justify-start h-full max-w-[400px]">
                <p className="text-6xl font-bold text-white drop-shadow-lg mb-4">{solarLamps.toLocaleString()}</p>
                <p className="text-4xl text-white mb-4">Solar lamps will be contributed that can light a student's future​</p>
                {/* <p className="text-sm text-gray-300">
                  Based on {totalCycleData} completed initiatives
                </p> */}
              </div>
            </div>

            {/* Row 2: Carbon Emission Prevented (spans full width) */}
            <div className="col-span-2 py-12 px-12 shadow-2xl" style={{ backgroundColor: "#00468B" }}>
              <div className="text-left">
                <p className="text-6xl font-bold text-white drop-shadow-lg mb-6">{carbonEmissionPrevented.toLocaleString()} kg</p>
                <p className="text-4xl text-white">Carbon emission prevented​</p>
                {/* <p className="text-sm text-gray-300 mt-4">
                  Calculation: {totalCycleData} solar lamps × {CARBON_EMISSION_PREVENTED_PER_LAMP}kg carbon prevention per lamp
                </p> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RegenerateCalc