import { monitorFile, readFile } from "ags/file";
import GObject, { register, property, signal } from "ags/gobject";
import { shSync } from "../utils/helpers";

const Percent = (name: string, flags: GObject.ParamFlags) =>
  GObject.ParamSpec.double(name, "", "", flags, 0, 1, 0);

type BrightnessPaths = {
  current: string;
  max: string;
};

type BrightnessValues = {
  current: number;
  max: number;
};

function detectBrightnessPath(): [BrightnessPaths?, BrightnessPaths?] {
  let backlightBrightness: BrightnessPaths | undefined;
  let keyboardBrightness: BrightnessPaths | undefined;

  const bCtlResult = shSync("brightnessctl -ml");

  for (const line of bCtlResult.split("\n")) {
    const elements = line.split(",");
    const device = elements[0];
    const clazz = elements[1];
    const devicePath = `/sys/class/${clazz}/${device}`;

    if (backlightBrightness === undefined && clazz === "backlight") {
      console.debug(`Found backlight brightness at ${devicePath}`);

      backlightBrightness = {
        current: `${devicePath}/brightness`,
        max: `${devicePath}/max_brightness`,
      };
    }

    if (
      keyboardBrightness === undefined &&
      device.includes("::kbd_backlight")
    ) {
      console.debug(`Found keyboard brightness at ${devicePath}`);

      keyboardBrightness = {
        current: `${devicePath}/brightness`,
        max: `${devicePath}/max_brightness`,
      };
    }
  }

  return [backlightBrightness, keyboardBrightness];
}

@register({ GTypeName: "Brightness" })
export default class Brightness extends GObject.Object {
  private readonly _backlightBrightness: BrightnessValues | undefined;
  private readonly _keyboardBrightness: BrightnessValues | undefined;

  @property(Percent)
  get backlight() {
    if (this._backlightBrightness === undefined) {
      return undefined;
    }

    return this._backlightBrightness.current / this._backlightBrightness.max;
  }

  @property(Percent)
  get keyboard() {
    if (this._keyboardBrightness === undefined) {
      return undefined;
    }

    return this._keyboardBrightness.current / this._keyboardBrightness.max;
  }

  constructor() {
    super();

    const [backlightBrightness, keyboardBrightness] = detectBrightnessPath();

    if (backlightBrightness !== undefined) {
      this._backlightBrightness = {
        current: Number(readFile(backlightBrightness.current)),
        max: Number(readFile(backlightBrightness.max)),
      };

      monitorFile(backlightBrightness.current, async () => {
        const current = Number(readFile(backlightBrightness.current));
        // biome-ignore lint/style/noNonNullAssertion: should not be null here
        this._backlightBrightness!.current = current;
        this.notify("backlight");
      });
    }

    if (keyboardBrightness !== undefined) {
      this._keyboardBrightness = {
        current: Number(readFile(keyboardBrightness.current)),
        max: Number(readFile(keyboardBrightness.max)),
      };

      monitorFile(keyboardBrightness.current, async () => {
        const current = Number(readFile(keyboardBrightness.current));
        // biome-ignore lint/style/noNonNullAssertion: should not be null here
        this._keyboardBrightness!.current = current;
        this.notify("keyboard");
      });
    }
  }

  static instance?: Brightness;
  static get_default() {
    if (!Brightness.instance) {
      Brightness.instance = new Brightness();
    }

    return Brightness.instance;
  }
}
