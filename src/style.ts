import options from "options";
import type { OptionType } from "./lib/options/option";
import { styleDep } from "./lib/style";
import type { StyleDependency } from "./lib/style/builder";

function toPx(value: OptionType): string {
  return `${value}px`;
}

const themeConfig = [
  styleDep(options.theme.bgColor, { name: "bg-color" }),
  styleDep(options.theme.fgColor, { name: "fg-color" }),
  styleDep(options.theme.primaryColor, { name: "primary-color" }),
  styleDep(options.theme.font, { name: "font" }),
  styleDep(options.theme.cornerRadius, {
    name: "corner-radius",
    transform: toPx,
  }),
];

const barConfig = [
  /* General */
  [
    styleDep(options.bar.moduleSpacing, {
      name: "bar-module-spacing",
      transform: toPx,
    }),
    styleDep(options.bar.font, {
      name: "bar-font",
      fallback: () => options.theme.font.get(),
    }),
    styleDep(options.bar.fontSize, {
      name: "bar-font-size",
      transform: toPx,
    }),
  ],
  /* Module - Battery */
  [
    styleDep(options.bar.battery.barSectionsCount, {
      name: "bar-battery-bar-sections-count",
    }),
    styleDep(options.bar.battery.barSectionSize, {
      name: "bar-battery-bar-sections-size",
      transform: toPx,
    }),
    styleDep(options.bar.battery.barRadius, {
      name: "bar-battery-bar-radius",
      transform: toPx,
    }),
  ],
  /* Module - Clock */
  [
    styleDep(options.bar.clock.fontSize, {
      name: "bar-clock-font-size",
      fallback: () => options.bar.fontSize.get(),
      transform: toPx,
    }),
  ],
  /* Module - Hyprland Workspaces */
  [
    styleDep(options.bar.hyprlandWorkspaces.workspaces.spacing, {
      name: "bar-hyprland-workspaces-workspaces-spacing",
      transform: toPx,
    }),
    styleDep(options.bar.hyprlandWorkspaces.workspaces.radius, {
      name: "bar-hyprland-workspaces-workspaces-radius",
      transform: toPx,
    }),
    styleDep(options.bar.hyprlandWorkspaces.workspaces.inactive.color, {
      name: "bar-hyprland-workspaces-workspaces-inactive-color",
      fallback: () => options.theme.fgColor.get(),
    }),
    styleDep(options.bar.hyprlandWorkspaces.workspaces.inactive.width, {
      name: "bar-hyprland-workspaces-workspaces-inactive-width",
      transform: toPx,
    }),
    styleDep(options.bar.hyprlandWorkspaces.workspaces.inactive.height, {
      name: "bar-hyprland-workspaces-workspaces-inactive-height",
      transform: toPx,
    }),
    styleDep(options.bar.hyprlandWorkspaces.workspaces.inactive.radius, {
      name: "bar-hyprland-workspaces-workspaces-inactive-radius",
      fallback: () => options.bar.hyprlandWorkspaces.workspaces.radius.get(),
      transform: toPx,
    }),
    styleDep(options.bar.hyprlandWorkspaces.workspaces.occupied.color, {
      name: "bar-hyprland-workspaces-workspaces-occupied-color",
      fallback: () => options.theme.primaryColor.get(),
    }),
    styleDep(options.bar.hyprlandWorkspaces.workspaces.occupied.width, {
      name: "bar-hyprland-workspaces-workspaces-occupied-width",
      transform: toPx,
    }),
    styleDep(options.bar.hyprlandWorkspaces.workspaces.occupied.height, {
      name: "bar-hyprland-workspaces-workspaces-occupied-height",
      transform: toPx,
    }),
    styleDep(options.bar.hyprlandWorkspaces.workspaces.occupied.radius, {
      name: "bar-hyprland-workspaces-workspaces-occupied-radius",
      fallback: () => options.bar.hyprlandWorkspaces.workspaces.radius.get(),
      transform: toPx,
    }),
    styleDep(options.bar.hyprlandWorkspaces.workspaces.focused.color, {
      name: "bar-hyprland-workspaces-workspaces-focused-color",
      fallback: () => options.theme.primaryColor.get(),
    }),
    styleDep(options.bar.hyprlandWorkspaces.workspaces.focused.width, {
      name: "bar-hyprland-workspaces-workspaces-focused-width",
      transform: toPx,
    }),
    styleDep(options.bar.hyprlandWorkspaces.workspaces.focused.height, {
      name: "bar-hyprland-workspaces-workspaces-focused-height",
      transform: toPx,
    }),
    styleDep(options.bar.hyprlandWorkspaces.workspaces.focused.radius, {
      name: "bar-hyprland-workspaces-workspaces-focused-radius",
      fallback: () => options.bar.hyprlandWorkspaces.workspaces.radius.get(),
      transform: toPx,
    }),
  ],
  /* Module - Separator */
  [
    styleDep(options.bar.separator.color, {
      name: "bar-separator-color",
      fallback: () => options.theme.fgColor.get(),
    }),
    styleDep(options.bar.separator.width, {
      name: "bar-separator-width",
      transform: toPx,
    }),
    styleDep(options.bar.separator.horizontalMargin, {
      name: "bar-separator-horizontal-margin",
      transform: toPx,
    }),
    styleDep(options.bar.separator.verticalMargin, {
      name: "bar-separator-vertical-margin",
      transform: toPx,
    }),
  ],
  /* Module - Tray */
  [
    styleDep(options.bar.tray.spacing, {
      name: "bar-tray-spacing",
      transform: toPx,
    }),
  ],
].flat();

const osdConfig = [
  styleDep(options.osd.position, {
    name: "osd-position",
  }),
  styleDep(options.osd.barColor, {
    name: "osd-bar-color",
    fallback: () => options.theme.primaryColor.get(),
  }),
  styleDep(options.osd.margin, {
    name: "osd-margin",
    transform: toPx,
  }),
  styleDep(options.osd.axisLength, {
    name: "osd-axis-length",
    transform: toPx,
  }),
  styleDep(options.osd.crossAxisLength, {
    name: "osd-cross-axis-length",
    transform: toPx,
  }),
];

export default [
  themeConfig,
  barConfig,
  osdConfig,
].flat() satisfies StyleDependency<OptionType>[];
