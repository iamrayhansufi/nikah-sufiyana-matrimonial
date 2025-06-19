import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { createNotificationSound } from '@/lib/notification-sound';

interface Notification {
  id: number;
  type: string;
  message: string;
  link?: string;
  metadata?: Record<string, any>;
  read: boolean;
  createdAt: string;
}

export function useNotifications() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const playSound = useRef<(() => void) | null>(null);
  const lastNotificationId = useRef<number>(0);

  // Initialize audio for notifications
  useEffect(() => {
    try {
      playSound.current = createNotificationSound();
    } catch (error) {
      console.log('Web Audio API not supported:', error);
    }
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch('/api/notifications', {
        credentials: 'include',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (response.ok) {
        const newNotifications = await response.json();
        
        // Check for new notifications
        if (newNotifications.length > 0) {
          const latestNotificationId = Math.max(...newNotifications.map((n: Notification) => n.id));
          
          // Play sound if there are new notifications
          if (latestNotificationId > lastNotificationId.current && lastNotificationId.current > 0) {
            playNotificationSound();
          }
          
          lastNotificationId.current = latestNotificationId;
        }
        
        setNotifications(newNotifications);
        setUnreadCount(newNotifications.filter((n: Notification) => !n.read).length);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };  // Play notification sound
  const playNotificationSound = () => {
    if (playSound.current && audioEnabled) {
      try {
        playSound.current();
      } catch (error) {
        console.log('Could not play notification sound:', error);
      }
    }
  };

  // Enable audio after user interaction
  const enableAudio = () => {
    setAudioEnabled(true);
  };
  // Poll for new notifications every 5 seconds
  useEffect(() => {
    if (!session?.user?.id) return;

    // Initial fetch
    fetchNotifications();

    // Set up polling
    const interval = setInterval(fetchNotifications, 5000);

    return () => clearInterval(interval);
  }, [session?.user?.id]);

  // Mark notification as read
  const markAsRead = async (notificationId: number) => {
    try {
      await fetch('/api/notifications/mark-as-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId })
      });
      
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };
  // Manual refresh function
  const refresh = async () => {
    await fetchNotifications();
  };
  return {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    playNotificationSound,
    refresh,
    enableAudio,
    audioEnabled
  };
}
