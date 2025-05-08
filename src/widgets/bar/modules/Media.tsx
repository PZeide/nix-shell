import AstalMpris from "gi://AstalMpris?version=0.1";
import type GLib from "gi://GLib?version=2.0";
import Pango from "gi://Pango?version=1.0";
import options from "@/options";
import Icon from "@/widgets/common/Icon";
import { Gdk, Gtk, With } from "ags/gtk4";
import { type Binding, State, bind, derive, hook } from "ags/state";

const mediaGenericIcon = "audio-x-generic-symbolic";

type MediaIconProps = {
  entry: Binding<string>;
};

function MediaIcon({ entry }: MediaIconProps) {
  const icon = derive(
    [bind(options.bar.media.icon), entry],
    (iconOption, entry) => {
      switch (iconOption) {
        case "generic":
          return mediaGenericIcon;

        case "player":
        case "player-symbolic":
          return entry;
      }
    }
  );

  const iconType = bind(options.bar.media.icon).as((iconOption) => {
    switch (iconOption) {
      case "player":
        return "regular";

      case "generic":
      case "player-symbolic":
        return "symbolic";
    }
  });

  const cleanup = () => {
    icon.destroy();
  };

  return (
    <Icon icon={bind(icon)} fallback={mediaGenericIcon} $destroy={cleanup} />
  );
}

type MediaRevealerProps = {
  player: AstalMpris.Player;
  direction: "left" | "right";
};

function MediaRevealer({ player, direction }: MediaRevealerProps) {
  const revealChild = new State(false);

  let isHovering = false;
  let timeoutSource: GLib.Source | undefined;

  const awareRevealChild = derive(
    [bind(revealChild), bind(options.bar.media.enableRevealer)],
    (revealChild, enableRevealer) => !enableRevealer || revealChild
  );

  const onClick = () => {
    if (options.bar.media.playPauseOnClick.get()) {
      player.play_pause();
    }
  };

  const onScroll = (self: Gtk.Box, dx: number, dy: number) => {
    if (!options.bar.media.prevNextOnScroll.get()) {
      return;
    }

    if (dy > 0) {
      player.previous();
    } else {
      player.next();
    }
  };

  const onHoverEnter = () => {
    if (!options.bar.media.revealOnHover.get()) {
      return;
    }

    isHovering = true;
    revealChild.set(true);

    if (timeoutSource !== undefined) {
      // Prevent any auto-close if hovering
      clearTimeout(timeoutSource);
    }
  };

  const onHoverLeave = () => {
    if (!options.bar.media.revealOnHover.get()) {
      return;
    }

    isHovering = false;
    revealChild.set(false);
  };

  const setupContainer = (self: Gtk.Box) => {
    const hoverController = new Gtk.EventControllerMotion();
    hoverController.connect("enter", onHoverEnter);
    hoverController.connect("leave", onHoverLeave);
    self.add_controller(hoverController);

    const scrollController = new Gtk.EventControllerScroll();
    scrollController.flags = Gtk.EventControllerScrollFlags.VERTICAL;
    scrollController.connect("scroll", onScroll);
    self.add_controller(scrollController);

    const gestureClickController = new Gtk.GestureClick();
    gestureClickController.set_button(Gdk.BUTTON_PRIMARY);
    gestureClickController.connect("released", onClick);
    self.add_controller(gestureClickController);
  };

  const setupRevealer = (self: Gtk.Revealer) => {
    // Keep track of ID and title because some players keep a static trackid (firefox)
    let currentTrackId: string | undefined;
    let currentTrackTitle: string | undefined;

    hook(self, player, "notify", (player) => {
      if (!options.bar.media.revealOnTrackChange.get()) {
        return;
      }

      if (
        currentTrackId === player.trackid &&
        currentTrackTitle === player.title
      ) {
        return;
      }

      currentTrackId = player.trackid;
      currentTrackTitle = player.title;

      revealChild.set(true);

      if (timeoutSource !== undefined) {
        // Clear any already active timeout
        clearTimeout(timeoutSource);
      }

      if (!isHovering) {
        // Initiate auto-close only if not hovering
        timeoutSource = setTimeout(() => {
          if (!self.in_destruction()) {
            revealChild.set(false);
          }
        }, options.bar.media.revealDuration.get());
      }
    });
  };

  const formattedLabel = derive(
    [bind(options.bar.media.labelFormat), bind(player, "metadata")],
    (format) => {
      return format
        .replaceAll("%title%", player.title ?? "")
        .replaceAll("%artist%", player.artist ?? "")
        .replaceAll("%album%", player.album ?? "")
        .replaceAll("%albumArtist%", player.albumArtist ?? "")
        .replaceAll("%composer%", player.composer ?? "");
    }
  );

  const shouldShow = derive(
    [bind(options.bar.media.hideIfStopped), bind(player, "playbackStatus")],
    (hideIfStopped, status) => {
      return !hideIfStopped || status !== AstalMpris.PlaybackStatus.STOPPED;
    }
  );

  const cleanup = () => {
    revealChild.destroy();
    awareRevealChild.destroy();
    formattedLabel.destroy();
    shouldShow.destroy();

    if (timeoutSource !== undefined) {
      clearTimeout(timeoutSource);
    }
  };

  return (
    <box
      $={setupContainer}
      class={`media-container dir-${direction}`}
      visible={bind(shouldShow)}
      $destroy={cleanup}
    >
      {direction === "left" ? (
        <>
          <revealer
            revealChild={bind(awareRevealChild)}
            transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
            transitionDuration={bind(
              options.bar.media.revealTransitionDuration
            )}
            $={setupRevealer}
          >
            <label
              label={bind(formattedLabel)}
              maxWidthChars={bind(options.bar.media.labelMaxLength)}
              ellipsize={Pango.EllipsizeMode.END}
            />
          </revealer>
          <MediaIcon entry={bind(player, "entry")} />
        </>
      ) : (
        <>
          <MediaIcon entry={bind(player, "entry")} />
          <revealer
            revealChild={bind(awareRevealChild)}
            transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
            transitionDuration={bind(
              options.bar.media.revealTransitionDuration
            )}
            $={setupRevealer}
          >
            <label
              label={bind(formattedLabel)}
              maxWidthChars={bind(options.bar.media.labelMaxLength)}
              ellipsize={Pango.EllipsizeMode.END}
            />
          </revealer>
        </>
      )}
    </box>
  );
}

export const MediaModuleBuilder = Media;

const mpris = AstalMpris.get_default();

export default function Media() {
  const selectedPlayer = derive(
    [
      bind(mpris, "players"),
      bind(options.bar.media.playersPriority),
      bind(options.bar.media.onlyPrioritized),
    ],
    (players, playersPriority, onlyPrioritized) => {
      for (const prioritizedPlayer of playersPriority) {
        const matching = players.find((candidate) => {
          // Check if busName matches first with prefix
          if (candidate.busName === prioritizedPlayer) {
            return true;
          }

          // Check if busName matches without prefix
          if (
            candidate.busName.replace("org.mpris.MediaPlayer2.", "") ===
            prioritizedPlayer
          ) {
            return true;
          }

          // Check if identity matches
          if (candidate.identity === prioritizedPlayer) {
            return true;
          }

          // Check if desktop entry matches
          if (candidate.entry === prioritizedPlayer) {
            return true;
          }

          return false;
        });

        if (matching !== undefined) {
          return matching;
        }
      }

      // No prioritized players found, if onlyPrioritized, return null
      if (onlyPrioritized) {
        return null;
      }

      // Return the first player, if any
      return players[0] ?? null;
    }
  );

  const revealerDerivation = derive([
    bind(selectedPlayer),
    bind(options.bar.media.direction),
  ]);

  const cleanup = () => {
    selectedPlayer.destroy();
    revealerDerivation.destroy();
  };

  return (
    <box class="module module-media" $destroy={cleanup}>
      <With value={bind(revealerDerivation)}>
        {([player, direction]) =>
          player !== null && (
            <MediaRevealer player={player} direction={direction} />
          )
        }
      </With>
    </box>
  );
}
