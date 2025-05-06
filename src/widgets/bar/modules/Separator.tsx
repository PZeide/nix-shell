import { Gtk } from "ags/gtk4";

export const SeparatorModuleBuilder = Separator;

export default function Separator() {
  return (
    <Gtk.Separator
      class="module module-separator"
      orientation={Gtk.Orientation.VERTICAL}
    />
  );
}
