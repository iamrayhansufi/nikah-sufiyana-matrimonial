"use client"

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';

interface Notification {
  id: number;
  type: string;
  message: string;
  link?: string;
  metadata?: Record<string, any>;
  read: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string | number) => Promise<void>;
  refresh: () => Promise<void>;
  enableAudio: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const lastNotificationId = useRef(0);
  const playSound = useRef<() => void>();

  // Initialize audio
  useEffect(() => {
    const initializeAudio = () => {
      try {
        const audio = new Audio('/sounds/notification.mp3');
        playSound.current = () => audio.play().catch(e => console.log('Audio play failed:', e));
      } catch (error) {
        console.log('Audio initialization failed:', error);
      }
    };

    initializeAudio();
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch('/api/notifications', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        
        const newNotifications = Array.isArray(responseData?.notifications) 
          ? responseData.notifications 
          : Array.isArray(responseData) 
            ? responseData 
            : [];

        // Check for new notifications
        if (newNotifications.length > 0) {
          const latestNotificationId = Math.max(...newNotifications.map((n: Notification) => n.id));
          
          if (latestNotificationId > lastNotificationId.current && lastNotificationId.current > 0) {
            if (playSound.current && audioEnabled) {
              playSound.current();
            }
          }
          
          lastNotificationId.current = latestNotificationId;
        }

        setNotifications(newNotifications);
        setUnreadCount(newNotifications.filter((n: Notification) => !n.read).length);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  // Poll for notifications
  useEffect(() => {
    if (!session?.user?.id) return;

    let isMounted = true;
    
    // Initial fetch
    fetchNotifications();

    // Set up polling with visibility check
    const interval = setInterval(() => {
      if (isMounted && document.visibilityState === 'visible') {
        fetchNotifications();
      }
    }, 30000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isMounted) {
        fetchNotifications();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMounted = false;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [session?.user?.id, audioEnabled]);

  // Mark notification as read
  const markAsRead = async (notificationId: string | number) => {
    try {
      const response = await fetch('/api/notifications/mark-as-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId })
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
      
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  };

  // Enable audio
  const enableAudio = () => {
    setAudioEnabled(true);
  };

  // Auto-enable audio after user interaction
  useEffect(() => {
    const timer = setTimeout(() => {
      setAudioEnabled(true);
    }, 2000);
    
    const enableOnInteraction = () => {
      setAudioEnabled(true);
      document.removeEventListener('click', enableOnInteraction);
      document.removeEventListener('touchstart', enableOnInteraction);
    };
    
    document.addEventListener('click', enableOnInteraction);
    document.addEventListener('touchstart', enableOnInteraction);
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', enableOnInteraction);
      document.removeEventListener('touchstart', enableOnInteraction);
    };
  }, []);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    markAsRead,
    refresh: fetchNotifications,
    enableAudio,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
