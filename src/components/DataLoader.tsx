import React, { useState, useEffect } from 'react'
import { preloadData } from '../services/dataService'

interface DataLoaderProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function DataLoader({ children, fallback }: DataLoaderProps) {
  const [isDataReady, setIsDataReady] = useState(false)

  useEffect(() => {
    async function ensureDataLoaded() {
      try {
        await preloadData()
        setIsDataReady(true)
      } catch (error) {
        console.error('Error preloading data:', error)
        // Still render even if there's an error
        setIsDataReady(true)
      }
    }

    ensureDataLoaded()
  }, [])

  if (!isDataReady) {
    return fallback || null
  }

  return <>{children}</>
}