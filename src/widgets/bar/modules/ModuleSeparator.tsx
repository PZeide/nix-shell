import { Gtk } from "astal/gtk4";
import { Separator } from "../../../lib/utils";

export default function ModuleSeparator() {
  return (
    <Separator
      cssClasses={["module", "module-separator"]}
      orientation={Gtk.Orientation.VERTICAL}
    />
  );
}
