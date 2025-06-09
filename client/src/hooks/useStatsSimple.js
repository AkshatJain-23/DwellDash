import { useState, useEffect } from 'react'
import axios from 'axios'

const useStatsSimple = () => {
  const [stats, setStats] = useState([
    { number: "Loading...", label: "Verified PGs" },
    { number: "Loading...", label: "Happy Tenants" },
    { number: "Loading...", label: "Cities" },
    { number: "Zero", label: "Brokerage" }
  ])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('Fetching stats from /api/stats...')
        const response = await axios.get('/api/stats')
        console.log('Response received:', response.data)
        
        if (response.data.success && response.data.data) {
          const apiStats = response.data.data
          console.log('API Stats:', apiStats)
          
          // Simple transformation without animation
          const transformedStats = [
            {
              number: apiStats.find(s => s.label.includes('PGs'))?.number || "Error",
              label: "Verified PGs"
            },
            {
              number: apiStats.find(s => s.label.includes('Tenants'))?.number || "Error",
              label: "Happy Tenants"
            },
            {
              number: apiStats.find(s => s.label.includes('Cities'))?.number || "Error",
              label: "Cities"
            },
            {
              number: "Zero",
              label: "Brokerage"
            }
          ]
          
          console.log('Transformed stats:', transformedStats)
          setStats(transformedStats)
        }
      } catch (err) {
        console.error('Error fetching stats:', err)
        setError(err.message)
        // Set error stats
        setStats([
          { number: "Error", label: "Verified PGs" },
          { number: "Error", label: "Happy Tenants" },
          { number: "Error", label: "Cities" },
          { number: "Zero", label: "Brokerage" }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading, error }
}

export default useStatsSimple 