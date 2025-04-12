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
  const current = new Map<Gdk.Monitor, Gtk.Widget[]>();

  for (const monitor of App.get_monitors()) {
    const widgets = builders.map((builder) => builder(monitor));
    current.set(monitor, widgets);
  }

  App.connect("monitor-added", (_, monitor) => {
    const widgets = builders.map((builder) => builder(monitor));
    current.set(monitor, widgets);
  });

  App.connect("monitor-removed", (_, monitor) => {
    current
      .get(monitor)
      ?.map((widget) => widget instanceof Gtk.Window && widget.destroy());
    current.delete(monitor);
  });
}
