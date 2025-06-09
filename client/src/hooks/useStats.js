import { useState, useEffect } from 'react'
import axios from 'axios'

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
        const response = await axios.get('/api/stats')
        console.log('API Response:', response.data)
        
        if (response.data.success && response.data.data) {
          const apiStats = response.data.data
          console.log('API Stats received:', apiStats)
          
          // Transform API data to match our UI structure
          const transformedStats = [
            {
              number: apiStats.find(s => s.label.includes('PGs'))?.number || "2.8K+",
              label: "Verified PGs"
            },
            {
              number: apiStats.find(s => s.label.includes('Tenants'))?.number || "5.2K+",
              label: "Happy Tenants"
            },
            {
              number: apiStats.find(s => s.label.includes('Cities'))?.number || "18+",
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