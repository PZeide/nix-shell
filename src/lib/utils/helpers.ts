import AstalHyprland from "gi://AstalHyprland?version=0.1";
import type AstalIO from "gi://AstalIO?version=0.1";
import type { CCProps, Gdk } from "ags/gtk4";
import { exec, execAsync } from "ags/process";
import { Binding } from "ags/state";
import { timeout } from "ags/time";
import type { SnakeCase } from "type-fest";

export function debounce<T extends unknown[], U>(
  callback: (...args: T) => PromiseLike<U> | U,
  wait: number
) {
  let time: AstalIO.Time;

  return (...args: T): Promise<U> => {
    time?.cancel();
    return new Promise((resolve) => {
      time = timeout(wait, () => resolve(callback(...args)));
    });
  };
}

export async function sh(cmd: string): Promise<string> {
  return await execAsync(["/bin/sh", "-c", cmd]);
}

export function shSync(cmd: string): string {
  return exec(["/bin/sh", "-c", cmd]);
}

export function toHyprlandMonitor(
  gdkMonitor: Gdk.Monitor
): AstalHyprland.Monitor {
  const hyprland = AstalHyprland.get_default();

  for (const hyprMonitor of hyprland.monitors) {
    if (hyprMonitor.name === gdkMonitor.connector) {
      return hyprMonitor;
    }
  }

  throw new Error(
    `Failed to find matching Hyprland.Monitor for GdkMonitor ${gdkMonitor.description}!`
  );
}

export type DeriveProps<T, W, P> = CCProps<W, P> & {
  [K in keyof T]: Binding<NonNullable<T[K]>> | T[K];
};

// biome-ignore lint/suspicious/noExplicitAny: get keys of any
export type OmitGtkProps<P, E extends keyof any> = Omit<P, E | SnakeCase<E>>;

export function proxyBind<T>(value: T): Binding<T> {
  return {
    as: <U>(transform: (v: T) => U): Binding<U> => {
      return proxyBind(transform(value));
    },
    get: (): T => {
      return value;
    },
    subscribe: (): (() => void) => {
      return () => {};
    },
    toString: (): string => {
      return `ProxyBinding<${typeof value}>`;
    },
  } as unknown as Binding<T>;
}

export function propBind<T>(value: T | Binding<T>): Binding<T> {
  return value instanceof Binding ? value : proxyBind(value);
}
