import { GLib } from "astal";

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
