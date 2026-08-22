import { NotificationList } from "@/features/notifications/components/notification-list";

export default function NotificationsPage() {
  return (
    <main className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Notifications</h1>
        <p className="mt-1 text-sm text-muted">Recent updates assigned to your account.</p>
      </div>
      <NotificationList />
    </main>
  );
}
