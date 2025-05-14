import { deriveTimeFormat, now } from "@/lib/utils/time";
import options from "@/options";
import { bind } from "ags/state";

export const ClockModuleBuilder = Clock;

export default function Clock() {
  const time = deriveTimeFormat(now, options.bar.clock.format);
  const tooltipTime = deriveTimeFormat(now, options.bar.clock.tooltipFormat);

  const cleanup = () => {
    time.destroy();
    tooltipTime.destroy();
  };

  return (
    <label
      class="module module-clock"
      label={bind(time)}
      hasTooltip={bind(options.bar.clock.enableTooltip)}
      tooltipText={bind(tooltipTime)}
      $destroy={cleanup}
    />
  );
}
