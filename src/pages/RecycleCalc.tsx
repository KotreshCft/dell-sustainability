"use client"

import { useState, useEffect } from "react"
import { getDustbinData, subscribeToDataChanges } from "../services/dataService"

function RecycleCalc() {
  const [totalCorrectDisposals, setTotalCorrectDisposals] = useState(0)
  const [loading, setLoading] = useState(true)

  // Base values per correct disposal
  const PLASTIC_RECYCLED_PER_DISPOSAL = 0.5 // kg
  const CHIP_PACKETS_LANDFILLED_PER_DISPOSAL = 250

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const dustbinData = await getDustbinData()
        setTotalCorrectDisposals(dustbinData)
      } catch (error) {
        console.error("Error loading dustbin data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()

    // Subscribe to real-time changes
    const unsubscribe = subscribeToDataChanges(async () => {
      const dustbinData = await getDustbinData()
      setTotalCorrectDisposals(dustbinData)
    })

    // Cleanup subscription on unmount
    return unsubscribe
  }, [])

  // Calculate display values based on total correct disposals
  const plasticRecycled = (totalCorrectDisposals * PLASTIC_RECYCLED_PER_DISPOSAL).toFixed(1)
  const chipPacketsLandfilled = totalCorrectDisposals * CHIP_PACKETS_LANDFILLED_PER_DISPOSAL

  // Format large numbers with commas for better readability
  const formatNumber = (num) => {
    return num.toLocaleString()
  }

  return (
    <div className="min-h-screen flex items-start justify-start p-0 relative">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/recyclebg.mp4" type="video/mp4" />
      </video>
      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0"></div>

      <div className="flex flex-col items-start justify-start relative z-10 mt-80 ml-80">
        {loading ? (
          <div className="py-16 px-16 shadow-2xl w-full max-w-6xl" style={{ backgroundColor: "#40586D" }}>
            <p className="text-4xl text-white font-bold">Loading data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-8 w-full max-w-[59rem]">
            {/* Row 1: User Visits and Correct Disposals */}
            <div className="py-12 px-12 shadow-2xl" style={{ backgroundColor: "#40586D" }}>
              <div className="text-left flex flex-col justify-start h-full">
                <p className="text-6xl font-bold text-white drop-shadow-lg mb-4">{totalCorrectDisposals}</p>
                <p className="text-4xl text-white mb-4">Correct disposals</p>
                {/* <p className="text-sm text-gray-300">
                  1 disposal = 0.5kg plastic + 250 packets diverted
                </p> */}
              </div>
            </div>

            <div className="py-12 px-12 shadow-2xl" style={{ backgroundColor: "#40586D" }}>
              <div className="text-left flex flex-col justify-start h-full">
                <p className="text-6xl font-bold text-white drop-shadow-lg mb-4">{plasticRecycled} kg</p>
                <p className="text-4xl text-white mb-4">Multi layered plastic wastage will be recycled</p>
                {/* <p className="text-sm text-gray-300 mt-4">
                  Based on {totalCorrectDisposals} correct disposals
                </p> */}
              </div>
            </div>

            {/* Row 2: Chip Packets Diverted */}
            <div className="col-span-2 py-12 px-12 shadow-2xl" style={{ backgroundColor: "#40586D" }}>
              <div className="text-left">
                <p className="text-6xl font-bold text-white drop-shadow-lg mb-8">{formatNumber(chipPacketsLandfilled)}</p>
                <p className="text-4xl text-white">Chip packets will be diverted from landfills​</p>
                {/* <p className="text-sm text-gray-300 mt-4">
                  Based on {totalCorrectDisposals} correct disposals × 250 packets per disposal
                </p> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecycleCalc