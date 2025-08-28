"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

function ReduceCalc() {
  const [userCount, setUserCount] = useState(0)
  const [loading, setLoading] = useState(true)

  // Base values that get multiplied per user
  const BASE_TREES_PER_USER = 1
  const BASE_CARBON_KGS_PER_USER = 20

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // First, let's check what's in the website table
        const { data: allData, error: allError } = await supabase
          .from("website")
          .select("*")

        console.log("All website table data:", allData)
        console.log("All website table error:", allError)

        // Try to fetch user count from website table
        const { data: visitData, error: visitError } = await supabase
          .from("website")
          .select("*")
          .eq("id", 2)

        console.log("Visit data for id=2:", visitData)
        console.log("Visit error for id=2:", visitError)

        if (visitData && visitData.length > 0) {
          // The data field contains the number of users
          const userData = visitData[0]
          console.log("User data structure:", userData)
          
          // Try different possible field names
          const userCountValue = userData.data || userData.count || userData.users || userData.visits || userData.value || 0
          setUserCount(userCountValue)
        } else {
          // Fallback: try without id filter to see all data
          const { data: fallbackData, error: fallbackError } = await supabase
            .from("website")
            .select("*")

          console.log("Fallback data (all rows):", fallbackData)
          if (fallbackData && fallbackData.length > 0) {
            // Use the first available data
            const firstRow = fallbackData[0]
            const userCountValue = firstRow.data || firstRow.count || firstRow.users || firstRow.visits || firstRow.value || 9
            setUserCount(userCountValue)
          } else {
            // Ultimate fallback - use a default value
            setUserCount(9)
          }
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

  // Calculate display values based on user count
  const treesPlanted = BASE_TREES_PER_USER * userCount
  const carbonAbsorption = BASE_CARBON_KGS_PER_USER * userCount

  return (
    <div
      className="min-h-screen flex items-start justify-start p-0 relative"
      style={{
        backgroundImage: "url(/reducebg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0"></div>

      <div className="flex flex-col items-start justify-start relative z-10 mt-80 ml-80">
        {loading ? (
          <div className="py-20 px-16 shadow-2xl w-full max-w-6xl" style={{ backgroundColor: "#40586D" }}>
            <p className="text-4xl text-white font-bold">Loading data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-8 w-full max-w-[59rem]">
            {/* Row 1: User Visits and Trees Planted */}
            <div className="py-12 px-12 shadow-2xl" style={{ backgroundColor: "#40586D" }}>
              <div className="text-left flex flex-col justify-start h-full">
                <p className="text-6xl font-bold text-white drop-shadow-lg mb-4">{userCount}</p>
                <p className="text-4xl text-white mb-4">User visits to digital collaterals</p>
              </div>
            </div>

            <div className="py-12 px-12 shadow-2xl" style={{ backgroundColor: "#40586D" }}>
              <div className="text-left flex flex-col justify-start h-full">
                <p className="text-6xl font-bold text-white drop-shadow-lg mb-4">{treesPlanted}</p>
                <p className="text-4xl text-white mb-4">Trees will be planted as our contribution​</p>
              </div>
            </div>

            {/* Row 2: Carbon Absorption (spans full width) */}
            <div className="col-span-2 py-12 px-12 shadow-2xl" style={{ backgroundColor: "#40586D" }}>
              <div className="text-left">
                <p className="text-6xl font-bold text-white drop-shadow-lg mb-8">{carbonAbsorption} kgs</p>
                <p className="text-4xl text-white">Carbon absorption per year​ will be planted as our contribution​</p>
          
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReduceCalc