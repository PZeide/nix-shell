import { bind } from "astal";
import { App, Astal, Gdk } from "astal/gtk4";
import options from "../../options";

type BarProps = {
  monitor: Gdk.Monitor;
};

export const BarBuilder = (monitor: Gdk.Monitor) => <Bar monitor={monitor} />;

export default function Bar(props: BarProps) {
  return (
    <window
      name="Bar"
      visible
      cssClasses={["bar"]}
      gdkmonitor={props.monitor}
      layer={Astal.Layer.TOP}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={bind(options.bar.position).as(
        (position) =>
          (position === "top"
            ? Astal.WindowAnchor.TOP
            : Astal.WindowAnchor.BOTTOM) |
          Astal.WindowAnchor.RIGHT |
          Astal.WindowAnchor.LEFT,
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
