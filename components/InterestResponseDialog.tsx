"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Heart, X, Clock, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useNotifications } from "@/hooks/use-notifications"

interface InterestResponseDialogProps {
  interest: {
    id: string;
    senderId: string;
    senderName: string;
    message?: string;
    createdAt: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onResponse: (action: 'accept' | 'decline', duration?: string) => void;
}

const photoAccessOptions = [
  { value: '1day', label: '1 Day', description: 'Photos visible for 1 day' },
  { value: '2days', label: '2 Days', description: 'Photos visible for 2 days' },
  { value: '1week', label: '1 Week', description: 'Photos visible for 1 week' },
  { value: '1month', label: '1 Month', description: 'Photos visible for 1 month' },
  { value: 'permanent', label: 'Permanent', description: 'Photos always visible' }
];

export function InterestResponseDialog({ 
  interest, 
  isOpen, 
  onClose, 
  onResponse 
}: InterestResponseDialogProps) {
  const [photoAccessDuration, setPhotoAccessDuration] = useState('1week')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { refresh: refreshNotifications } = useNotifications()

  const handleAccept = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/profiles/respond-interest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interestId: interest.id,
          action: 'accept',
          photoAccessDuration
        })
      })

      if (!response.ok) {
        throw new Error('Failed to accept interest')
      }

      const result = await response.json()

      toast({
        title: "Interest Accepted! 🎉",
        description: `You've accepted their interest. They can view your photos for ${getAccessDurationText(photoAccessDuration)}.`,
        variant: "default"
      })

      onResponse('accept', photoAccessDuration)
      refreshNotifications()
      onClose()

    } catch (error) {
      console.error("Failed to accept interest:", error)
      toast({
        title: "Failed to Accept Interest",
        description: "There was a problem accepting the interest. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDecline = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/profiles/respond-interest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interestId: interest.id,
          action: 'decline'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to decline interest')
      }

      toast({
        title: "Interest Declined",
        description: "You've declined their interest request.",
        variant: "default"
      })

      onResponse('decline')
      refreshNotifications()
      onClose()

    } catch (error) {
      console.error("Failed to decline interest:", error)
      toast({
        title: "Failed to Decline Interest",
        description: "There was a problem declining the interest. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getAccessDurationText = (duration: string): string => {
    switch (duration) {
      case '1day': return '1 day';
      case '2days': return '2 days';
      case '1week': return '1 week';
      case '1month': return '1 month';
      case 'permanent': return 'permanently';
      default: return '1 week';
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Interest Request
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{interest.senderName}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Sent {formatDate(interest.createdAt)}
              </p>
            </CardHeader>
            <CardContent>
              {interest.message && (
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm">{interest.message}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Privacy Control</span>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="photo-access" className="text-sm font-medium">
                If you accept, how long can they view your photos?
              </Label>
              <Select value={photoAccessDuration} onValueChange={setPhotoAccessDuration}>
                <SelectTrigger id="photo-access">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {photoAccessOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span>{option.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {option.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-blue-50 p-2 rounded">
                <Clock className="h-3 w-3" />
                <span>
                  You can revoke photo access at any time from your dashboard
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleAccept}
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Heart className="h-4 w-4 mr-2" />
              Accept Interest
            </Button>
            
            <Button
              onClick={handleDecline}
              disabled={isLoading}
              variant="outline"
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-2" />
              Decline
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Standalone component for quick responses
export function QuickInterestResponse({ 
  interest, 
  onResponse 
}: { 
  interest: any; 
  onResponse: (action: 'accept' | 'decline', duration?: string) => void;
}) {
  const [showDialog, setShowDialog] = useState(false)

  return (
    <>
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => setShowDialog(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Heart className="h-3 w-3 mr-1" />
          Accept
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => onResponse('decline')}
          className="border-red-200 text-red-600 hover:bg-red-50"
        >
          <X className="h-3 w-3 mr-1" />
          Decline
        </Button>
      </div>

      <InterestResponseDialog
        interest={interest}
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onResponse={onResponse}
      />
    </>
  )
}
