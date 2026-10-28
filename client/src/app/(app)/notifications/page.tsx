import { NotificationList } from "@/features/notifications/components/notification-list";

export default function NotificationsPage() {
  return (
    <div className="cs-page">
      <header className="cs-page-header">
        <h1 className="cs-page-title">Notifications</h1>
        <p className="cs-page-description">
          Updates from your workspaces that involve you.
        </p>
      </header>
      <NotificationList />
    </div>
  );
}