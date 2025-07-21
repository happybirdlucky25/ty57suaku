import { useState, useEffect } from 'react'
import { X, Bell, FileText, User, TrendingUp, Clock, CheckCircle, ExternalLink } from 'lucide-react'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'

interface Notification {
  id: string
  type: 'bill_update' | 'legislator_activity' | 'campaign_update' | 'general_news'
  title: string
  description: string
  timestamp: string
  read: boolean
  priority: 'high' | 'medium' | 'low'
}

interface NotificationSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationSidebar({ isOpen, onClose }: NotificationSidebarProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading notifications
    setTimeout(() => {
      setNotifications([
        {
          id: '1',
          type: 'bill_update',
          title: 'HR-1234 Climate Action Bill',
          description: 'Bill has passed committee and is moving to floor vote',
          timestamp: '2 hours ago',
          read: false,
          priority: 'high'
        },
        {
          id: '2',
          type: 'legislator_activity',
          title: 'Sen. Jane Smith Activity',
          description: 'Introduced new healthcare reform bill S-5678',
          timestamp: '4 hours ago',
          read: false,
          priority: 'medium'
        },
        {
          id: '3',
          type: 'campaign_update',
          title: 'Campaign Milestone Reached',
          description: 'Your Clean Energy Campaign gained 50 new supporters',
          timestamp: '6 hours ago',
          read: true,
          priority: 'medium'
        },
        {
          id: '4',
          type: 'bill_update',
          title: 'S-9876 Infrastructure Bill',
          description: 'Amendment proposed to transportation funding section',
          timestamp: '8 hours ago',
          read: true,
          priority: 'low'
        },
        {
          id: '5',
          type: 'general_news',
          title: 'Congressional Schedule Update',
          description: 'Key votes scheduled for this week including budget resolution',
          timestamp: '1 day ago',
          read: true,
          priority: 'low'
        }
      ])
      setLoading(false)
    }, 500)
  }, [])

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'bill_update':
        return <FileText className="h-4 w-4 text-blue-600" />
      case 'legislator_activity':
        return <User className="h-4 w-4 text-green-600" />
      case 'campaign_update':
        return <TrendingUp className="h-4 w-4 text-purple-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500'
      case 'medium':
        return 'border-l-yellow-500'
      default:
        return 'border-l-gray-300'
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gray-50">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Actions */}
          {unreadCount > 0 && (
            <div className="p-3 border-b">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="w-full justify-start"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark all as read
              </Button>
            </div>
          )}

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Bell className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-center">No notifications yet</p>
                <p className="text-sm text-center mt-1">We'll notify you when something happens</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 ${
                      getPriorityColor(notification.priority)
                    } ${!notification.read ? 'bg-blue-50' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`text-sm font-medium text-gray-900 truncate ${
                            !notification.read ? 'font-semibold' : ''
                          }`}>
                            {notification.title}
                          </h4>
                          <Button variant="ghost" size="sm" className="ml-2 opacity-0 group-hover:opacity-100">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {notification.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {notification.timestamp}
                          </span>
                          {!notification.read && (
                            <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-4">
            <Button variant="ghost" className="w-full" onClick={() => console.log('View all notifications')}>
              View All Notifications
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}