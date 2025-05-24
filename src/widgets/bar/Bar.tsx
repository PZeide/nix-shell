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

type BarModulesProps = {
  monitor: Gdk.Monitor;
  modules: State<string[]>;
  type: string;
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

type BarProps = {
  monitor: Gdk.Monitor;
};

export default function Bar({ monitor }: BarProps) {
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
      namespace="zs-bar"
      visible={true}
      class="bar"
      gdkmonitor={monitor}
      layer={Astal.Layer.TOP}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={anchor}
      application={app}
    >
      <centerbox hexpand class="bar-inner">
        <BarModules
          monitor={monitor}
          modules={options.bar.leftModules}
          type="start"
        />
        <BarModules
          monitor={monitor}
          modules={options.bar.centerModules}
          type="center"
        />
        <BarModules
          monitor={monitor}
          modules={options.bar.rightModules}
          type="end"
        />
      </centerbox>
    </window>
  );
}

export const BarBuilder = (monitor: Gdk.Monitor) => <Bar monitor={monitor} />;
