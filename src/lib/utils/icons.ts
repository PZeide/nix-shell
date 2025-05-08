import { Gdk, Gtk } from "ags/gtk4";

export type IconType = "regular" | "symbolic";

export type IconLookupOptions = {
  type: IconType;
  fallback: string;
  size: number;
};

export function lookupIcon(
  name: string,
  options: Partial<IconLookupOptions>
): Gtk.IconPaintable {
  const display = Gdk.Display.get_default();
  if (display === null) {
    console.error("Cannot lookup for icon, default display is missing.");
    return new Gtk.IconPaintable({
      iconName: Gtk.Window.get_default_icon_name() ?? "",
    });
  }

  const theme = Gtk.IconTheme.get_for_display(display);

  const fallbacks: string[] = [];

  // If the icon is not fully lower case, add the lowercase name as the first fallback
  if (name.toLocaleLowerCase() !== name) {
    fallbacks.push(name.toLowerCase());
  }

  if (options.fallback !== undefined) {
    fallbacks.push(options.fallback);
  }

  const size = options.size ?? 16;

  const flags =
    options.type !== undefined
      ? options.type === "regular"
        ? Gtk.IconLookupFlags.FORCE_REGULAR
        : Gtk.IconLookupFlags.FORCE_SYMBOLIC
      : null;

  // TODO Maybe don't ignore scale but lookup_icon doesn't event support fractional scaling
  return theme.lookup_icon(name, fallbacks, size, 1, null, flags);
}
