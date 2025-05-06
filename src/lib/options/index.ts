import Gio from "gi://Gio?version=2.0";
import { monitorFile } from "ags/file";
import type { ReadonlyDeep } from "type-fest";
import type z from "zod";
import { Option, type OptionTree, type OptionType } from "./option";
import { syncTreeFromFile } from "./sync";

export function opt<T extends OptionType>(init: T, schema: z.ZodType<T>) {
  return new Option(init, schema);
}

export async function defineOptions<T extends OptionTree>(
  path: string,
  tree: T
): Promise<ReadonlyDeep<T>> {
  await syncTreeFromFile(tree, path);

  monitorFile(path, (_, event) => {
    if (
      event === Gio.FileMonitorEvent.CREATED ||
      event === Gio.FileMonitorEvent.CHANGED
    ) {
      syncTreeFromFile(tree, path)
        .then(() => console.debug("Successfully synced option tree from file."))
        .catch((e) =>
          console.error(`Failed to sync option tree from file: ${e}.`)
        );
    }
  });

  console.debug(`Option tree defined with file ${path}.`);
  return tree as ReadonlyDeep<T>;
}
