import { bind, GLib } from "astal";
import options from "../../../options";

const launcherIcon = "applications-all-symbolic";

export default function LauncherButton() {
  return (
    <button cssClasses={["module", "module-launcher-button"]}>
      <image
        iconName={bind(options.bar.modules.launcher.useOsLogo).as(
          (useOsLogo) => {
            if (useOsLogo) {
              return GLib.get_os_info("LOGO") ?? launcherIcon;
            }

            return launcherIcon;
          },
        )}
      />
    </button>
  );
}
