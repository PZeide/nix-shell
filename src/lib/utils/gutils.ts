import { Gio, GLib } from "astal";
import { App, Gdk, Gtk } from "astal/gtk4";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ErrorDomain = { new (...args: any[]): GLib.Error };

export function isGLibError<T extends ErrorDomain>(
  e: unknown,
  domain: ErrorDomain,
  code: number,
): e is T {
  return e instanceof GLib.Error && e.matches(domain, code);
}

export function ensureDirectories(path: string) {
  try {
    Gio.File.new_for_path(path).make_directory_with_parents();
  } catch (e) {
    if (isGLibError(e, Gio.IOErrorEnum, Gio.IOErrorEnum.EXISTS)) {
      return;
    }

    throw e;
  }
}

type MonitorWidgetBuilder = (monitor: Gdk.Monitor) => Gtk.Widget;
export function syncWithMonitors(builders: MonitorWidgetBuilder[]) {
  const display = Gdk.Display.get_default();
  if (!display) {
    throw new Error("Failed to retrieve default Display!");
  }

  const current = new Map<Gdk.Monitor, Gtk.Widget[]>();

  for (const monitor of App.get_monitors()) {
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
        continue;
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
