import AstalHyprland from "gi://AstalHyprland?version=0.1";
import { sh } from "@/lib/utils/helpers";
import { toHyprlandMonitor } from "@/lib/utils/helpers";
import options from "@/options";
import { For, Gdk, Gtk } from "ags/gtk4";
import { bind, derive } from "ags/state";

type WorkspaceButtonProps = {
  workspace: AstalHyprland.Workspace;
};

const hyprland = AstalHyprland.get_default();

function WorkspaceButton({ workspace }: WorkspaceButtonProps) {
  const onClick = () => {
    if (options.bar.hyprlandWorkspaces.focusClickedWorkspace.get()) {
      workspace.focus();
    }
  };

  const setup = (self: Gtk.Box) => {
    const gestureClickController = new Gtk.GestureClick();
    gestureClickController.set_button(Gdk.BUTTON_PRIMARY);
    gestureClickController.connect("released", onClick);
    self.add_controller(gestureClickController);
  };

  const workspaceClass = derive(
    [bind(hyprland, "focusedWorkspace"), bind(workspace, "clients")],
    (focusedWorkspace) => {
      if (focusedWorkspace === workspace) {
        return "focused";
      }

      if (workspace.clients.length > 0) {
        return "occupied";
      }

      return "inactive";
    }
  );

  const cleanup = () => {
    workspaceClass.destroy();
  };

  return (
    <box
      class={bind(workspaceClass).as(
        (workspaceClass) => `workspace-button ${workspaceClass}`
      )}
      valign={Gtk.Align.CENTER}
      $={setup}
      $destroy={cleanup}
    />
  );
}

export const HyprlandWorkspacesModuleBuilder = (monitor: Gdk.Monitor) =>
  HyprlandWorkspaces({ monitor });

type HyprlandWorkspacesProps = {
  monitor: Gdk.Monitor;
};

export default function HyprlandWorkspaces({
  monitor,
}: HyprlandWorkspacesProps) {
  const onClick = () => {
    const action = options.bar.hyprlandWorkspaces.actionOnClick.get();
    if (!action) {
      return;
    }

    sh(action)
      .then((r) => console.info(`Executed hyprland workspaces action: ${r}.`))
      .catch((e) =>
        console.error(`Failed to execute hyprland workspaces action: ${e}.`)
      );
  };

  const onScroll = (self: Gtk.Box, dx: number, dy: number) => {
    if (!options.bar.hyprlandWorkspaces.enableScroll.get()) {
      return;
    }

    if (dy > 0) {
      hyprland.dispatch("workspace", "r-1");
    } else {
      hyprland.dispatch("workspace", "r+1");
    }
  };

  const setup = (self: Gtk.Box) => {
    const scrollController = new Gtk.EventControllerScroll();
    scrollController.flags = Gtk.EventControllerScrollFlags.VERTICAL;
    scrollController.connect("scroll", onScroll);
    self.add_controller(scrollController);

    const gestureClickController = new Gtk.GestureClick();
    gestureClickController.set_button(Gdk.BUTTON_PRIMARY);
    gestureClickController.connect("released", onClick);
    self.add_controller(gestureClickController);
  };

  const hyprlandMonitor = toHyprlandMonitor(monitor);
  const workspaces = bind(hyprland, "workspaces").as((workspaces) =>
    workspaces
      .filter((workspace) => workspace.monitor === hyprlandMonitor)
      .filter((workspace) => !workspace.name.startsWith("special"))
      .sort((a, b) => a.id - b.id)
  );

  return (
    <box class="module module-hyprland-workspaces" $={setup}>
      <For each={workspaces}>
        {(workspace) => <WorkspaceButton workspace={workspace} />}
      </For>
    </box>
  );
}
