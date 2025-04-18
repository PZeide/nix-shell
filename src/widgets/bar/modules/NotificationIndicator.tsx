import { bind, Variable } from "astal";
import AstalNotifd from "gi://AstalNotifd";

const notifd = AstalNotifd.get_default();

const notificationsIcon = "notification-inactive-symbolic";
const notificationsNewIcon = "notification-new-symbolic";
const notificationsDndIcon = "notification-disabled-symbolic";

export default function NotificationIndicator() {
  const icon = Variable.derive(
    [bind(notifd, "dontDisturb"), bind(notifd, "notifications")],
    (dontDisturb, notifications) => {
      if (dontDisturb) {
        return notificationsDndIcon;
      }

      return notifications.length > 0
        ? notificationsNewIcon
        : notificationsIcon;
    },
  );

  return (
    <button cssClasses={["module", "module-notification-indicator"]}>
      <image iconName={bind(icon)} />
    </button>
  );
}
