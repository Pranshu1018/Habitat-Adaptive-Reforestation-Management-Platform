
import { RiskAssessment } from './riskPredictor';

export interface Notification {
    id: string;
    type: 'danger' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    regionName?: string;
    riskId?: string;
}

const STORAGE_KEY = 'habitat_notifications';

export class NotificationEngine {
    /*
     * Process risks for a region and generate notifications if needed
     */
    static processRisks(risks: RiskAssessment[], regionName: string): Notification[] {
        const existing = this.getNotifications();
        const newNotifications: Notification[] = [];
        const now = new Date();

        risks.forEach(risk => {
            // Only alert on High or Critical risks
            if (risk.severity !== 'high' && risk.severity !== 'critical') return;

            // Check if we already have an active alert for this risk in the last 24h
            // For simulation risks, we allow duplicates to make the demo more reactive
            const isSimulation = risk.isSimulation || risk.id.startsWith('sim_');
            const duplicate = !isSimulation && existing.find(n =>
                n.riskId === risk.id ||
                (n.title.includes(regionName) && n.message.includes(risk.type) &&
                    (now.getTime() - new Date(n.timestamp).getTime()) < 24 * 60 * 60 * 1000)
            );

            if (!duplicate) {
                const notif: Notification = {
                    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    type: risk.severity === 'critical' ? 'danger' : 'warning',
                    title: risk.severity === 'critical' ? `🚨 CRITICAL ${risk.type.toUpperCase()} RISK` : `⚠️ ${risk.type.toUpperCase()} ALERT`,
                    message: `${regionName}: ${risk.description}`,
                    timestamp: new Date().toISOString(),
                    read: false,
                    regionName,
                    riskId: risk.id
                };
                newNotifications.push(notif);
            }
        });

        if (newNotifications.length > 0) {
            this.saveNotifications([...newNotifications, ...existing]);
        }

        return newNotifications;
    }

    static getNotifications(): Notification[] {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Failed to parse notifications', e);
            return [];
        }
    }

    static getUnreadCount(): number {
        return this.getNotifications().filter(n => !n.read).length;
    }

    static markAsRead(id: string): void {
        const notifications = this.getNotifications().map(n =>
            n.id === id ? { ...n, read: true } : n
        );
        this.saveNotifications(notifications);
    }

    static markAllAsRead(): void {
        const notifications = this.getNotifications().map(n => ({ ...n, read: true }));
        this.saveNotifications(notifications);
    }

    static clearAll(): void {
        localStorage.removeItem(STORAGE_KEY);
    }

    private static saveNotifications(notifications: Notification[]): void {
        // Keep only last 50
        const trimmed = notifications.slice(0, 50);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
        // Dispatch event so UI can react
        window.dispatchEvent(new Event('notification-update'));
    }
}
