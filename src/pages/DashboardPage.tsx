"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface DashboardData {
  // Reduce data
  userVisits: number
  treesPlanted: number

  // Recycle data
  correctDisposals: number
  plasticRecycled: number

  // Reuse data
  waterRefills: number
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
    waterConserved: 0,
    cycleInitiatives: 0,
    solarLamps: 0,
  })
  const [loading, setLoading] = useState(true)

  // Constants from individual components
  const BASE_TREES_PER_USER = 1
  const PLASTIC_RECYCLED_PER_DISPOSAL = 0.5
  const WATER_CONSERVED_PER_REFILL = 92708

  useEffect(() => {
    async function fetchAllData() {
      try {
        setLoading(true)

        // Fetch Reduce data (website visits)
        const { data: websiteData, error: websiteError } = await supabase.from("website").select("data").eq("id", 2)

        // Fetch Recycle data (dustbin)
        const { data: dustbinData, error: dustbinError } = await supabase
          .from("dustbin")
          .select("data")
          .in("id", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

        // Fetch Reuse data (water)
        const { data: waterData, error: waterError } = await supabase
          .from("water")
          .select("data")
          .in("id", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

        // Fetch Regenerate data (cycle)
        const { data: cycleData, error: cycleError } = await supabase
          .from("cycle")
          .select("data")
          .in("id", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

        // Process the data
        const userVisits = websiteData && websiteData.length > 0 ? websiteData[0].data : 5
        const treesPlanted = userVisits * BASE_TREES_PER_USER

        const totalCorrectDisposals = dustbinData ? dustbinData.reduce((acc, row) => acc + row.data, 0) : 100
        const plasticRecycled = totalCorrectDisposals * PLASTIC_RECYCLED_PER_DISPOSAL

        const totalWaterRefills = waterData ? waterData.reduce((acc, row) => acc + row.data, 0) : 300
        const waterConserved = totalWaterRefills * WATER_CONSERVED_PER_REFILL

        const totalCycleInitiatives = cycleData ? cycleData.reduce((acc, row) => acc + row.data, 0) : 120
        const displayCycleInitiatives = totalCycleInitiatives * 60

        setDashboardData({
          userVisits,
          treesPlanted,
          correctDisposals: totalCorrectDisposals,
          plasticRecycled,
          waterRefills: totalWaterRefills,
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
  }, [])

  const formatNumber = (num: number) => {
    return num.toLocaleString()
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
          <img src="/delllogo.png" alt="Dell Technologies" className="h-24 w-auto object-contain" />
        </div>

        {loading ? (
          <div className="text-center">
            <div className="text-4xl text-white font-bold">Loading</div>
          </div>
        ) : (
          <div className="space-y-8 w-full">
            {/* Reduce Section */}
            <div className="grid grid-cols-12 gap-0 h-40">
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
            {/* ♻️ Recycle Section */}
            <div className="grid grid-cols-12 gap-0 h-40">
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

            {/* 💧 Re-Use Section */}
            <div className="grid grid-cols-12 gap-0 h-40">
              <div className="col-span-3 bg-transparent flex items-center justify-center ml-[-152px]">
                <img src="/reuselogo.png" alt="Re-Use" className="h-[100%] max-w-none" />
              </div>
              <div className="col-span-9 border-[#0B7C84] border-[5px] flex items-center px-12">
                <span className="text-white text-3xl max-w-[48rem] leading-snug">
                  <span className="font-bold">{dashboardData.waterRefills} Water refills:</span>
                  <br />
                  <span className="font-normal">
                    2 Farmers livelihoods empowered and {formatNumber(dashboardData.waterConserved)} liters of water
                    saved
                  </span>
                </span>
              </div>
            </div>

            {/* 🌱 Regenerate Section */}
            <div className="grid grid-cols-12 gap-0 h-40">
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
