import { deriveTimeFormat, now } from "@/lib/utils/time";
import options from "@/options";
import { bind } from "ags/state";

export const ClockModuleBuilder = Clock;

export default function Clock() {
  const time = deriveTimeFormat(now, options.bar.clock.format);
  const hoverTime = deriveTimeFormat(now, options.bar.clock.hoverFormat);

  const cleanup = () => {
    time.destroy();
    hoverTime.destroy();
  };

  return (
    <label
      class="module module-clock"
      label={bind(time)}
      hasTooltip={bind(options.bar.clock.enableHover)}
      tooltipText={bind(hoverTime)}
      $destroy={cleanup}
    />
  );
}
