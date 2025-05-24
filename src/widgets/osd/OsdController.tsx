import type AstalIO from "gi://AstalIO?version=0.1";
import AstalWp from "gi://AstalWp?version=0.1";
import Brightness from "@/lib/services/brightness";
import options from "@/options";
import type { Gtk } from "ags/gtk4";
import { State, bind, hook } from "ags/state";
import { timeout } from "ags/time";
import OsdBox from "./OsdBox";

const backlightBrightnessIcon = (value: number) => {
  if (value > 0.5) {
    return "mynaui-brightness-high-symbolic";
  }

  return "mynaui-brightness-low-symbolic";
};

const keyboardBrightnessIcon = (value: number) => {
  if (value > 0.5) {
    return "mynaui-keyboard-brightness-high-symbolic";
  }

  return "mynaui-keyboard-brightness-low-symbolic";
};

const speakerVolumeIcon = (speaker: AstalWp.Endpoint) => {
  if (speaker.mute) {
    return "mynaui-volume-x-symbolic";
  }

  if (speaker.volume > 0.66) {
    return "mynaui-volume-high-symbolic";
  }

  if (speaker.volume > 0.33) {
    return "mynaui-volume-medium-symbolic";
  }

  return "mynaui-volume-low-symbolic";
};

const microphoneVolumeIcon = (microphone: AstalWp.Endpoint) => {
  if (microphone.mute) {
    return "mynaui-microphone-slash-symbolic";
  }

  return "mynaui-microphone-symbolic";
};

const brightness = Brightness.get_default();
const wirePlumber = AstalWp.get_default();

type OsdConfig = {
  mode: string;
  icon: string;
  value: number;
};

type OsdControllerProps = {
  visibleState: State<boolean>;
};

export default function ({ visibleState }: OsdControllerProps) {
  const currentConfig = new State<OsdConfig | null>(null);
  let time: AstalIO.Time | undefined;

  const tryOsd = (config: OsdConfig) => {
    if (!options.osd.modes.get().includes(config.mode)) {
      return;
    }

    time?.cancel();

    currentConfig.set(config);
    visibleState.set(true);

    time = timeout(options.osd.displayDuration.get(), () => {
      visibleState.set(false);
      currentConfig.set(null);
    });
  };

  const setup = (self: Gtk.Box) => {
    hook(self, brightness, "notify::backlight", () => {
      const value = brightness.backlight;
      if (value !== undefined) {
        tryOsd({
          mode: "backlight-brightness",
          icon: backlightBrightnessIcon(value),
          value,
        });
      }
    });

    hook(self, brightness, "notify::keyboard", () => {
      const value = brightness.keyboard;
      if (value !== undefined) {
        tryOsd({
          mode: "keyboard-brightness",
          icon: keyboardBrightnessIcon(value),
          value,
        });
      }
    });

    if (wirePlumber !== null) {
      const speaker = wirePlumber.defaultSpeaker;

      hook(self, speaker, "notify::volume", () => {
        tryOsd({
          mode: "speaker-volume",
          icon: speakerVolumeIcon(speaker),
          value: speaker.volume,
        });
      });

      hook(self, speaker, "notify::mute", () => {
        tryOsd({
          mode: "speaker-volume",
          icon: speakerVolumeIcon(speaker),
          value: speaker.volume,
        });
      });

      const microphone = wirePlumber.defaultMicrophone;

      hook(self, microphone, "notify::volume", () => {
        tryOsd({
          mode: "microphone-volume",
          icon: microphoneVolumeIcon(microphone),
          value: microphone.volume,
        });
      });

      hook(self, wirePlumber.defaultMicrophone, "notify::mute", () => {
        tryOsd({
          mode: "microphone-volume",
          icon: microphoneVolumeIcon(microphone),
          value: microphone.volume,
        });
      });
    }
  };

  const cleanup = () => {
    currentConfig.destroy();
    time?.cancel();
  };

  return (
    <OsdBox
      $={setup}
      icon={bind(currentConfig).as((c) => c?.icon ?? "")}
      value={bind(currentConfig).as((c) => c?.value ?? 0)}
      $destroy={cleanup}
    />
  );
}
