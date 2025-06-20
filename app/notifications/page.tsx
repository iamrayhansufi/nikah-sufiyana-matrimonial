"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, MessageSquare, Eye, Bell, Star, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { playfair } from "../lib/fonts"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { format, isToday, isYesterday, formatDistanceToNow } from "date-fns"
import { useNotifications } from "@/hooks/use-notifications"

// Group notifications by day
function groupNotificationsByDate(notifications: any[]) {
  const groups: Record<string, any[]> = {
    today: [],
    yesterday: [],
    older: []
  };

  notifications.forEach(notification => {
    const date = new Date(notification.createdAt);
    if (isToday(date)) {
      groups.today.push(notification);
    } else if (isYesterday(date)) {
      groups.yesterday.push(notification);
    } else {
      groups.older.push(notification);
    }
  });

  return groups;
}

export default function NotificationsPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session, status } = useSession();
  const router = useRouter();
    // Use the notifications hook
  const { notifications, markAsRead, refresh: refreshNotifications } = useNotifications();
  
  // Set loading to false once we have session status
  useEffect(() => {
    if (status !== "loading") {
      setLoading(false);
    }
  }, [status]);  const handleNotificationClick = async (notification: any) => {
    try {
      console.log('Notification clicked on notifications page:', {
        id: notification.id,
        type: notification.type,
        link: notification.link,
        message: notification.message
      });
      
      if (!notification.read) {
        await markAsRead(notification.id);
      }
      
      if (notification.link) {
        console.log('Navigating to:', notification.link);
        router.push(notification.link);
      } else {
        console.log('No link found in notification');
      }
    } catch (error) {
      console.error('Failed to handle notification click:', error);
    }
  };

  const handleInterestResponse = async (interestId: string, action: 'accept' | 'decline', notificationId: number) => {
    try {
      const response = await fetch('/api/profiles/respond-interest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interestId: parseInt(interestId),
          action: action
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${action} interest`);
      }        // Mark notification as read
      await markAsRead(notificationId);
      
      // Show success message based on action
      alert(action === 'accept' 
        ? 'Interest accepted! They can now view your photos.' 
        : 'Interest declined.');
      
      // Refresh notifications to ensure immediate UI update
      await refreshNotifications();
      
    } catch (error) {
      console.error(`Failed to ${action} interest:`, error);
      alert(`Failed to ${action} interest. Please try again.`);
    }
  };
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'interest':
        return <Heart className="h-5 w-5 text-red-500" />;
      case 'interest_accepted':
        return <Heart className="h-5 w-5 text-green-500 fill-green-500" />;
      case 'interest_declined':
        return <Heart className="h-5 w-5 text-gray-500" />;
      case 'match':
        return <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'profile_view':
        return <Eye className="h-5 w-5 text-purple-500" />;
      case 'premium':
        return <Star className="h-5 w-5 text-yellow-500" />;
      case 'system':
        return <Bell className="h-5 w-5 text-primary" />;
      default:
        return <AlertCircle className="h-5 w-5 text-primary" />;
    }
  };
  const renderNotificationActions = (notification: any) => {
    if (notification.type === 'interest' && notification.metadata?.interestId) {
      return (
        <>
          <Button 
            size="sm" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => handleInterestResponse(
              notification.metadata.interestId, 
              'accept', 
              notification.id
            )}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Allow Photos
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => handleInterestResponse(
              notification.metadata.interestId, 
              'decline', 
              notification.id
            )}
          >
            Decline
          </Button>
        </>
      );
    }
    
    if (notification.link) {
      return (
        <Button size="sm" onClick={() => handleNotificationClick(notification)}>
          View
        </Button>
      );
    }
    
    return null;
  };

  const groupedNotifications = groupNotificationsByDate(notifications);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className={`${playfair.className} text-2xl font-semibold text-center mb-8`}>Notifications</h1>
          
          <Card>
            <CardContent className="p-6">
              {loading ? (
                <div className="py-20 text-center">
                  <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-primary rounded-full mb-4" />
                  <p>Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-20 text-center">
                  <Bell className="w-12 h-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                  <p className="text-lg text-muted-foreground">No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Today */}
                  {groupedNotifications.today.length > 0 && (
                    <div>
                      <h2 className={`${playfair.className} text-lg font-semibold mb-4`}>Today</h2>
                      <div className="space-y-4">                        {groupedNotifications.today.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`flex items-start gap-4 p-3 rounded-lg transition-colors ${!notification.read ? 'bg-muted/50' : ''}`}
                          >
                            <div className="bg-primary/10 p-2 rounded-full">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1">                              <h3 className={`${playfair.className} font-medium`}>
                                {notification.type === 'interest' && 'New Interest'}
                                {notification.type === 'interest_accepted' && 'Interest Accepted! 🎉'}
                                {notification.type === 'interest_declined' && 'Interest Declined'}
                                {notification.type === 'match' && 'New Match! 💕'}
                                {notification.type === 'message' && 'New Message'}
                                {notification.type === 'profile_view' && 'Profile View'}
                                {notification.type === 'premium' && 'Premium Feature'}                                {notification.type === 'system' && 'System Notification'}
                              </h3>
                              <p className="text-lg text-muted-foreground">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                {renderNotificationActions(notification)}
                                {notification.link && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                    onClick={() => handleNotificationClick(notification)}
                                  >
                                    View Profile
                                  </Button>
                                )}
                                {!notification.read && (
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => markAsRead(notification.id)}
                                  >
                                    Mark as Read
                                  </Button>
                                )}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Yesterday */}
                  {groupedNotifications.yesterday.length > 0 && (
                    <div>
                      <h2 className={`${playfair.className} text-lg font-semibold mb-4`}>Yesterday</h2>
                      <div className="space-y-4">
                        {groupedNotifications.yesterday.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`flex items-start gap-4 p-3 rounded-lg transition-colors ${!notification.read ? 'bg-muted/50' : ''}`}
                          >
                            <div className="bg-primary/10 p-2 rounded-full">
                              {getNotificationIcon(notification.type)}
                            </div>                            <div className="flex-1">
                              <h3 className={`${playfair.className} font-medium`}>
                                {notification.type === 'interest' && 'New Interest'}
                                {notification.type === 'interest_accepted' && 'Interest Accepted! 🎉'}
                                {notification.type === 'interest_declined' && 'Interest Declined'}
                                {notification.type === 'match' && 'New Match! 💕'}
                                {notification.type === 'message' && 'New Message'}
                                {notification.type === 'profile_view' && 'Profile View'}
                                {notification.type === 'premium' && 'Premium Feature'}
                                {notification.type === 'system' && 'System Notification'}
                              </h3>
                              <p className="text-lg text-muted-foreground">
                                {notification.message}
                              </p>                              <div className="flex items-center gap-2 mt-2">
                                {renderNotificationActions(notification)}
                                {notification.link && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                    onClick={() => handleNotificationClick(notification)}
                                  >
                                    View Profile
                                  </Button>
                                )}
                                {!notification.read && (
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => markAsRead(notification.id)}
                                  >
                                    Mark as Read
                                  </Button>
                                )}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Older */}
                  {groupedNotifications.older.length > 0 && (
                    <div>
                      <h2 className={`${playfair.className} text-lg font-semibold mb-4`}>Earlier</h2>
                      <div className="space-y-4">
                        {groupedNotifications.older.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`flex items-start gap-4 p-3 rounded-lg transition-colors ${!notification.read ? 'bg-muted/50' : ''}`}
                          >
                            <div className="bg-primary/10 p-2 rounded-full">
                              {getNotificationIcon(notification.type)}
                            </div>                            <div className="flex-1">
                              <h3 className={`${playfair.className} font-medium`}>
                                {notification.type === 'interest' && 'New Interest'}
                                {notification.type === 'interest_accepted' && 'Interest Accepted! 🎉'}
                                {notification.type === 'interest_declined' && 'Interest Declined'}
                                {notification.type === 'match' && 'New Match! 💕'}
                                {notification.type === 'message' && 'New Message'}
                                {notification.type === 'profile_view' && 'Profile View'}
                                {notification.type === 'premium' && 'Premium Feature'}
                                {notification.type === 'system' && 'System Notification'}
                              </h3>
                              <p className="text-lg text-muted-foreground">
                                {notification.message}
                              </p>                              <div className="flex items-center gap-2 mt-2">
                                {renderNotificationActions(notification)}
                                {notification.link && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                    onClick={() => handleNotificationClick(notification)}
                                  >
                                    View Profile
                                  </Button>
                                )}
                                {!notification.read && (
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => markAsRead(notification.id)}
                                  >
                                    Mark as Read
                                  </Button>
                                )}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(notification.createdAt), 'MMM d')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
