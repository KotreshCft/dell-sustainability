"use client"

import { useState, useEffect } from "react"
import { getUserCount, getDustbinData, getWaterRefills, getCycleData, subscribeToDataChanges } from "../services/dataService"

interface DashboardData {
  // Reduce data
  userVisits: number
  treesPlanted: number

  // Recycle data
  correctDisposals: number
  plasticRecycled: number

  // Reuse data
  waterRefills: number
  farmersSupported: number
  waterConserved: number

  // Regenerate data
  cycleInitiatives: number
  solarLamps: number
}

function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    userVisits: 0,
    treesPlanted: 0,
    correctDisposals: 0,
    plasticRecycled: 0,
    waterRefills: 0,
    farmersSupported: 0,
    waterConserved: 0,
    cycleInitiatives: 0,
    solarLamps: 0,
  })
  const [loading, setLoading] = useState(true)
  const [visibleSections, setVisibleSections] = useState<boolean[]>([false, false, false, false])

  // Constants from individual components
  const BASE_TREES_PER_USER = 1
  const PLASTIC_RECYCLED_PER_DISPOSAL = 0.5
  const WATER_CONSERVED_PER_REFILL = 92708

  useEffect(() => {
    async function fetchAllData() {
      try {
        setLoading(true)

        // Fetch all data using optimized service
        const [userVisits, totalCorrectDisposals, totalWaterRefills, totalCycleInitiatives] = await Promise.all([
          getUserCount(),
          getDustbinData(),
          getWaterRefills(),
          getCycleData()
        ])

        // Calculate derived values
        const treesPlanted = userVisits * BASE_TREES_PER_USER
        const plasticRecycled = totalCorrectDisposals * PLASTIC_RECYCLED_PER_DISPOSAL
        const farmersSupported = Math.floor(totalWaterRefills / 150) // 1 farmer supported per 150 water refills
        const waterConserved = totalWaterRefills * WATER_CONSERVED_PER_REFILL
        const displayCycleInitiatives = totalCycleInitiatives * 60

        setDashboardData({
          userVisits,
          treesPlanted,
          correctDisposals: totalCorrectDisposals,
          plasticRecycled,
          waterRefills: totalWaterRefills,
          farmersSupported,
          waterConserved,
          cycleInitiatives: displayCycleInitiatives,
          solarLamps: totalCycleInitiatives,
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()

    // Subscribe to real-time changes
    const unsubscribe = subscribeToDataChanges(fetchAllData)

    // Cleanup subscription on unmount
    return unsubscribe
  }, [])

  // Animation effect for showing sections one by one
  useEffect(() => {
    if (!loading) {
      const delays = [500, 800, 1100, 1400] // Staggered delays in milliseconds
      
      delays.forEach((delay, index) => {
        setTimeout(() => {
          setVisibleSections(prev => {
            const newVisible = [...prev]
            newVisible[index] = true
            return newVisible
          })
        }, delay)
      })
    }
  }, [loading])

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  const getSectionClasses = (index: number) => {
    return `grid grid-cols-12 gap-0 h-40 transition-all duration-700 ease-in-out transform ${
      visibleSections[index] 
        ? 'opacity-100 translate-y-0 scale-100' 
        : 'opacity-0 translate-y-8 scale-95'
    }`
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative"
      style={{
        backgroundImage: "url(/dashboard.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0"></div>

      <div className="max-w-[75rem] w-full relative z-10 flex items-center justify-center flex-col ml-[260px]">
        {/* Dell Technologies Logo Area */}
        <div className="flex mb-12 justify-start w-full">
          <img src="/delllogo.png" alt="Dell Technologies" className="h-24 w-auto object-contain ml-[-155px]" />
        </div>

        {loading ? (
          <div className="text-center">
            <div className="text-4xl text-white font-bold">Loading</div>
          </div>
        ) : (
          <div className="space-y-8 w-full">
            {/* Reduce Section */}
            <div className={getSectionClasses(0)}>
              <div className="col-span-3 bg-transparent flex items-center justify-center ml-[-152px]">
                <img src="/reducelogo.png" alt="Reduce" className="h-[100%] max-w-none" />
              </div>
              <div className="col-span-9 border-[#0B7C84] border-[5px] flex items-center px-12">
                <span className="text-white text-4xl max-w-[48rem] leading-snug">
                  <span className="font-bold">{dashboardData.userVisits} Attendees viewed the digital agenda:</span>
                  <br />
                  <span className="font-normal">{dashboardData.treesPlanted} Trees will be planted</span>
                </span>
              </div>
            </div>

            {/* Recycle Section */}
            <div className={getSectionClasses(1)}>
              <div className="col-span-3 bg-transparent flex items-center justify-center ml-[-152px]">
                <img src="/recyclelogo.png" alt="Recycle" className="h-[100%] max-w-none" />
              </div>
              <div className="col-span-9 border-[#0B7C84] border-[5px] flex items-center px-12">
                <span className="text-white text-3xl max-w-[48rem] leading-snug">
                  <span className="font-bold">{dashboardData.correctDisposals} Correct disposal:</span>
                  <br />
                  <span className="font-normal">{dashboardData.plasticRecycled} KG of MLP waste will be recycled</span>
                </span>
              </div>
            </div>

            {/* Re-Use Section */}
            <div className={getSectionClasses(2)}>
              <div className="col-span-3 bg-transparent flex items-center justify-center ml-[-152px]">
                <img src="/reuselogo.png" alt="Re-Use" className="h-[100%] max-w-none" />
              </div>
              <div className="col-span-9 border-[#0B7C84] border-[5px] flex items-center px-12">
                <span className="text-white text-3xl max-w-[48rem] leading-snug">
                  <span className="font-bold">{dashboardData.waterRefills} Water refills:</span>
                  <br />
                  <span className="font-normal">
                    {dashboardData.farmersSupported} Farmers livelihoods empowered and {formatNumber(dashboardData.waterConserved)} liters of water
                    saved
                  </span>
                </span>
              </div>
            </div>

            {/* Regenerate Section */}
            <div className={getSectionClasses(3)}>
              <div className="col-span-3 bg-transparent flex items-center justify-center ml-[-152px]">
                <img src="/regenlogo.png" alt="Regenerate" className="h-[100%] max-w-none" />
              </div>
              <div className="col-span-9 border-[#0B7C84] border-[5px] flex items-center px-12">
                <span className="text-white text-3xl max-w-[48rem] leading-snug">
                  <span className="font-bold">{dashboardData.cycleInitiatives} Seconds of cycling:</span>
                  <br />
                  <span className="font-normal">{dashboardData.solarLamps} Solar lamps funded</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage