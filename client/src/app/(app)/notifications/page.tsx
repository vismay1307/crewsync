import { NotificationList } from "@/features/notifications/components/notification-list";

export default function NotificationsPage() {
  return (
    <main className="cs-page">
      <div className="cs-page-header">
        <h1 className="cs-page-title">Notifications</h1>
        <p className="cs-page-description">Recent updates assigned to your account.</p>
      </div>
      <NotificationList />
    </main>
  );
}
