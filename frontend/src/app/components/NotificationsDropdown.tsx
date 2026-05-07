import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Bell, Check, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { format } from "date-fns";

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n: any) => !n.is_read).length);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await api.post(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n.notification_id === id ? { ...n, is_read: true } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post("/notifications/read-all");
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'payment_success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'payment_failed': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'rental_started': return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'rental_expiring': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default: return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-muted transition-colors"
      >
        <Bell className="h-5 w-5 text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white border border-border shadow-lg rounded-xl z-50 overflow-hidden flex flex-col max-h-[500px]">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50/80">
              <h3 className="font-semibold">Thông báo</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <Check className="h-3 w-3" />
                  Đánh dấu đã đọc
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                  <Bell className="h-8 w-8 text-muted/50 mb-2" />
                  <p>Không có thông báo nào</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((n) => (
                    <div 
                      key={n.notification_id} 
                      className={`p-4 hover:bg-muted/30 transition-colors flex gap-3 ${!n.is_read ? 'bg-primary/5' : ''}`}
                      onClick={() => !n.is_read && markAsRead(n.notification_id)}
                    >
                      <div className="mt-1 flex-shrink-0">
                        {getIcon(n.notification_type)}
                      </div>
                      <div>
                        <h4 className={`text-sm ${!n.is_read ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                          {n.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {n.content}
                        </p>
                        <span className="text-[10px] text-muted-foreground/80 mt-2 block">
                          {format(new Date(n.created_at), 'HH:mm dd/MM/yyyy')}
                        </span>
                      </div>
                      {!n.is_read && (
                        <div className="flex-shrink-0 flex items-center">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
