import { bind } from "astal";
import { App, Astal, Gdk, Gtk } from "astal/gtk4";
import cairo from "cairo";
import { DrawingArea } from "../../lib/utils";
import options from "../../options";

type BarCornerProps = {
  monitor: Gdk.Monitor;
  position: "left" | "right";
};

export const BarCornerLeftBuilder = (monitor: Gdk.Monitor) => (
  <BarCorner monitor={monitor} position="left" />
);

export const BarCornerRightBuilder = (monitor: Gdk.Monitor) => (
  <BarCorner monitor={monitor} position="right" />
);

export default function BarCorner(props: BarCornerProps) {
  const setup = (self: Gtk.DrawingArea) => {
    console.info("setup");
    const radius = options.bar.cornerRadius.get();
    self.set_size_request(radius, radius);
    self.set_draw_func(drawFunc);

    options.bar.position.subscribe(() => self.queue_draw());
    options.bar.cornerRadius.subscribe((newRadius) => {
      self.set_size_request(newRadius, newRadius);
      self.queue_draw();
    });
  };
  const drawFunc = (self: Gtk.DrawingArea, context: cairo.Context) => {
    const verticalPosition = options.bar.position.get();
    const radius = options.bar.cornerRadius.get();

    if (radius == 0) {
      return;
    }

    if (verticalPosition == "top" && props.position == "left") {
      context.arc(radius, radius, radius, Math.PI, (3 * Math.PI) / 2);
      context.lineTo(0, 0);
    } else if (verticalPosition == "top" && props.position == "right") {
      context.arc(0, radius, radius, (3 * Math.PI) / 2, 2 * Math.PI);
      context.lineTo(radius, 0);
    } else if (verticalPosition == "bottom" && props.position == "left") {
      context.arc(radius, 0, radius, Math.PI / 2, Math.PI);
      context.lineTo(0, radius);
    } else if (verticalPosition == "bottom" && props.position == "right") {
      context.arc(0, 0, radius, 0, Math.PI / 2);
      context.lineTo(radius, radius);
    }

    context.closePath();
    const color = self.get_color();
    context.setSourceRGBA(color.red, color.green, color.blue, color.alpha);
    context.fill();
  };

  return (
    <window
      name={`BarCorner-${props.position}`}
      visible={bind(options.bar.isEnabled)}
      cssClasses={["bar-corner"]}
      gdkmonitor={props.monitor}
      layer={Astal.Layer.TOP}
      exclusivity={Astal.Exclusivity.NORMAL}
      anchor={bind(options.bar.position).as(
        (position) =>
          (position === "top"
            ? Astal.WindowAnchor.TOP
            : Astal.WindowAnchor.BOTTOM) |
          (props.position === "left"
            ? Astal.WindowAnchor.LEFT
            : Astal.WindowAnchor.RIGHT),
      )}
      application={App}
    >
      <DrawingArea setup={setup} />
    </window>
  );
}
