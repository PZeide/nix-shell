import type GLib from "gi://GLib?version=2.0";
import options from "@/options";
import { Astal, type Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { State, bind, derive } from "ags/state";
import OsdController from "./OsdController";

type OnScreenDisplayProps = {
  monitor: Gdk.Monitor;
};

export default function OnScreenDisplay({ monitor }: OnScreenDisplayProps) {
  const visible = new State(false);
  let timeoutSource: GLib.Source | undefined;

  const anchor = bind(options.osd.position).as((position) => {
    switch (position) {
      case "top":
        return Astal.WindowAnchor.TOP;
      case "bottom":
        return Astal.WindowAnchor.BOTTOM;
      case "left":
        return Astal.WindowAnchor.LEFT;
      case "right":
        return Astal.WindowAnchor.RIGHT;
    }
  });

  const cleanup = () => {
    visible.destroy();

    if (timeoutSource !== undefined) {
      clearTimeout(timeoutSource);
    }
  };

  return (
    <window
      name="OnScreenDisplay"
      namespace="zs-osd"
      visible={bind(visible)}
      class="osd"
      gdkmonitor={monitor}
      layer={Astal.Layer.OVERLAY}
      anchor={anchor}
      application={app}
      $destroy={cleanup}
    >
      <OsdController visibleState={visible} />
    </window>
  );
}

export const OnScreenDisplayBuilder = (monitor: Gdk.Monitor) => (
  <OnScreenDisplay monitor={monitor} />
);
