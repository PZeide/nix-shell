import { bind } from "astal";
import { App, Astal, Gdk, Gtk } from "astal/gtk4";
import DrawingArea from "../../lib/widgets/DrawingArea";
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

function generateDrawFunc(
  horizontalPosition: "left" | "right",
): Gtk.DrawingAreaDrawFunc {
  const verticalPosition = options.bar.position.get();
  const radius = options.bar.cornerRadius.get();

  return (self, context) => {
    const color = self.get_color();

    if (horizontalPosition == "left") {
      context.arc(radius, radius, radius, Math.PI, (3 * Math.PI) / 2);
      context.lineTo(0, 0);
    } else {
      context.arc(0, radius, radius, (3 * Math.PI) / 2, 2 * Math.PI);
      context.lineTo(radius, 0);
    }

    context.closePath();
    context.setSourceRGBA(color.red, color.green, color.blue, color.alpha);
    context.fill();
  };
}

function setupDrawingArea(
  self: Gtk.DrawingArea,
  horizontalPosition: "left" | "right",
) {
  console.info("setup");
  const radius = options.bar.cornerRadius.get();
  self.set_size_request(radius, radius);
  self.set_draw_func(generateDrawFunc(horizontalPosition));

  options.bar.position.subscribe(() => self.queue_draw());
  options.bar.cornerRadius.subscribe((newRadius) => {
    self.set_size_request(newRadius, newRadius);
    self.queue_draw();
  });
}

export default function BarCorner(props: BarCornerProps) {
  return (
    <window
      name={`BarCorner-${props.position}`}
      visible
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
      <DrawingArea setup={(self) => setupDrawingArea(self, props.position)} />
    </window>
  );
}
