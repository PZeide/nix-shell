import {
  type DeriveProps,
  type OmitGtkProps,
  propBind,
} from "@/lib/utils/helpers";
import { type IconType, lookupIcon } from "@/lib/utils/icons";
import type { Gtk } from "ags/gtk4";
import { bind, derive } from "ags/state";

type IconProps = DeriveProps<
  {
    icon: string;
    type?: IconType;
    size?: number;
    fallback?: string;
  },
  Gtk.Image,
  OmitGtkProps<
    Gtk.Image.ConstructorProps,
    | "file"
    | "gicon"
    | "iconName"
    | "iconSize"
    | "paintable"
    | "pixelSize"
    | "resource"
    | "storageType"
    | "useFallback"
  >
>;

export default function Icon({
  icon,
  type,
  size,
  fallback,
  ...props
}: IconProps) {
  const paintable = derive(
    [propBind(icon), propBind(type), propBind(size), propBind(fallback)],
    (icon, type, size, fallback) => {
      return lookupIcon(icon, {
        type,
        size,
        fallback,
      });
    }
  );

  const cleanup = () => {
    paintable.destroy();
  };

  return (
    <image
      paintable={bind(paintable)}
      pixelSize={size}
      {...props}
      $destroy={cleanup}
    />
  );
}
