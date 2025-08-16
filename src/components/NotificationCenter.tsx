import React, { useState } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Bell, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Clock, 
  DollarSign,
  Users,
  FileText,
  X
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface NotificationCenterProps {
  className?: string;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ className }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications();
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [isOpen, setIsOpen] = useState(false);

  const labels = {
    notifications: isAr ? 'الإشعارات' : 'Notifications',
    markAllRead: isAr ? 'تحديد الكل كمقروء' : 'Mark All as Read',
    clearAll: isAr ? 'مسح الكل' : 'Clear All',
    noNotifications: isAr ? 'لا توجد إشعارات' : 'No notifications',
    unread: isAr ? 'غير مقروء' : 'unread',
    today: isAr ? 'اليوم' : 'Today',
    yesterday: isAr ? 'أمس' : 'Yesterday',
    thisWeek: isAr ? 'هذا الأسبوع' : 'This Week',
    older: isAr ? 'أقدم' : 'Older'
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'loan_approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'loan_rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'additional_data_requested':
        return <FileText className="h-5 w-5 text-orange-600" />;
      case 'investment_matched':
        return <DollarSign className="h-5 w-5 text-blue-600" />;
      case 'payment_due':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'loan_approved':
        return 'border-green-200 bg-green-50';
      case 'loan_rejected':
        return 'border-red-200 bg-red-50';
      case 'additional_data_requested':
        return 'border-orange-200 bg-orange-50';
      case 'investment_matched':
        return 'border-blue-200 bg-blue-50';
      case 'payment_due':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return labels.today;
    if (diffDays === 2) return labels.yesterday;
    if (diffDays <= 7) return labels.thisWeek;
    return labels.older;
  };

  const groupedNotifications = notifications.reduce((groups, notification) => {
    const dateGroup = formatDate(notification.createdAt);
    if (!groups[dateGroup]) {
      groups[dateGroup] = [];
    }
    groups[dateGroup].push(notification);
    return groups;
  }, {} as Record<string, typeof notifications>);

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    // Handle navigation or action based on notification type
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        className="relative p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-96 z-50">
          <Card className="shadow-lg border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  {labels.notifications}
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {unreadCount} {labels.unread}
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                  >
                    {labels.markAllRead}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearNotifications}
                    disabled={notifications.length === 0}
                  >
                    {labels.clearAll}
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>{labels.noNotifications}</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {Object.entries(groupedNotifications).map(([dateGroup, groupNotifications]) => (
                    <div key={dateGroup}>
                      <div className="px-4 py-2 bg-muted/50 text-xs font-medium text-muted-foreground">
                        {dateGroup}
                      </div>
                      {groupNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-l-4 cursor-pointer transition-colors hover:bg-muted/30 ${
                            notification.read ? 'opacity-75' : ''
                          } ${getNotificationColor(notification.type)}`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start gap-3">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className={`text-sm font-medium ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                              <p className={`text-sm ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {notification.createdAt.toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationCenter;
