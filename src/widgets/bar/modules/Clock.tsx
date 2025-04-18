import { bind } from "astal";
import { now } from "../../../lib/utils";
import options from "../../../options";

export default function Clock() {
  return (
    <label cssClasses={["module", "module-clock"]}>
      {bind(now).as((time) => time.format(options.bar.clock.format.get()))}
    </label>
  );
}
