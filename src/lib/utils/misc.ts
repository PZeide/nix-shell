import { execAsync, GLib, Variable } from "astal";

export const now = Variable(GLib.DateTime.new_now_local()).poll(1000, () =>
  GLib.DateTime.new_now_local(),
);

export async function sh(cmd: string): Promise<string> {
  return await execAsync(["/bin/sh", "-c", cmd]);
}

export function debounce<T extends unknown[], U>(
  callback: (...args: T) => PromiseLike<U> | U,
  wait: number,
) {
  let source: GLib.Source;
  return (...args: T): Promise<U> => {
    clearTimeout(source);
    return new Promise((resolve) => {
      source = setTimeout(() => resolve(callback(...args)), wait);
    });
  };
}
