import GLib from "gi://GLib?version=2.0";
import type Gio from "gi://Gio?version=2.0";
import { Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";

// biome-ignore lint/suspicious/noExplicitAny: matches glib implementation of an error domain
type ErrorDomain = { new (...args: any[]): GLib.Error };
export function isGLibError<T extends ErrorDomain>(
  e: unknown,
  domain: ErrorDomain,
  code: number
): e is T {
  return e instanceof GLib.Error && e.matches(domain, code);
}

type MonitorWidgetBuilder = (monitor: Gdk.Monitor) => JSX.Element;
export function syncWithMonitors(builders: MonitorWidgetBuilder[]) {
  const display = Gdk.Display.get_default();
  if (!display) {
    throw new Error("Failed to retrieve default Display!");
  }

  const current = new Map<Gdk.Monitor, JSX.Element[]>();

  for (const monitor of app.get_monitors()) {
    const widgets = builders.map((builder) => builder(monitor));
    current.set(monitor, widgets);
  }

  const updateMonitors = (monitors: Gio.ListModel<Gdk.Monitor>) => {
    const marked = new Map(Array.from(current.keys()).map((m) => [m, false]));

    for (let i = 0; i < monitors.get_n_items(); i++) {
      const monitor = monitors.get_item(i);
      if (!monitor) {
        continue;
      }

      if (marked.has(monitor)) {
        // Monitor has been found so it already exists
        marked.set(monitor, true);
      } else {
        // Monitor is not present, it is a new monitor
        const widgets = builders.map((builder) => builder(monitor));
        current.set(monitor, widgets);
        console.info(`New monitor ${monitor.connector} has been found.`);
      }
    }

    for (const [monitor, found] of marked) {
      if (!found) {
        // Monitor is not present anymore, we can dispose it
        current
          .get(monitor)
          ?.map((widget) => widget instanceof Gtk.Window && widget.destroy());
        current.delete(monitor);
      }
    }
  };

  display.get_monitors().connect("items-changed", updateMonitors);
}

// man OS-RELEASE(5)
export type HostInfo = {
  id: string;
  name: string;
  prettyName: string;
  variant?: string;
  variantId?: string;
  version?: string;
  versionId?: string;
  versionCodename?: string;
  logo?: string;
};

let cachedHostInfo: HostInfo | null;

export function getHostInfo(): HostInfo {
  cachedHostInfo ??= {
    id: GLib.get_os_info("ID") ?? "linux",
    name: GLib.get_os_info("NAME") ?? "Linux",
    prettyName: GLib.get_os_info("PRETTY_NAME") ?? "Linux",
    variant: GLib.get_os_info("VARIANT") ?? undefined,
    variantId: GLib.get_os_info("VARIANT_ID") ?? undefined,
    version: GLib.get_os_info("VERSION") ?? undefined,
    versionId: GLib.get_os_info("VERSION_ID") ?? undefined,
    versionCodename: GLib.get_os_info("VERSION_CODENAME") ?? undefined,
    logo: GLib.get_os_info("LOGO") ?? undefined,
  };

  return cachedHostInfo;
}
