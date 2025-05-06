import GLib from "gi://GLib?version=2.0";
import { Poll, type State, bind, derive } from "ags/state";

export const now = new Poll(GLib.DateTime.new_now_local(), 1000, () =>
  GLib.DateTime.new_now_local()
);

export function deriveTimeFormat(
  time: State<GLib.DateTime>,
  format: State<string>
): State<string> {
  return derive(
    [bind(time), bind(format)],
    (time, format) => time.format(format) ?? "invalid time format"
  );
}
