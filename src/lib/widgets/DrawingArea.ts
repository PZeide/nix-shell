import { astalify, ConstructProps, Gtk } from "astal/gtk4";

export type DrawingAreaProps = ConstructProps<
  Gtk.DrawingArea,
  Gtk.DrawingArea.ConstructorProps
>;

export default astalify<Gtk.DrawingArea, Gtk.DrawingArea.ConstructorProps>(
  Gtk.DrawingArea,
);
