import options from "@/options";
import { Astal, For, type Gdk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { type State, bind } from "ags/state";
import { BatteryModuleBuilder } from "./modules/Battery";
import { ClockModuleBuilder } from "./modules/Clock";
import { HyprlandWorkspacesModuleBuilder } from "./modules/HyprlandWorkspace";
import { LauncherModuleBuilder } from "./modules/Launcher";
import { MediaModuleBuilder } from "./modules/Media";
import { SeparatorModuleBuilder } from "./modules/Separator";
import { TrayModuleBuilder } from "./modules/Tray";

type BarModulesProps = {
  monitor: Gdk.Monitor;
  modules: State<string[]>;
  type: string;
};

type BarProps = {
  monitor: Gdk.Monitor;
};

type ModuleBuilder = (monitor: Gdk.Monitor) => JSX.Element;
const moduleWidgets: Record<string, ModuleBuilder | undefined> = {
  battery: BatteryModuleBuilder,
  clock: ClockModuleBuilder,
  "control-center": undefined,
  "hyprland-workspaces": HyprlandWorkspacesModuleBuilder,
  launcher: LauncherModuleBuilder,
  media: MediaModuleBuilder,
  "notifications-indicator": undefined,
  "power-menu": undefined,
  separator: SeparatorModuleBuilder,
  tray: TrayModuleBuilder,
};

function BarModules({ monitor, modules, type }: BarModulesProps) {
  const getModuleWidget = (module: string) => {
    return moduleWidgets[module]?.(monitor);
  };

  const modulesWidgets = bind(modules).as((modules) =>
    modules.map(getModuleWidget).filter((module) => module !== undefined)
  );

  return (
    <box _type={type} class="bar-modules-container">
      <For each={modulesWidgets}>{(moduleWidget) => moduleWidget}</For>
    </box>
  );
}

export default function Bar(props: BarProps) {
  const anchor = bind(options.bar.position).as(
    (position) =>
      (position === "top"
        ? Astal.WindowAnchor.TOP
        : Astal.WindowAnchor.BOTTOM) |
      Astal.WindowAnchor.RIGHT |
      Astal.WindowAnchor.LEFT
  );

  return (
    <window
      name="Bar"
      visible={true}
      class="bar"
      gdkmonitor={props.monitor}
      layer={Astal.Layer.TOP}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={anchor}
      application={app}
    >
      <centerbox hexpand class="bar-inner">
        <BarModules
          monitor={props.monitor}
          modules={options.bar.leftModules}
          type="start"
        />
        <BarModules
          monitor={props.monitor}
          modules={options.bar.centerModules}
          type="center"
        />
        <BarModules
          monitor={props.monitor}
          modules={options.bar.rightModules}
          type="end"
        />
      </centerbox>
    </window>
  );
}

export const BarBuilder = (monitor: Gdk.Monitor) => <Bar monitor={monitor} />;
