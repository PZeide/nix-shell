import { bind, Variable } from "astal";
import { Gdk, Gtk } from "astal/gtk4";
import Hyprland from "gi://AstalHyprland";
import { sh } from "../../../lib/utils";
import { toHyprlandMonitor } from "../../../lib/utils/hyprland";
import options from "../../../options";

type HyprlandWorkspacesProps = {
  monitor: Gdk.Monitor;
};

type WorkspaceButtonProps = {
  monitor: Hyprland.Monitor;
  workspace: Hyprland.Workspace;
};

const hyprland = Hyprland.get_default();

function WorkspaceButton(props: WorkspaceButtonProps) {
  const cssClasses = Variable.derive(
    [bind(hyprland, "focusedWorkspace"), bind(hyprland, "clients")],
    (focusedWorkspace) => {
      const classes = ["workspace-button"];
      if (focusedWorkspace === props.workspace) {
        classes.push("focused");
      }

      if (props.workspace.clients.length > 0) {
        classes.push("occupied");
      }

      return classes;
    },
  );

  const onClick = () => {
    if (options.bar.hyprlandWorkspaces.shouldFocusWorkspaceOnClick.get()) {
      props.workspace.focus();
    }
  };

  return (
    <box
      cssClasses={bind(cssClasses)}
      valign={Gtk.Align.CENTER}
      onButtonReleased={onClick}
    />
  );
}

export default function HyprlandWorkspaces(props: HyprlandWorkspacesProps) {
  const onClick = () => {
    const action = options.bar.hyprlandWorkspaces.actionOnClick.get();
    if (!action) {
      return;
    }

    sh(action)
      .then((r) => console.info(`Executed hyprland workspaces action: ${r}.`))
      .catch((e) =>
        console.error(`Failed to execute hyprland workspaces action: ${e}.`),
      );
  };

  const onScroll = (self: Gtk.Box, dx: number, dy: number) => {
    if (!options.bar.hyprlandWorkspaces.enableScrollGesture.get()) {
      return;
    }

    if (dy > 0) {
      hyprland.dispatch("workspace", "r-1");
    } else {
      hyprland.dispatch("workspace", "r+1");
    }
  };

  const hyprlandMonitor = toHyprlandMonitor(props.monitor);

  return (
    <box
      cssClasses={["module", "module-hyprland-workspaces"]}
      onButtonReleased={onClick}
      onScroll={onScroll}
    >
      {bind(hyprland, "workspaces").as((workspaces) =>
        workspaces
          .filter((workspace) => workspace.monitor === hyprlandMonitor)
          .filter((workspace) => !workspace.name.startsWith("special"))
          .sort((a, b) => a.id - b.id)
          .map((workspace) => (
            <WorkspaceButton monitor={hyprlandMonitor} workspace={workspace} />
          )),
      )}
    </box>
  );
}
