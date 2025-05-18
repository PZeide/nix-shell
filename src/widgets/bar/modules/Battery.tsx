import AstalBattery from "gi://AstalBattery?version=0.1";
import options from "@/options";
import Icon from "@/widgets/common/Icon";
import { Gtk, With } from "ags/gtk4";
import { bind, derive } from "ags/state";

const battery = AstalBattery.get_default();

function BatteryLabel() {
  const percentage = bind(battery, "percentage").as((percentage) => {
    return `${Math.floor(percentage * 100)}%`;
  });

  return (
    <label
      visible={bind(options.bar.battery.showPercentageLabel)}
      label={percentage}
      class="level-label"
    />
  );
}

function BatteryBar() {
  const barValue = derive(
    [bind(options.bar.battery.barSectionsCount), bind(battery, "percentage")],
    (sectionsCount, percentage) => {
      return sectionsCount * percentage;
    }
  );

  const setupOverlay = (self: Gtk.Overlay) => {
    // Should be cleaned automatically by Gtk?
    const icon = (
      <Icon
        icon="camera-flash-symbolic"
        visible={bind(battery, "charging")}
        halign={Gtk.Align.CENTER}
        class="level-bar-charging-icon"
        lookupSize={20}
        pixelSize={20}
      />
    );

    self.add_overlay(icon as Gtk.Image);
  };

  return (
    <Gtk.Overlay valign={Gtk.Align.CENTER} $={setupOverlay}>
      <levelbar
        class="level-bar"
        mode={Gtk.LevelBarMode.DISCRETE}
        valign={Gtk.Align.CENTER}
        minValue={0}
        maxValue={bind(options.bar.battery.barSectionsCount)}
        value={bind(barValue)}
      />
    </Gtk.Overlay>
  );
}

function BatteryIcon() {
  return <Icon icon={bind(battery, "batteryIconName")} />;
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

  const tooltipText = derive(
    [
      bind(options.bar.battery.tooltip),
      bind(battery, "percentage"),
      bind(battery, "charging"),
      bind(battery, "timeToEmpty"),
      bind(battery, "timeToFull"),
    ],
    (tooltip, percentage, charging, timeToEmpty, timeToFull) => {
      if (tooltip === "percentage") {
        return `${Math.floor(percentage * 100)}%`;
      }

      if (tooltip === "remaining_time") {
        if (!charging && timeToEmpty !== 0) {
          return `Time to empty: ${timeRemainingFormat(timeToEmpty)}`;
        }

        if (charging && timeToFull !== 0) {
          return `Time to full: ${timeRemainingFormat(timeToFull)}`;
        }
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
    tooltipText.destroy();
    statusClass.destroy();
  };

  return (
    <box
      class={bind(statusClass).as(
        (status) => `module module-battery ${status}`
      )}
      visible={bind(battery, "isPresent")}
      hasTooltip={bind(options.bar.battery.tooltip).as(
        (tooltip) => tooltip !== "none"
      )}
      tooltipMarkup={bind(tooltipText)}
      $destroy={cleanup}
    >
      <With value={bind(options.bar.battery.style)}>
        {(style) =>
          style === "simple" ? (
            <box>
              <BatteryLabel />
              <BatteryIcon />
            </box>
          ) : (
            <box>
              <BatteryLabel />
              <BatteryBar />
            </box>
          )
        }
      </With>
    </box>
  );
}
