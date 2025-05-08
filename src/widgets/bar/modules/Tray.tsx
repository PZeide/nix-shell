import AstalTray from "gi://AstalTray?version=0.1";
import options from "@/options";
import { For, Gdk, Gtk } from "ags/gtk4";
import { bind, hook } from "ags/state";

const tray = AstalTray.get_default();

type TrayItemProps = {
  item: AstalTray.TrayItem;
};

function TrayItem({ item }: TrayItemProps) {
  let menu: Gtk.PopoverMenu | null = null;

  const updateMenu = (self: Gtk.Box) => {
    if (menu !== null) {
      menu.unparent();
      menu.run_dispose();
    }

    menu = new Gtk.PopoverMenu({
      menuModel: item.menuModel,
    });

    menu.set_parent(self);
    menu.insert_action_group("dbusmenu", item.actionGroup);
  };

  const onLeftClick = () => {
    const action = options.bar.tray.leftClickAction.get();
    if (action === "activate") {
      item.activate(0, 0);
    } else if (action === "menu") {
      menu?.popup();
    }
  };

  const onRightClick = () => {
    const action = options.bar.tray.rightClickAction.get();
    if (action === "activate") {
      item.secondary_activate(0, 0);
    } else if (action === "menu") {
      menu?.popup();
    }
  };

  const setup = (self: Gtk.Box) => {
    // Update menu whenever menuModel or actionGroup get changed
    hook(self, item, "notify::menu-model", () => updateMenu(self));
    hook(self, item, "notify::action-group", () => updateMenu(self));

    updateMenu(self);

    const leftGestureClickController = new Gtk.GestureClick();
    leftGestureClickController.set_button(Gdk.BUTTON_PRIMARY);
    leftGestureClickController.connect("released", onLeftClick);
    self.add_controller(leftGestureClickController);

    const rightGestureClickController = new Gtk.GestureClick();
    rightGestureClickController.set_button(Gdk.BUTTON_SECONDARY);
    rightGestureClickController.connect("released", onRightClick);
    self.add_controller(rightGestureClickController);
  };

  const cleanup = () => {
    if (menu !== null) {
      menu.unparent();
      menu.run_dispose();
    }
  };

  return (
    <box
      class="tray-item"
      hasTooltip={bind(options.bar.tray.showTooltip)}
      tooltipMarkup={bind(item, "tooltipMarkup")}
      $={setup}
      $destroy={cleanup}
    >
      <image gicon={bind(item, "gicon")} />
    </box>
  );
}

export const TrayModuleBuilder = Tray;

export default function Tray() {
  return (
    <box class="module module-tray">
      <For each={bind(tray, "items")}>{(item) => <TrayItem item={item} />}</For>
    </box>
  );
}
