import GLib from "gi://GLib?version=2.0";
import { z } from "zod";
import { defineOptions, opt } from "./lib/options";

const modulesOptions = [
  "clock",
  "control-center",
  "hyprland-workspaces",
  "launcher",
  "media",
  "notifications-indicator",
  "power",
  "separator",
  "screencapture-indicator",
  "tray",
] as const;

const path = `${GLib.get_user_config_dir()}/zeide-shell/config.json`;
export default await defineOptions(path, {
  theme: {
    bgColor: opt("oklch(0.22 0.0131 222.72 / 80%)", z.string()),
    fgColor: opt("oklch(0.91 0.0155 77.07)", z.string()),
    primaryColor: opt("oklch(0.66 0.0468 20.16)", z.string()),
    font: opt("SF Pro Text", z.string()),
  },
  bar: {
    isEnabled: opt(true, z.boolean()),
    position: opt("top", z.enum(["top", "bottom"])),
    cornerRadius: opt(5, z.number()),
    moduleSpacing: opt(5, z.number()),
    font: opt(null, z.string().nullable()),
    fontSize: opt(13, z.number()),
    leftModules: opt(
      ["launcher", "separator", "hyprland-workspaces"],
      z.array(z.enum(modulesOptions))
    ),
    centerModules: opt(["clock"], z.array(z.enum(modulesOptions))),
    rightModules: opt(["media"], z.array(z.enum(modulesOptions))),
    clock: {
      fontSize: opt(null, z.number().nullable()),
      format: opt("%I:%M", z.string()),
      enableHover: opt(true, z.boolean()),
      hoverFormat: opt("%A, %d %B %Y", z.string()),
    },
    hyprlandWorkspaces: {
      workspaces: {
        spacing: opt(2, z.number()),
        radius: opt(6, z.number()),
        inactive: {
          color: opt(null, z.string().nullable()),
          width: opt(4, z.number()),
          height: opt(4, z.number()),
          radius: opt(null, z.number().nullable()),
        },
        occupied: {
          color: opt(null, z.string().nullable()),
          width: opt(6.5, z.number()),
          height: opt(6.5, z.number()),
          radius: opt(null, z.number().nullable()),
        },
        focused: {
          color: opt(null, z.string().nullable()),
          width: opt(20, z.number()),
          height: opt(9, z.number()),
          radius: opt(null, z.number().nullable()),
        },
      },
      enableScroll: opt(true, z.boolean()),
      actionOnClick: opt(
        "hyprctl dispatch hyprexpo:expo",
        z.string().nullable()
      ),
      focusClickedWorkspace: opt(false, z.boolean()),
    },
    launcher: {
      icon: opt("host-symbolic", z.enum(["generic", "host", "host-symbolic"])),
      launcherAction: opt(null, z.string().nullable()),
    },
    media: {
      icon: opt(
        "player-symbolic",
        z.enum(["generic", "player", "player-symbolic"])
      ),
      playersPriority: opt([], z.array(z.string())),
      labelFormat: opt("%artist% - %title%", z.string()),
      labelMaxLength: opt(50, z.number()),
      onlyPrioritized: opt(false, z.boolean()),
      enableRevealer: opt(true, z.boolean()),
      revealOnHover: opt(true, z.boolean()),
      revealOnTrackChange: opt(true, z.boolean()),
      revealDuration: opt(3000, z.number()),
      revealTransitionDuration: opt(200, z.number()),
      direction: opt("left", z.enum(["left", "right"])),
      playPauseOnClick: opt(true, z.boolean()),
      prevNextOnScroll: opt(true, z.boolean()),
    },
    separator: {
      color: opt(null, z.string().nullable()),
      width: opt(0.5, z.number()),
      horizontalMargin: opt(2, z.number()),
      verticalMargin: opt(2, z.number()),
    },
  },
});
