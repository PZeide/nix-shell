import { GLib } from "astal";
import { z } from "zod";
import { CssColorRefinement, defineOptions, opt } from "./lib/options";

const path = `${GLib.get_user_config_dir()}/zeide-shell/config.json`;
export default await defineOptions(path, {
  theme: {
    primary: opt("#005b96", z.string().superRefine(CssColorRefinement)),
  },
  bar: {
    position: opt("top", z.enum(["top", "bottom"])),
  },
});
