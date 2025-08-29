import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

interface DataCache {
  waterRefills: number
  userCount: number
  cycleData: number
  dustbinData: number
  lastUpdated: number
}

let dataCache: DataCache = {
  waterRefills: 0,
  userCount: 0,
  cycleData: 0,
  dustbinData: 0,
  lastUpdated: 0
}

const CACHE_DURATION = 10 * 1000 // 10 seconds for real-time updates
let listeners: Set<() => void> = new Set()
let isSubscribed = false

async function fetchAllData(): Promise<DataCache> {
  try {
    // Parallel fetch for all data sources
    const [waterData, websiteData, cycleDataResult, dustbinDataResult] = await Promise.all([
      supabase.from("water").select("data").in("id", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      supabase.from("website").select("*"),
      supabase.from("cycle").select("data").in("id", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      supabase.from("dustbin").select("data").in("id", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    ])

    // Process the data
    const totalWaterRefills = waterData.data?.reduce((acc, row) => acc + row.data, 0) || 0
    
    // Look for ID 2 or use the first available record with data
    const websiteRecord = websiteData.data?.find(row => row.id === 2) || websiteData.data?.[0]
    const userCount = websiteRecord?.data || websiteRecord?.count || websiteRecord?.users || websiteRecord?.value || 0
    
    const totalCycleData = cycleDataResult.data?.reduce((acc, row) => acc + row.data, 0) || 0
    const totalDustbinData = dustbinDataResult.data?.reduce((acc, row) => acc + row.data, 0) || 0

    dataCache = {
      waterRefills: totalWaterRefills,
      userCount: userCount,
      cycleData: totalCycleData,
      dustbinData: totalDustbinData,
      lastUpdated: Date.now()
    }

    // Notify all listeners
    listeners.forEach(listener => listener())

    return dataCache
  } catch (error) {
    console.error("Error fetching data:", error)
    return dataCache
  }
}

function setupRealtimeSubscriptions() {
  if (isSubscribed) return

  // Subscribe to all table changes
  const waterChannel = supabase
    .channel('water-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'water' }, () => {
      fetchAllData()
    })
    .subscribe()

  const websiteChannel = supabase
    .channel('website-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'website' }, () => {
      fetchAllData()
    })
    .subscribe()

  const cycleChannel = supabase
    .channel('cycle-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'cycle' }, () => {
      fetchAllData()
    })
    .subscribe()

  const dustbinChannel = supabase
    .channel('dustbin-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'dustbin' }, () => {
      fetchAllData()
    })
    .subscribe()

  isSubscribed = true
}

export async function getWaterRefills(): Promise<number> {
  const now = Date.now()
  if (now - dataCache.lastUpdated > CACHE_DURATION) {
    await fetchAllData()
  }
  setupRealtimeSubscriptions()
  return dataCache.waterRefills
}

export async function getUserCount(): Promise<number> {
  const now = Date.now()
  if (now - dataCache.lastUpdated > CACHE_DURATION) {
    await fetchAllData()
  }
  setupRealtimeSubscriptions()
  return dataCache.userCount
}

export async function getCycleData(): Promise<number> {
  const now = Date.now()
  if (now - dataCache.lastUpdated > CACHE_DURATION) {
    await fetchAllData()
  }
  setupRealtimeSubscriptions()
  return dataCache.cycleData
}

export async function getDustbinData(): Promise<number> {
  const now = Date.now()
  if (now - dataCache.lastUpdated > CACHE_DURATION) {
    await fetchAllData()
  }
  setupRealtimeSubscriptions()
  return dataCache.dustbinData
}

export function subscribeToDataChanges(callback: () => void): () => void {
  listeners.add(callback)
  setupRealtimeSubscriptions()
  
  // Return unsubscribe function
  return () => {
    listeners.delete(callback)
  }
}

// Initialize data on app start
export function preloadData(): Promise<DataCache> {
  setupRealtimeSubscriptions()
  return fetchAllData()
}