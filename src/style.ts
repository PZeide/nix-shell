import options from "options";
import type { Option, OptionType } from "./lib/options/option";
import { styleDep } from "./lib/style";

function fallbackOption<T extends OptionType>(option: Option<T>) {
  return () => option.get();
}

const themeConfig = [
  styleDep(options.theme.bgColor, "bg-color"),
  styleDep(options.theme.fgColor, "fg-color"),
  styleDep(options.theme.primaryColor, "primary-color"),
  styleDep(options.theme.font, "font"),
];

const barConfig = [
  /* General */
  [
    styleDep(options.bar.moduleSpacing, "bar-module-spacing"),
    styleDep(options.bar.font, "bar-font", fallbackOption(options.theme.font)),
    styleDep(options.bar.fontSize, "bar-font-size"),
  ],
  /* Module - Clock */
  [
    styleDep(
      options.bar.clock.fontSize,
      "bar-clock-font-size",
      fallbackOption(options.bar.fontSize)
    ),
  ],
  /* Module - Hyprland Workspaces */
  [
    styleDep(
      options.bar.hyprlandWorkspaces.workspaces.spacing,
      "bar-hyprland-workspaces-workspaces-spacing"
    ),
    styleDep(
      options.bar.hyprlandWorkspaces.workspaces.radius,
      "bar-hyprland-workspaces-workspaces-radius"
    ),
    styleDep(
      options.bar.hyprlandWorkspaces.workspaces.inactive.color,
      "bar-hyprland-workspaces-workspaces-inactive-color",
      fallbackOption(options.theme.fgColor)
    ),
    styleDep(
      options.bar.hyprlandWorkspaces.workspaces.inactive.width,
      "bar-hyprland-workspaces-workspaces-inactive-width"
    ),
    styleDep(
      options.bar.hyprlandWorkspaces.workspaces.inactive.height,
      "bar-hyprland-workspaces-workspaces-inactive-height"
    ),
    styleDep(
      options.bar.hyprlandWorkspaces.workspaces.inactive.radius,
      "bar-hyprland-workspaces-workspaces-inactive-radius",
      fallbackOption(options.bar.hyprlandWorkspaces.workspaces.radius)
    ),
    styleDep(
      options.bar.hyprlandWorkspaces.workspaces.occupied.color,
      "bar-hyprland-workspaces-workspaces-occupied-color",
      fallbackOption(options.theme.primaryColor)
    ),
    styleDep(
      options.bar.hyprlandWorkspaces.workspaces.occupied.width,
      "bar-hyprland-workspaces-workspaces-occupied-width"
    ),
    styleDep(
      options.bar.hyprlandWorkspaces.workspaces.occupied.height,
      "bar-hyprland-workspaces-workspaces-occupied-height"
    ),
    styleDep(
      options.bar.hyprlandWorkspaces.workspaces.occupied.radius,
      "bar-hyprland-workspaces-workspaces-occupied-radius",
      fallbackOption(options.bar.hyprlandWorkspaces.workspaces.radius)
    ),
    styleDep(
      options.bar.hyprlandWorkspaces.workspaces.focused.color,
      "bar-hyprland-workspaces-workspaces-focused-color",
      fallbackOption(options.theme.primaryColor)
    ),
    styleDep(
      options.bar.hyprlandWorkspaces.workspaces.focused.width,
      "bar-hyprland-workspaces-workspaces-focused-width"
    ),
    styleDep(
      options.bar.hyprlandWorkspaces.workspaces.focused.height,
      "bar-hyprland-workspaces-workspaces-focused-height"
    ),
    styleDep(
      options.bar.hyprlandWorkspaces.workspaces.focused.radius,
      "bar-hyprland-workspaces-workspaces-focused-radius",
      fallbackOption(options.bar.hyprlandWorkspaces.workspaces.radius)
    ),
  ],
  /* Module - Separator */
  [
    styleDep(
      options.bar.separator.color,
      "bar-separator-color",
      fallbackOption(options.theme.fgColor)
    ),
    styleDep(options.bar.separator.width, "bar-separator-width"),
    styleDep(
      options.bar.separator.horizontalMargin,
      "bar-separator-horizontal-margin"
    ),
    styleDep(
      options.bar.separator.verticalMargin,
      "bar-separator-vertical-margin"
    ),
  ],
  /* Module - Tray */
  [styleDep(options.bar.tray.spacing, "bar-tray-spacing")],
].flat();

export default [themeConfig, barConfig].flat();
