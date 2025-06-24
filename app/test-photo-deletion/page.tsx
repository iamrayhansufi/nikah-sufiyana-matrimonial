"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"

export default function PhotoDeletionTestPage() {
  const { data: session } = useSession()
  const [photos, setPhotos] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const fetchPhotos = async () => {
    if (!session?.user?.id) return

    try {
      const response = await fetch(`/api/profiles/${session.user.id}`, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate"
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Profile data:", data)
        setPhotos(data.profilePhotos || [])
        setMessage(`Loaded ${data.profilePhotos?.length || 0} photos`)
      } else {
        setMessage("Failed to load photos")
      }
    } catch (error) {
      console.error("Error fetching photos:", error)
      setMessage("Error loading photos")
    }
  }

  const deletePhoto = async (photoUrl: string) => {
    if (!session?.user?.id) {
      setMessage("Not authenticated")
      return
    }

    setLoading(true)
    setMessage(`Deleting photo: ${photoUrl}`)

    try {
      console.log("=== FRONTEND DELETE REQUEST ===")
      console.log("Session:", session)
      console.log("Photo URL:", photoUrl)

      const response = await fetch('/api/profiles/delete-photo', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({ photoUrl })
      })

      console.log("Delete response status:", response.status)
      console.log("Delete response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Delete error:", errorData)
        setMessage(`Delete failed: ${errorData.error}`)
        return
      }

      const result = await response.json()
      console.log("Delete success:", result)
      setMessage(`Photo deleted successfully! ${result.remainingPhotos} photos remaining`)

      // Refresh the photos list
      await fetchPhotos()
    } catch (error) {
      console.error("Delete error:", error)
      setMessage(`Delete error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user?.id) {
      fetchPhotos()
    }
  }, [session])

  if (!session) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Photo Deletion Test</h1>
        <p>Please log in to test photo deletion</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Photo Deletion Test</h1>
      
      <div className="mb-4">
        <button 
          onClick={fetchPhotos}
          className="bg-red-500 text-white px-4 py-2 rounded mr-2"
          disabled={loading}
        >
          Refresh Photos
        </button>
        <span className="text-sm text-gray-600">User: {session.user.email}</span>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-gray-100 rounded">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <div key={index} className="border rounded p-4">
            <div className="mb-2">
              <img 
                src={photo} 
                alt={`Photo ${index + 1}`} 
                className="w-full h-48 object-cover rounded"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/placeholder-user.jpg'
                }}
              />
            </div>
            <div className="text-sm text-gray-600 mb-2 break-all">
              {photo}
            </div>
            <button
              onClick={() => deletePhoto(photo)}
              disabled={loading}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:opacity-50"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        ))}
      </div>

      {photos.length === 0 && (
        <p className="text-gray-500">No photos found</p>
      )}
    </div>
  )
}
