"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Shield, Clock, Eye, EyeOff, X, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface PhotoAccessItem {
  interestId: string;
  senderId: string;
  senderName: string;
  senderPhoto: string;
  duration: string;
  grantedAt: string;
  expiryDate: string;
  isPermanent: boolean;
  remainingTime?: {
    days: number;
    hours: number;
    totalMs: number;
  };
}

export function PhotoAccessManager() {
  const [photoAccessList, setPhotoAccessList] = useState<PhotoAccessItem[]>([])
  const [loading, setLoading] = useState(true)
  const [revoking, setRevoking] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchPhotoAccessList()
    
    // Set up interval to update remaining time
    const interval = setInterval(() => {
      setPhotoAccessList(prev => prev.map(item => {
        if (!item.isPermanent && item.expiryDate) {
          const expiryDate = new Date(item.expiryDate);
          const now = new Date();
          const timeDiff = expiryDate.getTime() - now.getTime();
          
          if (timeDiff > 0) {
            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            return { ...item, remainingTime: { days, hours, totalMs: timeDiff } };
          }
        }
        return item;
      }))
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const fetchPhotoAccessList = async () => {
    try {
      const response = await fetch('/api/profiles/photo-access-list', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setPhotoAccessList(data.photoAccessList || [])
      }
    } catch (error) {
      console.error('Error fetching photo access list:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRevokeAccess = async (interestId: string, senderName: string) => {
    setRevoking(interestId)
    
    try {
      const response = await fetch('/api/profiles/revoke-photo-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interestId })
      })

      if (!response.ok) {
        throw new Error('Failed to revoke photo access')
      }

      // Remove from list
      setPhotoAccessList(prev => prev.filter(item => item.interestId !== interestId))
      
      toast({
        title: "Photo Access Revoked",
        description: `${senderName}'s photo access has been revoked.`,
        variant: "default"
      })

    } catch (error) {
      console.error("Failed to revoke photo access:", error)
      toast({
        title: "Failed to Revoke Access",
        description: "There was a problem revoking photo access. Please try again.",
        variant: "destructive"
      })
    } finally {
      setRevoking(null)
    }
  }

  const getDurationText = (duration: string): string => {
    switch (duration) {
      case '1day': return '1 day';
      case '2days': return '2 days';
      case '1week': return '1 week';
      case '1month': return '1 month';
      case 'permanent': return 'Permanent';
      default: return duration;
    }
  }

  const getRemainingTimeText = (remainingTime?: { days: number; hours: number }) => {
    if (!remainingTime) return 'Expired';
    
    if (remainingTime.days > 0) {
      return `${remainingTime.days}d ${remainingTime.hours}h remaining`;
    } else if (remainingTime.hours > 0) {
      return `${remainingTime.hours}h remaining`;
    } else {
      return 'Less than 1h remaining';
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Photo Access Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-t-emerald-600 border-emerald-200 rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading photo access information...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Photo Access Management
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Manage who can view your photos and for how long
        </p>
      </CardHeader>
      <CardContent>
        {photoAccessList.length === 0 ? (
          <div className="text-center py-8">
            <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No Active Photo Access</h3>
            <p className="text-muted-foreground">
              No one currently has access to view your photos.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {photoAccessList.map((item) => (
              <div key={item.interestId} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Link href={`/profile/${item.senderId.replace('user:', '')}`}>
                    <Avatar className="h-12 w-12 cursor-pointer">
                      <AvatarImage src={item.senderPhoto || "/placeholder.svg"} alt={item.senderName} />
                      <AvatarFallback>
                        {item.senderName.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  
                  <div>
                    <Link href={`/profile/${item.senderId.replace('user:', '')}`}>
                      <h4 className="font-semibold hover:text-primary cursor-pointer">
                        {item.senderName}
                      </h4>
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {item.isPermanent ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Permanent Access
                        </Badge>
                      ) : (
                        <span>
                          {item.remainingTime && item.remainingTime.totalMs > 0 
                            ? getRemainingTimeText(item.remainingTime)
                            : 'Expired'
                          }
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Granted on {new Date(item.grantedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!item.isPermanent && item.remainingTime && item.remainingTime.totalMs > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {getDurationText(item.duration)}
                    </Badge>
                  )}
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        disabled={revoking === item.interestId}
                      >
                        {revoking === item.interestId ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <EyeOff className="h-3 w-3 mr-1" />
                        )}
                        Revoke
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                          Revoke Photo Access
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p>
                          Are you sure you want to revoke <strong>{item.senderName}'s</strong> photo access? 
                          They will no longer be able to view your photos.
                        </p>
                        <div className="flex gap-3">
                          <Button
                            onClick={() => handleRevokeAccess(item.interestId, item.senderName)}
                            disabled={revoking === item.interestId}
                            className="flex-1 bg-red-600 hover:bg-red-700"
                          >
                            {revoking === item.interestId ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            ) : (
                              <EyeOff className="h-4 w-4 mr-2" />
                            )}
                            Revoke Access
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
