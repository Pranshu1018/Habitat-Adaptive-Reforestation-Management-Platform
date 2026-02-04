
import React, { useEffect, useState } from 'react';
import { Bell, Check, X, AlertTriangle, AlertOctagon, Info } from 'lucide-react';
import { NotificationEngine, Notification } from '@/services/analytics/notificationEngine';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export const NotificationCenter = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const refresh = () => {
        const list = NotificationEngine.getNotifications();
        setNotifications(list);
        setUnreadCount(list.filter(n => !n.read).length);
    };

    useEffect(() => {
        refresh();

        const handleUpdate = () => refresh();
        window.addEventListener('notification-update', handleUpdate);

        // Poll every 30s just in case
        const interval = setInterval(refresh, 30000);

        return () => {
            window.removeEventListener('notification-update', handleUpdate);
            clearInterval(interval);
        };
    }, []);

    const handleMarkAllRead = () => {
        NotificationEngine.markAllAsRead();
        refresh();
    };

    const handleMarkRead = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        NotificationEngine.markAsRead(id);
        refresh();
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-destructive border-2 border-background animate-pulse" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between p-4 border-b">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={handleMarkAllRead} className="text-xs h-auto px-2 py-1">
                            Mark all read
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full p-8 text-muted-foreground">
                            <Bell className="h-8 w-8 mb-2 opacity-20" />
                            <p className="text-xs">No notifications yet</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={cn(
                                        "p-3 flex items-start gap-3 transition-colors hover:bg-muted/50 cursor-default",
                                        !notif.read && "bg-muted/30"
                                    )}
                                >
                                    <div className={cn(
                                        "mt-1 p-1 rounded-full shrink-0",
                                        notif.type === 'danger' ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400" :
                                            notif.type === 'warning' ? "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" :
                                                "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                                    )}>
                                        {notif.type === 'danger' ? <AlertOctagon className="h-3 w-3" /> :
                                            notif.type === 'warning' ? <AlertTriangle className="h-3 w-3" /> :
                                                <Info className="h-3 w-3" />}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-start justify-between">
                                            <p className={cn("text-xs font-medium leading-none", !notif.read && "font-bold")}>
                                                {notif.title}
                                            </p>
                                            {!notif.read && (
                                                <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 ml-2" />
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {notif.message}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground opacity-70">
                                            {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                                        </p>
                                    </div>
                                    {!notif.read && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 -mr-1 -mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => handleMarkRead(notif.id, e)}
                                        >
                                            <Check className="h-3 w-3" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
};
