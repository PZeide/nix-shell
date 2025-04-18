import { Gdk } from "astal/gtk4";
import Hyprland from "gi://AstalHyprland";

export function toHyprlandMonitor(gdkMonitor: Gdk.Monitor): Hyprland.Monitor {
  const hyprland = Hyprland.get_default();

  for (const hyprMonitor of hyprland.monitors) {
    if (hyprMonitor.name === gdkMonitor.connector) {
      return hyprMonitor;
    }
  }

  throw new Error(
    `Failed to find matching Hyprland.Monitor for GdkMonitor ${gdkMonitor.description}!`,
  );
}
