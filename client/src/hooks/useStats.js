import { useState, useEffect } from 'react'
import { api } from '../utils/api'

const useStats = () => {
  // Start with impressive fallback data that will show immediately
  const [stats, setStats] = useState([
    { number: "2.8K+", label: "Verified PGs" },
    { number: "5.2K+", label: "Happy Tenants" },
    { number: "18+", label: "Cities" },
    { number: "Zero", label: "Brokerage" }
  ])
  const [loading, setLoading] = useState(false) // Start with false to show data immediately
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('Fetching live stats from API...')
        const response = await api.get('/stats')
        console.log('API Response:', response.data)
        
        // Handle both mock API response format and real API response format
        let apiStats = response.data
        if (response.data.success && response.data.data) {
          apiStats = response.data.data
        }
        
        console.log('API Stats received:', apiStats)
        
        // If we get an array of stats from API, transform them
        if (Array.isArray(apiStats)) {
          const transformedStats = [
            {
              number: apiStats.find(s => s.label && s.label.toLowerCase().includes('pg'))?.number || "2.8K+",
              label: "Verified PGs"
            },
            {
              number: apiStats.find(s => s.label && s.label.toLowerCase().includes('tenant'))?.number || "5.2K+",
              label: "Happy Tenants"
            },
            {
              number: apiStats.find(s => s.label && s.label.toLowerCase().includes('cit'))?.number || "18+",
              label: "Cities"
            },
            {
              number: "Zero",
              label: "Brokerage"
            }
          ]
          
          console.log('Setting transformed stats:', transformedStats)
          setStats(transformedStats)
        }
      } catch (err) {
        console.error('Error fetching stats, using fallback data:', err)
        setError(err.message)
        // Keep the fallback stats if API fails
      } finally {
        setLoading(false)
      }
    }

    // Fetch stats but don't block the UI
    fetchStats()
  }, [])

  return { stats, loading, error }
}

export default useStats 