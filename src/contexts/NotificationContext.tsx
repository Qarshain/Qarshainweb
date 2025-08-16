import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc, writeBatch, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Notification {
  id: string;
  userId: string;
  type: 'loan_approved' | 'loan_rejected' | 'additional_data_requested' | 'investment_matched' | 'payment_due' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  data?: any;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    // Listen to notifications for the current user
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notificationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Notification[];
      
      setNotifications(notificationsData);
    });

    return () => unsubscribe();
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id: string) => {
    // Update notification in Firestore
    const notificationRef = doc(db, 'notifications', id);
    await updateDoc(notificationRef, { read: true });
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    // Mark all unread notifications as read
    const batch = writeBatch(db);
    notifications
      .filter(n => !n.read)
      .forEach(notification => {
        const notificationRef = doc(db, 'notifications', notification.id);
        batch.update(notificationRef, { read: true });
      });
    
    await batch.commit();
  };

  const addNotification = async (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    if (!user) return;
    
    const newNotification = {
      ...notification,
      createdAt: new Date()
    };
    
    await addDoc(collection(db, 'notifications'), newNotification);
  };

  const clearNotifications = async () => {
    if (!user) return;
    
    // Delete all notifications for the current user
    const batch = writeBatch(db);
    notifications.forEach(notification => {
      const notificationRef = doc(db, 'notifications', notification.id);
      batch.delete(notificationRef);
    });
    
    await batch.commit();
  };

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    clearNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
