import { Gio, monitorFile } from "astal";
import { ReadonlyDeep } from "type-fest";
import { z } from "zod";
import { debounce } from "../utils";
import { Option, OptionType } from "./option";
import { syncTreeFromFile, syncTreeToFile } from "./sync";
import { OptionTree, subscribeToTree } from "./tree";

export * from "./refinements";

export function opt<T extends OptionType>(init: T, schema: z.ZodType<T>) {
  return new Option(init, schema);
}

export async function defineOptions<T extends OptionTree>(
  path: string,
  tree: T,
): Promise<ReadonlyDeep<T>> {
  await syncTreeFromFile(tree, path);

  const debouncedSyncTreeToFile = debounce(syncTreeToFile, 150);
  subscribeToTree(tree, async (leaf) => {
    if (leaf.changeSource === "tree-sync") {
      // Ignore changes from tree sync
      return;
    }

    // TODO DEBUG
    const p = await debouncedSyncTreeToFile(tree, path);
    console.info(p);
  });

  monitorFile(path, async (_, event) => {
    if (
      event == Gio.FileMonitorEvent.CREATED ||
      event == Gio.FileMonitorEvent.CHANGED
    ) {
      await syncTreeFromFile(tree, path);
    }
  });

  console.info(`OptionTree defined with file ${path}.`);
  return tree as ReadonlyDeep<T>;
}
