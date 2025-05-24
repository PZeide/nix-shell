import { type DeriveProps, propBind } from "@/lib/utils/helpers";
import options from "@/options";
import Icon from "@/widgets/common/Icon";
import { Gtk } from "ags/gtk4";
import { bind, derive } from "ags/state";

type OsdBoxProps = DeriveProps<
  {
    icon: string;
    value: number;
  },
  Gtk.Box,
  Gtk.Box.ConstructorProps
>;

export default function ({ icon, value }: OsdBoxProps) {
  const direction = bind(options.osd.position).as((position) =>
    position === "top" || position === "bottom" ? "horizontal" : "vertical"
  );

  const valueCss = derive(
    [
      propBind(value),
      direction,
      bind(options.osd.axisLength),
      bind(options.osd.crossAxisLength),
    ],
    (value, direction, axisLength, crossAxisLength) => {
      const length = axisLength * value + crossAxisLength;
      const axis = direction === "horizontal" ? "width" : "height";
      return `min-${axis}: ${length}px;`;
    }
  );

  const iconSize = bind(options.osd.crossAxisLength).as(
    (length) => length * 0.5
  );

  const cleanup = () => {
    valueCss.destroy();
  };

  return (
    <box class="osd-box" $destroy={cleanup}>
      <box
        class="osd-value-bar"
        css={bind(valueCss)}
        halign={direction.as((direction) =>
          direction === "horizontal" ? Gtk.Align.START : Gtk.Align.CENTER
        )}
        valign={direction.as((direction) =>
          direction === "vertical" ? Gtk.Align.END : Gtk.Align.CENTER
        )}
      >
        <box
          class="osd-icon-container"
          halign={Gtk.Align.END}
          valign={Gtk.Align.START}
        >
          <Icon
            icon={icon}
            type="symbolic"
            lookupSize={iconSize}
            pixelSize={iconSize}
            halign={Gtk.Align.CENTER}
            valign={Gtk.Align.CENTER}
            hexpand
            vexpand
          />
        </box>
      </box>
    </box>
  );
}
