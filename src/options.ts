import { GLib } from "astal";
import { z } from "zod";
import { defineOptions, opt } from "./lib/options";

const path = `${GLib.get_user_config_dir()}/zeide-shell/config.json`;
export default await defineOptions(path, {
  theme: {
    bgColor: opt("oklch(27.9% 0.041 260.031 / 80%)", z.string()),
  },
  bar: {
    position: opt("top", z.enum(["top", "bottom"])),
    cornerRadius: opt(20, z.number()),
  },
});
