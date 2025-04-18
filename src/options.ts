import { GLib } from "astal";
import { z } from "zod";
import { defineOptions, opt } from "./lib/options";

const path = `${GLib.get_user_config_dir()}/zeide-shell/config.json`;
export default await defineOptions(path, {
  theme: {
    bgColor: opt("oklch(0.22 0.0131 222.72 / 80%)", z.string()),
    fgColor: opt("oklch(0.91 0.0155 77.07)", z.string()),
    primaryColor: opt("oklch(0.66 0.0468 20.16)", z.string()),
    displayFont: opt("SF Pro Text", z.string()),
  },
  bar: {
    isEnabled: opt(true, z.boolean()),
    position: opt("top", z.enum(["top", "bottom"])),
    cornerRadius: opt(5, z.number()),
    moduleSpacing: opt(5, z.number()),
    launcher: {
      useOsLogo: opt(true, z.boolean()),
    },
    clock: {
      format: opt("%I:%M", z.string()),
    },
    hyprlandWorkspaces: {
      focusedWorkspaceColor: opt(null, z.string().nullable()),
      occupiedWorkspaceColor: opt(null, z.string().nullable()),
      enableScrollGesture: opt(true, z.boolean()),
      actionOnClick: opt(
        "hyprctl dispatch hyprexpo:expo",
        z.string().nullable(),
      ),
      shouldFocusWorkspaceOnClick: opt(false, z.boolean()),
    },
  },
});
