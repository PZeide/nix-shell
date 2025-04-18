import { Option, OptionType } from "./lib/options/option";
import { styleDep } from "./lib/style";
import options from "./options";

function createFallback<T extends OptionType>(option: Option<T>) {
  return () => option.get();
}

export default [
  /* Theme */
  styleDep(options.theme.bgColor, "bg-color"),
  styleDep(options.theme.fgColor, "fg-color"),
  styleDep(options.theme.primaryColor, "primary-color"),
  /* widgets/bar/modules/HyprlandWorkspaces */
  styleDep(
    options.bar.hyprlandWorkspaces.focusedWorkspaceColor,
    "bar-hyprland-workspaces-focused-color",
    createFallback(options.theme.primaryColor),
  ),
  styleDep(
    options.bar.hyprlandWorkspaces.occupiedWorkspaceColor,
    "bar-hyprland-workspaces-occupied-color",
    createFallback(options.theme.primaryColor),
  ),
];
