import options from "@/options";
import { Astal, type Gdk, type Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { bind } from "ags/state";
import type cairo from "cairo";

type BarCornerProps = {
  monitor: Gdk.Monitor;
  position: "left" | "right";
};

export default function BarCorner({ monitor, position }: BarCornerProps) {
  const drawFunc = (self: Gtk.DrawingArea, context: cairo.Context) => {
    const verticalPosition = options.bar.position.get();
    const radius = options.bar.cornerRadius.get();

    if (radius === 0) {
      return;
    }

    if (verticalPosition === "top" && position === "left") {
      context.arc(radius, radius, radius, Math.PI, (3 * Math.PI) / 2);
      context.lineTo(0, 0);
    } else if (verticalPosition === "top" && position === "right") {
      context.arc(0, radius, radius, (3 * Math.PI) / 2, 2 * Math.PI);
      context.lineTo(radius, 0);
    } else if (verticalPosition === "bottom" && position === "left") {
      context.arc(radius, 0, radius, Math.PI / 2, Math.PI);
      context.lineTo(0, radius);
    } else if (verticalPosition === "bottom" && position === "right") {
      context.arc(0, 0, radius, 0, Math.PI / 2);
      context.lineTo(radius, radius);
    }

    context.closePath();
    const color = self.get_color();
    context.setSourceRGBA(color.red, color.green, color.blue, color.alpha);
    context.fill();
  };

  const setup = (self: Gtk.DrawingArea) => {
    const radius = options.bar.cornerRadius.get();
    self.set_size_request(radius, radius);
    self.set_draw_func(drawFunc);

    options.bar.position.subscribe(() => self.queue_draw());
    options.bar.cornerRadius.subscribe((newRadius) => {
      self.set_size_request(newRadius, newRadius);
      self.queue_draw();
    });
  };

  const anchor = bind(options.bar.position).as(
    (verticalPosition) =>
      (verticalPosition === "top"
        ? Astal.WindowAnchor.TOP
        : Astal.WindowAnchor.BOTTOM) |
      (position === "left" ? Astal.WindowAnchor.LEFT : Astal.WindowAnchor.RIGHT)
  );

  return (
    <window
      name={`BarCorner-${position}`}
      namespace={`zs-bar-${position[0]}corner`}
      visible={bind(options.bar.isEnabled)}
      class="bar-corner"
      gdkmonitor={monitor}
      layer={Astal.Layer.TOP}
      exclusivity={Astal.Exclusivity.NORMAL}
      anchor={anchor}
      application={app}
    >
      <drawingarea $={setup} />
    </window>
  );
}

export const BarCornerLeftBuilder = (monitor: Gdk.Monitor) => (
  <BarCorner monitor={monitor} position="left" />
);

export const BarCornerRightBuilder = (monitor: Gdk.Monitor) => (
  <BarCorner monitor={monitor} position="right" />
);
