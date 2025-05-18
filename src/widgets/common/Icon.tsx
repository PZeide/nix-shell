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
    lookupSize?: number;
    fallback?: string;
  },
  Gtk.Image,
  OmitGtkProps<
    Gtk.Image.ConstructorProps,
    | "file"
    | "gicon"
    | "iconName"
    | "paintable"
    | "resource"
    | "storageType"
    | "useFallback"
  >
>;

export default function Icon({
  icon,
  type,
  lookupSize,
  fallback,
  ...props
}: IconProps) {
  const paintable = derive(
    [propBind(icon), propBind(type), propBind(lookupSize), propBind(fallback)],
    (icon, type, lookupSize, fallback) => {
      return lookupIcon(icon, {
        type,
        size: lookupSize,
        fallback,
      });
    }
  );

  const cleanup = () => {
    paintable.destroy();
  };

  return <image paintable={bind(paintable)} $destroy={cleanup} {...props} />;
}
