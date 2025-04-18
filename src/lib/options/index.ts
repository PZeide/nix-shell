import { Gio, monitorFile } from "astal";
import { ReadonlyDeep } from "type-fest";
import { z } from "zod";
import { debounce } from "../utils";
import { Option, OptionType } from "./option";
import { syncTreeFromFile, syncTreeToFile } from "./sync";
import { OptionTree, subscribeToTree } from "./tree";

export function opt<T extends OptionType>(init: T, schema: z.ZodType<T>) {
  return new Option(init, schema);
}

export async function defineOptions<T extends OptionTree>(
  path: string,
  tree: T,
): Promise<ReadonlyDeep<T>> {
  await syncTreeFromFile(tree, path);

  const debouncedSyncTreeToFile = debounce(syncTreeToFile, 150);
  subscribeToTree(tree, (leaf) => {
    if (leaf.changeSource === "tree-sync") {
      // Ignore changes from tree sync
      return;
    }

    debouncedSyncTreeToFile(tree, path).catch((e) =>
      console.error(`Failed to sync option tree to file: ${e}.`),
    );
  });

  monitorFile(path, (_, event) => {
    if (
      event == Gio.FileMonitorEvent.CREATED ||
      event == Gio.FileMonitorEvent.CHANGED
    ) {
      syncTreeFromFile(tree, path)
        .then(() => console.info("Successfully synced option tree from file."))
        .catch((e) =>
          console.error(`Failed to sync option tree from file: ${e}.`),
        );
    }
  });

  console.info(`Option tree defined with file ${path}.`);
  return tree as ReadonlyDeep<T>;
}
