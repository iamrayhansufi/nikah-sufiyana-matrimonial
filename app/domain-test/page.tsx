'use client'

import { useEffect, useState } from 'react'

export default function DomainTest() {
  const [hostname, setHostname] = useState<string>('')
  const [fullUrl, setFullUrl] = useState<string>('')
  const [cookies, setCookies] = useState<string[]>([])
  const [redirects, setRedirects] = useState<string[]>([])
  const [counter, setCounter] = useState<number>(0)
  
  useEffect(() => {
    // Record URL data
    setHostname(window.location.hostname)
    setFullUrl(window.location.href)
    
    // Record cookies
    setCookies(document.cookie.split(';').map(c => c.trim()))
    
    // Track potential redirects by storing URL in local storage
    const redirectHistory = JSON.parse(localStorage.getItem('redirectHistory') || '[]')
    redirectHistory.push(window.location.href)
    
    if (redirectHistory.length > 10) {
      redirectHistory.shift() // Keep only last 10 entries
    }
    
    localStorage.setItem('redirectHistory', JSON.stringify(redirectHistory))
    setRedirects(redirectHistory)
    
    // Force re-render every second to update time
    const timer = setInterval(() => {
      setCounter(c => c + 1)
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])
  
  const clearCookies = () => {
    // Clear common auth cookies
    document.cookie = 'next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    document.cookie = '__Secure-next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Secure'
    document.cookie = '__Host-next-auth.csrf-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Secure'
    document.cookie = '__Secure-next-auth.callback-url=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Secure'
    
    // Refresh to update cookie list
    window.location.reload()
  }
  
  const clearHistory = () => {
    localStorage.setItem('redirectHistory', '[]')
    setRedirects([])
  }
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Domain and Cookie Test</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Current Domain Info</h2>
        <p><strong>Hostname:</strong> {hostname}</p>
        <p><strong>Full URL:</strong> {fullUrl}</p>
        <p><strong>Time on page:</strong> {counter} seconds</p>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Cookies</h2>
          <button 
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700" 
            onClick={clearCookies}
          >
            Clear Cookies
          </button>
        </div>
        <ul className="list-disc pl-5">
          {cookies.length > 0 ? (
            cookies.map((cookie, i) => (
              <li key={i}>{cookie}</li>
            ))
          ) : (
            <li>No cookies found</li>
          )}
        </ul>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Redirect History</h2>
          <button 
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700" 
            onClick={clearHistory}
          >
            Clear History
          </button>
        </div>
        <ul className="list-decimal pl-5">
          {redirects.map((url, i) => (
            <li key={i}>{url}</li>
          ))}
        </ul>
      </div>
      
      <div className="flex gap-4 mt-8">
        <a 
          href="/api/auth/debug" 
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Auth Debug JSON
        </a>
        <a 
          href="/" 
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Go to Homepage
        </a>
      </div>
    </div>
  )
}
