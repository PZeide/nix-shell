import { getHostInfo } from "@/lib/utils/glib";
import { sh } from "@/lib/utils/helpers";
import options from "@/options";
import Icon from "@/widgets/common/Icon";
import { bind } from "ags/state";

const launcherGenericIcon = "applications-all-symbolic";

export const LauncherModuleBuilder = Launcher;

export default function Launcher() {
  const onClick = () => {
    const overrideAction = options.bar.launcher.launcherAction.get();
    if (overrideAction === null) {
      console.info("Open default Launcher");
    } else {
      sh(overrideAction)
        .then((r) => console.info(`Executed launcher action: ${r}.`))
        .catch((e) =>
          console.error(`Failed to execute launcher action: ${e}.`)
        );
    }
  };

  const icon = bind(options.bar.launcher.icon).as((iconOption) => {
    switch (iconOption) {
      case "generic":
        return launcherGenericIcon;

      case "host":
      case "host-symbolic":
        return getHostInfo().logo ?? launcherGenericIcon;
    }
  });

  const iconType = bind(options.bar.launcher.icon).as((iconOption) => {
    switch (iconOption) {
      case "host":
        return "regular";

      case "generic":
      case "host-symbolic":
        return "symbolic";
    }
  });

  return (
    <button class="module module-launcher-button" $clicked={onClick}>
      <Icon icon={icon} type={iconType} />
    </button>
  );
}
