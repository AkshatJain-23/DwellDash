import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const StatsContext = createContext()

export const useStats = () => {
  const context = useContext(StatsContext)
  if (!context) {
    throw new Error('useStats must be used within a StatsProvider')
  }
  return context
}

export const StatsProvider = ({ children }) => {
  // Enhanced fallback data that will show immediately
  const [stats, setStats] = useState([
    { number: "8,000+", label: "Verified PGs", key: "properties" },
    { number: "50,000+", label: "Happy Tenants", key: "tenants" },
    { number: "25+", label: "Cities", key: "cities" },
    { number: "Zero", label: "Brokerage", key: "brokerage" }
  ])
  
  const [rawStats, setRawStats] = useState({
    properties: 8,
    tenants: 50000,
    cities: 25,
    satisfaction: 95,
    avgRating: 4.8,
    totalBookings: 15000
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Get specific stat by key
  const getStat = (key) => {
    const stat = stats.find(s => s.key === key)
    return stat ? stat.number : '0'
  }

  // Get raw stat value
  const getRawStat = (key) => {
    return rawStats[key] || 0
  }

  // Format number for display
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return Math.floor(num / 100000) / 10 + 'M+'
    } else if (num >= 1000) {
      return Math.floor(num / 100) / 10 + 'K+'
    }
    return num.toString() + '+'
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        console.log('Fetching live stats from API...')
        const response = await axios.get('/api/stats')
        
        if (response.data.success && response.data.data) {
          const apiStats = response.data.data
          console.log('Live stats received:', apiStats)
          
          // Update stats array
          const updatedStats = [
            { 
              number: apiStats.find(s => s.label.includes('PGs'))?.number || "8,000+", 
              label: "Verified PGs", 
              key: "properties" 
            },
            { 
              number: apiStats.find(s => s.label.includes('Tenants'))?.number || "50,000+", 
              label: "Happy Tenants", 
              key: "tenants" 
            },
            { 
              number: apiStats.find(s => s.label.includes('Cities'))?.number || "25+", 
              label: "Cities", 
              key: "cities" 
            },
            { 
              number: "Zero", 
              label: "Brokerage", 
              key: "brokerage" 
            }
          ]
          
          setStats(updatedStats)
          
          // Update raw stats if available
          if (response.data.rawData) {
            const raw = response.data.rawData
            setRawStats({
              properties: raw.properties || 8000,
              tenants: raw.users || 50000,
              cities: raw.cities || 25,
              satisfaction: raw.satisfaction || 95,
              avgRating: 4.8,
              totalBookings: Math.floor((raw.users || 50000) * 0.3) // Estimate 30% booking rate
            })
          }
          
          setLastUpdated(new Date())
          setError(null)
        }
      } catch (err) {
        console.error('Error fetching live stats:', err)
        setError(err.message)
        // Keep fallback stats
      } finally {
        setLoading(false)
      }
    }

    // Fetch stats immediately
    fetchStats()
    
    // Set up periodic refresh every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  const value = {
    stats,
    rawStats,
    loading,
    error,
    lastUpdated,
    getStat,
    getRawStat,
    formatNumber
  }

  return (
    <StatsContext.Provider value={value}>
      {children}
    </StatsContext.Provider>
  )
}

export default StatsContext 