import { bind } from "astal";
import { App, Astal, Gdk } from "astal/gtk4";
import options from "../../options";

export default function Bar(monitor: Gdk.Monitor) {
  const { TOP, RIGHT, LEFT, BOTTOM } = Astal.WindowAnchor;

  return (
    <window
      visible
      cssClasses={["bar"]}
      gdkmonitor={monitor}
      layer={Astal.Layer.TOP}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={bind(options.bar.position).as(
        (position) => (position === "top" ? TOP : BOTTOM) | RIGHT | LEFT,
      )}
      application={App}
    >
      <centerbox
        hexpand
        cssClasses={["bar-inner"]}
        startWidget={<box cssClasses={["bar-left-modules"]}>LEFT</box>}
        centerWidget={<box cssClasses={["bar-center-modules"]}>CENTER</box>}
        endWidget={<box cssClasses={["bar-right-modules"]}>RIGHT</box>}
      />
    </window>
  );
}
