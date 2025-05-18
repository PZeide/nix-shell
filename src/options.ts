import GLib from "gi://GLib?version=2.0";
import { z } from "zod/v4-mini";
import { defineOptions, opt } from "./lib/options";

const moduleOptions = [
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
    cornerRadius: opt(6, z.number()),
  },
  bar: {
    isEnabled: opt(true, z.boolean()),
    position: opt("top", z.enum(["top", "bottom"])),
    cornerRadius: opt(12, z.number().check(z.positive())),
    moduleSpacing: opt(6, z.number().check(z.positive())),
    font: opt(null, z.nullable(z.string())),
    fontSize: opt(16, z.number().check(z.positive())),
    leftModules: opt(
      ["launcher", "separator", "hyprland-workspaces"],
      z.array(z.enum(moduleOptions))
    ),
    centerModules: opt(["clock"], z.array(z.enum(moduleOptions))),
    rightModules: opt(["media", "battery"], z.array(z.enum(moduleOptions))),
    battery: {
      style: opt("bar", z.enum(["simple", "bar"])),
      showPercentageLabel: opt(false, z.boolean()),
      tooltip: opt(
        "percentage",
        z.enum(["percentage", "remaining_time", "none"])
      ),
      barSectionsCount: opt(8, z.number().check(z.positive())),
      barSectionSize: opt(8, z.number().check(z.positive())),
      barRadius: opt(5, z.number().check(z.positive())),
      lowPercentage: opt(20, z.number().check(z.minimum(0), z.maximum(100))),
      criticalPercentage: opt(
        5,
        z.number().check(z.minimum(0), z.maximum(100))
      ),
    },
    clock: {
      fontSize: opt(18, z.nullable(z.number().check(z.positive()))),
      format: opt("%I:%M", z.string()),
      enableTooltip: opt(true, z.boolean()),
      tooltipFormat: opt("%A, %d %B %Y", z.string()),
    },
    hyprlandWorkspaces: {
      workspaces: {
        spacing: opt(2, z.number().check(z.positive())),
        radius: opt(8, z.number().check(z.positive())),
        inactive: {
          color: opt(null, z.nullable(z.string())),
          width: opt(6, z.number().check(z.positive())),
          height: opt(6, z.number().check(z.positive())),
          radius: opt(null, z.nullable(z.number().check(z.positive()))),
        },
        occupied: {
          color: opt(null, z.nullable(z.string())),
          width: opt(8, z.number().check(z.positive())),
          height: opt(8, z.number().check(z.positive())),
          radius: opt(null, z.nullable(z.number().check(z.positive()))),
        },
        focused: {
          color: opt(null, z.nullable(z.string())),
          width: opt(22, z.number().check(z.positive())),
          height: opt(12, z.number().check(z.positive())),
          radius: opt(null, z.nullable(z.number().check(z.positive()))),
        },
      },
      enableScroll: opt(true, z.boolean()),
      actionOnClick: opt(
        "hyprctl dispatch hyprexpo:expo",
        z.nullable(z.string())
      ),
      focusClickedWorkspace: opt(false, z.boolean()),
    },
    launcher: {
      icon: opt("host", z.enum(["generic", "host", "host-symbolic"])),
      launcherAction: opt(null, z.nullable(z.string())),
    },
    media: {
      icon: opt("player", z.enum(["generic", "player", "player-symbolic"])),
      playersPriority: opt(["cider"], z.array(z.string())),
      onlyPrioritized: opt(true, z.boolean()),
      hideIfStopped: opt(true, z.boolean()),
      labelFormat: opt("%artist% - %title%", z.string()),
      labelMaxLength: opt(50, z.number().check(z.positive())),
      enableRevealer: opt(true, z.boolean()),
      revealOnHover: opt(true, z.boolean()),
      revealOnTrackChange: opt(true, z.boolean()),
      revealDuration: opt(3000, z.number().check(z.positive())),
      revealTransitionDuration: opt(200, z.number().check(z.positive())),
      direction: opt("left", z.enum(["left", "right"])),
      playPauseOnClick: opt(true, z.boolean()),
      prevNextOnScroll: opt(true, z.boolean()),
    },
    separator: {
      color: opt(null, z.nullable(z.string())),
      width: opt(0.5, z.number().check(z.positive())),
      horizontalMargin: opt(2, z.number().check(z.positive())),
      verticalMargin: opt(3, z.number().check(z.positive())),
    },
    tray: {
      spacing: opt(3, z.number().check(z.positive())),
      showTooltip: opt(true, z.boolean()),
      leftClickAction: opt("menu", z.enum(["activate", "menu", "ignore"])),
      rightClickAction: opt("menu", z.enum(["activate", "menu", "ignore"])),
    },
  },
  osd: {
    position: opt("bottom", z.enum(["top", "bottom", "left", "right"])),
    modes: opt(
      [
        "backlight-brightness",
        "keyboard-brightness",
        "speaker-volume",
        "microphone-volume",
      ],
      z.array(
        z.enum([
          "backlight-brightness",
          "keyboard-brightness",
          "speaker-volume",
          "microphone-volume",
        ])
      )
    ),
    barColor: opt(null, z.nullable(z.string())),
    displayDuration: opt(3000, z.number().check(z.positive())),
    margin: opt(30, z.number().check(z.positive())),
    axisLength: opt(250, z.number().check(z.positive())),
    crossAxisLength: opt(40, z.number().check(z.positive())),
  },
});
