import GLib from "gi://GLib?version=2.0";
import { z } from "zod";
import { defineOptions, opt } from "./lib/options";

const modulesOptions = [
  "battery",
  "clock",
  "control-center",
  "hyprland-workspaces",
  "launcher",
  "media",
  "notifications-indicator",
  "power-menu",
  "separator",
  "tray",
] as const;

const path = `${GLib.get_user_config_dir()}/zeide-shell/config.json`;
export default await defineOptions(path, {
  theme: {
    bgColor: opt("oklch(0.22 0.0084 240.27 / 80%)", z.string()),
    fgColor: opt("oklch(0.91 0.0125 301.27)", z.string()),
    primaryColor: opt("oklch(0.67 0.1522 20.55)", z.string()),
    font: opt("SF Pro Text", z.string()),
  },
  bar: {
    isEnabled: opt(true, z.boolean()),
    position: opt("top", z.enum(["top", "bottom"])),
    cornerRadius: opt(5, z.number().positive()),
    moduleSpacing: opt(5, z.number().positive()),
    font: opt(null, z.string().nullable()),
    fontSize: opt(13, z.number().positive()),
    leftModules: opt(
      ["launcher", "separator", "hyprland-workspaces"],
      z.array(z.enum(modulesOptions))
    ),
    centerModules: opt(["clock"], z.array(z.enum(modulesOptions))),
    rightModules: opt(["media", "battery"], z.array(z.enum(modulesOptions))),
    battery: {
      style: opt("bar", z.enum(["simple", "bar"])),
      showPercentageLabel: opt(false, z.boolean()),
      tooltip: opt(
        "percentage",
        z.enum(["percentage", "remaining_time", "none"])
      ),
      barSectionsCount: opt(8, z.number().positive()),
      barSectionSize: opt(6, z.number().positive()),
      barRadius: opt(5, z.number().positive()),
      lowPercentage: opt(20, z.number().min(0).max(100)),
      criticalPercentage: opt(5, z.number().min(0).max(100)),
    },
    clock: {
      fontSize: opt(null, z.number().positive().nullable()),
      format: opt("%I:%M", z.string()),
      enableTooltip: opt(true, z.boolean()),
      tooltipFormat: opt("%A, %d %B %Y", z.string()),
    },
    hyprlandWorkspaces: {
      workspaces: {
        spacing: opt(2, z.number().positive()),
        radius: opt(6, z.number().positive()),
        inactive: {
          color: opt(null, z.string().nullable()),
          width: opt(4, z.number().positive()),
          height: opt(4, z.number().positive()),
          radius: opt(null, z.number().positive().nullable()),
        },
        occupied: {
          color: opt(null, z.string().nullable()),
          width: opt(6.5, z.number().positive()),
          height: opt(6.5, z.number().positive()),
          radius: opt(null, z.number().positive().nullable()),
        },
        focused: {
          color: opt(null, z.string().nullable()),
          width: opt(20, z.number().positive()),
          height: opt(9, z.number().positive()),
          radius: opt(null, z.number().positive().nullable()),
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
      icon: opt("host", z.enum(["generic", "host", "host-symbolic"])),
      launcherAction: opt(null, z.string().nullable()),
    },
    media: {
      icon: opt("player", z.enum(["generic", "player", "player-symbolic"])),
      playersPriority: opt(["cider"], z.array(z.string())),
      onlyPrioritized: opt(true, z.boolean()),
      hideIfStopped: opt(true, z.boolean()),
      labelFormat: opt("%artist% - %title%", z.string()),
      labelMaxLength: opt(50, z.number().positive()),
      enableRevealer: opt(true, z.boolean()),
      revealOnHover: opt(true, z.boolean()),
      revealOnTrackChange: opt(true, z.boolean()),
      revealDuration: opt(3000, z.number().positive()),
      revealTransitionDuration: opt(200, z.number().positive()),
      direction: opt("left", z.enum(["left", "right"])),
      playPauseOnClick: opt(true, z.boolean()),
      prevNextOnScroll: opt(true, z.boolean()),
    },
    separator: {
      color: opt(null, z.string().nullable()),
      width: opt(0.5, z.number().positive()),
      horizontalMargin: opt(2, z.number().positive()),
      verticalMargin: opt(2, z.number().positive()),
    },
    tray: {
      spacing: opt(2, z.number().positive()),
      showTooltip: opt(true, z.boolean()),
      leftClickAction: opt("menu", z.enum(["activate", "menu", "ignore"])),
      rightClickAction: opt("menu", z.enum(["activate", "menu", "ignore"])),
    },
  },
});
