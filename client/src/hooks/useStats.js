import { useState, useEffect } from 'react'
import axios from 'axios'

const useStats = () => {
  const [stats, setStats] = useState([
    { number: "0+", label: "Verified PGs" },
    { number: "0+", label: "Happy Tenants" },
    { number: "0+", label: "Cities" },
    { number: "Zero", label: "Brokerage" }
  ])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Function to animate counting effect
  const animateValue = (start, end, duration, callback) => {
    const startTime = performance.now()
    const animate = (currentTime) => {
      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      const currentValue = Math.floor(start + (end - start) * easeOutCubic)
      
      callback(currentValue)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }

  // Function to format numbers with animation
  const formatAnimatedNumber = (value, originalFormatted) => {
    if (originalFormatted === "Zero") return "Zero"
    
    // Extract the numeric part and suffix
    const match = originalFormatted.match(/^(\d+(?:\.\d+)?)(.*?)$/)
    if (!match) return originalFormatted
    
    const numericPart = parseFloat(match[1])
    const suffix = match[2]
    
    return `${value}${suffix}`
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/stats')
        
        if (response.data.success && response.data.data) {
          const apiStats = response.data.data
          
          // Set initial animated stats
          const initialStats = [
            { number: "0+", label: "Verified PGs" },
            { number: "0+", label: "Happy Tenants" },
            { number: "0+", label: "Cities" },
            { number: "Zero", label: "Brokerage" }
          ]
          setStats(initialStats)
          setLoading(false)
          
          // Animate to final values with delay
          setTimeout(() => {
            const finalStats = [
              {
                number: apiStats.find(s => s.label.includes('PGs'))?.number || "0+",
                label: "Verified PGs"
              },
              {
                number: apiStats.find(s => s.label.includes('Tenants'))?.number || "0+",
                label: "Happy Tenants"
              },
              {
                number: apiStats.find(s => s.label.includes('Cities'))?.number || "0+",
                label: "Cities"
              },
              {
                number: "Zero",
                label: "Brokerage"
              }
            ]
            
            // Animate each statistic
            finalStats.forEach((stat, index) => {
              if (stat.number !== "Zero") {
                const match = stat.number.match(/^(\d+(?:\.\d+)?)(.*?)$/)
                if (match) {
                  const targetValue = parseFloat(match[1])
                  const suffix = match[2]
                  
                  animateValue(0, targetValue, 2000 + index * 200, (currentValue) => {
                    setStats(prevStats => {
                      const newStats = [...prevStats]
                      newStats[index] = {
                        ...newStats[index],
                        number: currentValue === targetValue ? stat.number : `${currentValue}${suffix}`
                      }
                      return newStats
                    })
                  })
                }
              }
            })
          }, 300)
        }
      } catch (err) {
        console.error('Error fetching stats:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const refetchStats = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/stats')
      
      if (response.data.success && response.data.data) {
        const apiStats = response.data.data
        const transformedStats = [
          {
            number: apiStats.find(s => s.label.includes('PGs'))?.number || "0+",
            label: "Verified PGs"
          },
          {
            number: apiStats.find(s => s.label.includes('Tenants'))?.number || "0+",
            label: "Happy Tenants"
          },
          {
            number: apiStats.find(s => s.label.includes('Cities'))?.number || "0+",
            label: "Cities"
          },
          {
            number: "Zero",
            label: "Brokerage"
          }
        ]
        setStats(transformedStats)
      }
    } catch (err) {
      console.error('Error fetching stats:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { stats, loading, error, refetch: refetchStats }
}

export default useStats 