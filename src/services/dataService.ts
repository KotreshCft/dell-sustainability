import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface DataCache {
  waterRefills: number
  userCount: number
  cycleData: number
  lastUpdated: number
}

let dataCache: DataCache = {
  waterRefills: 0,
  userCount: 0,
  cycleData: 0,
  lastUpdated: 0
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

async function fetchAllData(): Promise<DataCache> {
  try {
    // Fetch water refills data
    const { data: waterData } = await supabase
      .from("water")
      .select("data")
      .in("id", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    // Fetch user count data  
    const { data: websiteData } = await supabase
      .from("website")
      .select("*")
      .eq("id", 2)

    // Fetch cycle data
    const { data: cycleDataResult } = await supabase
      .from("cycle")
      .select("data")
      .in("id", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    // Process the data
    const totalWaterRefills = waterData?.reduce((acc, row) => acc + row.data, 0) || 0
    const userCount = websiteData?.[0]?.data || websiteData?.[0]?.count || websiteData?.[0]?.users || 0
    const totalCycleData = cycleDataResult?.reduce((acc, row) => acc + row.data, 0) || 0

    dataCache = {
      waterRefills: totalWaterRefills,
      userCount: userCount,
      cycleData: totalCycleData,
      lastUpdated: Date.now()
    }

    return dataCache
  } catch (error) {
    console.error("Error fetching data:", error)
    // Return cached data or defaults if fetch fails
    return dataCache
  }
}

export async function getWaterRefills(): Promise<number> {
  const now = Date.now()
  if (now - dataCache.lastUpdated > CACHE_DURATION) {
    await fetchAllData()
  }
  return dataCache.waterRefills
}

export async function getUserCount(): Promise<number> {
  const now = Date.now()
  if (now - dataCache.lastUpdated > CACHE_DURATION) {
    await fetchAllData()
  }
  return dataCache.userCount
}

export async function getCycleData(): Promise<number> {
  const now = Date.now()
  if (now - dataCache.lastUpdated > CACHE_DURATION) {
    await fetchAllData()
  }
  return dataCache.cycleData
}

// Initialize data on app start
export function preloadData(): Promise<DataCache> {
  return fetchAllData()
}