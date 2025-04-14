'use client'

import { useState, useEffect } from 'react'

// Component that uses browser APIs with SSR checks
function BrowserAPIComponent() {
  const [windowWidth, setWindowWidth] = useState<number | null>(null)
  const [localStorageValue, setLocalStorageValue] = useState<string | null>(
    null
  )
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Set isClient to true once component mounts on client
    setIsClient(true)

    // Safely access browser APIs only on client side
    if (typeof window !== 'undefined') {
      // Get window width
      setWindowWidth(window.innerWidth)

      // Get localStorage value
      try {
        const storedValue = localStorage.getItem('testKey')
        setLocalStorageValue(storedValue)
      } catch (e) {
        console.error('Error accessing localStorage:', e)
      }

      // Add event listener for window resize
      const handleResize = () => {
        setWindowWidth(window.innerWidth)
      }

      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Show loading state during SSR
  if (!isClient) {
    return <div>Loading browser data...</div>
  }

  return (
    <div
      style={{
        marginTop: '2rem',
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: '4px',
      }}
    >
      <h2>Browser API Component</h2>
      <p>Window Width: {windowWidth}px</p>
      <p>LocalStorage Value: {localStorageValue || 'Not set'}</p>
      <button
        onClick={() => {
          if (typeof window !== 'undefined') {
            localStorage.setItem(
              'testKey',
              'Updated at ' + new Date().toISOString()
            )
            setLocalStorageValue(localStorage.getItem('testKey'))
          }
        }}
        style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
      >
        Update LocalStorage
      </button>
    </div>
  )
}

export default function Home() {
  const [count, setCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Simulate some client-side initialization
    const timer = setInterval(() => {
      setCount((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!mounted) {
    return <div>Loading...</div>
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Next.js Deployed Issue Reproduction</h1>
      <p>Counter: {count}</p>
      <p>Build ID: {process.env.NEXT_PUBLIC_BUILD_ID || 'Not available'}</p>
      <button
        onClick={() => setCount((prev) => prev + 1)}
        style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
      >
        Increment Counter
      </button>

      {/* Include the browser API component */}
      <BrowserAPIComponent />
    </main>
  )
}
