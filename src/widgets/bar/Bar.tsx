import { bind } from "astal";
import { App, Astal, Gdk } from "astal/gtk4";
import options from "../../options";
import HyprlandWorkspaces from "./modules/HyprlandWorkspace";
import LauncherButton from "./modules/LauncherButton";
import ModuleSeparator from "./modules/ModuleSeparator";

type BarProps = {
  monitor: Gdk.Monitor;
};

export const BarBuilder = (monitor: Gdk.Monitor) => <Bar monitor={monitor} />;

export default function Bar(props: BarProps) {
  return (
    <window
      name="Bar"
      visible={bind(options.bar.isEnabled)}
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
        startWidget={
          <box
            cssClasses={["bar-module-container", "bar-left-modules"]}
            spacing={bind(options.bar.moduleSpacing)}
          >
            <LauncherButton />
            <ModuleSeparator />
            <HyprlandWorkspaces monitor={props.monitor} />
          </box>
        }
        centerWidget={
          <box
            cssClasses={["bar-module-container", "bar-center-modules"]}
            spacing={bind(options.bar.moduleSpacing)}
          >
            CENTER
          </box>
        }
        endWidget={
          <box
            cssClasses={["bar-module-container", "bar-right-modules"]}
            spacing={bind(options.bar.moduleSpacing)}
          >
            RIGHT
          </box>
        }
      />
    </window>
  );
}
