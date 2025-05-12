import AstalBattery from "gi://AstalBattery?version=0.1";
import options from "@/options";
import { Gtk } from "ags/gtk4";
import { bind, derive } from "ags/state";

const battery = AstalBattery.get_default();

function BatteryLevel() {
  const percentage = bind(battery, "percentage").as((percentage) => {
    return `${Math.floor(percentage * 100)}%`;
  });

  return <label label={percentage} css="margin-right: 3pt;" />;
}

function BatteryBar() {
  const barValue = derive(
    [bind(options.bar.battery.barSectionsCount), bind(battery, "percentage")],
    (sectionsCount, percentage) => {
      return sectionsCount * percentage;
    }
  );

  return (
    <levelbar
      class="level-bar"
      mode={Gtk.LevelBarMode.DISCRETE}
      valign={Gtk.Align.CENTER}
      minValue={0}
      maxValue={bind(options.bar.battery.barSectionsCount)}
      value={bind(barValue)}
    />
  );
}

export const BatteryModuleBuilder = Battery;

export default function Battery() {
  const timeRemainingFormat = (totalSeconds: number) => {
    const totalMinutes = Math.floor(totalSeconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const parts = [];

    if (hours > 0) {
      parts.push(hours === 1 ? "1 hour" : `${hours} hours`);
    }

    if (minutes > 0) {
      parts.push(minutes === 1 ? "1 minute" : `${minutes} minutes`);
    }

    // Show at minimum 1 minute
    return parts.join(" and ") || "1 minute";
  };

  const remainingTime = derive(
    [
      bind(battery, "charging"),
      bind(battery, "timeToEmpty"),
      bind(battery, "timeToFull"),
    ],
    (charging, timeToEmpty, timeToFull) => {
      if (!charging && timeToEmpty !== 0) {
        return `Time to empty: ${timeRemainingFormat(timeToEmpty)}`;
      }

      if (charging && timeToFull !== 0) {
        return `Time to full: ${timeRemainingFormat(timeToFull)}`;
      }

      return "";
    }
  );

  const statusClass = derive(
    [
      bind(options.bar.battery.lowPercentage),
      bind(options.bar.battery.criticalPercentage),
      bind(battery, "percentage"),
    ],
    (lowPercentage, criticalPercentage, percentage) => {
      if (percentage * 100 <= criticalPercentage) {
        return "status-critical";
      }

      if (percentage * 100 <= lowPercentage) {
        return "status-low";
      }

      return "status-normal";
    }
  );

  const cleanup = () => {
    remainingTime.destroy();
    statusClass.destroy();
  };

  return (
    <box
      class={bind(statusClass).as(
        (status) => `module module-battery ${status}`
      )}
      visible={bind(battery, "isPresent")}
      hasTooltip={bind(options.bar.battery.showRemainingTimeOnHover)}
      tooltipMarkup={bind(remainingTime)}
      $destroy={cleanup}
    >
      <BatteryLevel />
      <BatteryBar />
    </box>
  );
}
