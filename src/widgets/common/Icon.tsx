import {
  type DeriveProps,
  type OmitGtkProps,
  propBind,
} from "@/lib/utils/helpers";
import type { Gtk } from "ags/gtk4";
import { bind, derive } from "ags/state";

type IconType = "regular" | "symbolic";

type IconProps = DeriveProps<
  {
    icon: string;
    type?: IconType;
    size?: number;
  },
  Gtk.Image,
  OmitGtkProps<
    Gtk.Image.ConstructorProps,
    "iconName" | "iconSize" | "pixelSize"
  >
>;

export default function Icon({ icon, type, size, ...props }: IconProps) {
  const iconName = derive([propBind(icon), propBind(type)], (icon, type) => {
    if (type === "regular" && icon.endsWith("-symbolic")) {
      return icon.substring(0, icon.length - 9);
    }

    if (type === "symbolic" && !icon.endsWith("-symbolic")) {
      return `${icon}-symbolic`;
    }

    return icon;
  });

  return (
    <image
      iconName={bind(iconName)}
      pixelSize={size && propBind(size)}
      {...props}
    />
  );
}
