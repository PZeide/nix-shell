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

function groupBy<T>(arr: T[], fn: (item: T) => any) {
  return arr.reduce<Record<string, T[]>>((prev, curr) => {
    const groupKey = fn(curr);
    const group = prev[groupKey] || [];
    group.push(curr);
    return { ...prev, [groupKey]: group };
  }, {});
}
