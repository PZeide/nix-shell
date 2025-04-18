import { astalify, Gtk } from "astal/gtk4";

export const DrawingArea = astalify<
  Gtk.DrawingArea,
  Gtk.DrawingArea.ConstructorProps
>(Gtk.DrawingArea);

export const Separator = astalify<
  Gtk.Separator,
  Gtk.Separator.ConstructorProps
>(Gtk.Separator);
