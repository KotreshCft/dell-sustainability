"use client"

import { useState, useEffect } from "react"
import { getUserCount, subscribeToDataChanges } from "../services/dataService"
import { DataLoader } from "../components/DataLoader"
import 'animate.css';

function ReduceCalc() {
  const [userCount, setUserCount] = useState(0)

  // Base values that get multiplied per user
  const BASE_TREES_PER_USER = 1
  const BASE_CARBON_KGS_PER_USER = 20

  useEffect(() => {
    async function loadData() {
      try {
        const count = await getUserCount()
        setUserCount(count)
      } catch (error) {
        console.error("Error loading user count data:", error)
      }
    }

    loadData()

    // Subscribe to real-time changes
    const unsubscribe = subscribeToDataChanges(async () => {
      const count = await getUserCount()
      setUserCount(count)
    })

    // Cleanup subscription on unmount
    return unsubscribe
  }, [])

  // Calculate display values based on user count
  const treesPlanted = BASE_TREES_PER_USER * userCount
  const carbonAbsorption = BASE_CARBON_KGS_PER_USER * userCount

  return (
    <DataLoader>
      <div className="min-h-screen flex items-start justify-start p-0 relative animate__animated animate__fadeIn ">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/reducebg.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0"></div>

        <div className="flex flex-col items-start justify-start relative z-10 mt-[300px] ml-[350px]">
          <div className="grid grid-cols-2 gap-4 w-full max-w-[57rem]">
            {/* Row 1: User Visits and Trees Planted */}
            <div className="px-12 py-8 shadow-2xl" style={{ backgroundColor: "#40586D" }}>
              <div className="text-left flex flex-col justify-start h-full">
                <p className="text-5xl font-bold text-white drop-shadow-lg mb-4">{userCount}</p>
                <p className="text-[44px] font-light text-white mb-4">User visits to digital collaterals</p>
              </div>
            </div>

            <div className=" py-8 px-12 shadow-2xl" style={{ backgroundColor: "#40586D" }}>
              <div className="text-left flex flex-col justify-start h-full">
                <p className="text-5xl font-bold text-white drop-shadow-lg mb-4">{treesPlanted}</p>
                <p className="text-[44px] font-light text-white mb-4">Trees will be planted as our contribution​</p>
              </div>
            </div>

            {/* Row 2: Carbon Absorption (spans full width) */}
            <div className="col-span-2 py-8 px-10 shadow-2xl" style={{ backgroundColor: "#40586D" }}>
              <div className="text-left">
                <p className="text-5xl font-bold text-white drop-shadow-lg mb-8">{carbonAbsorption} kgs</p>
                <p className="text-[44px] font-light text-white">Carbon absorption per year​ due to the plantation​</p>
          
              </div>
            </div>
          </div>
        </div>
      </div>
    </DataLoader>
  )
}

export default ReduceCalc