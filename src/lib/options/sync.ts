import { Gio, readFileAsync, writeFileAsync } from "astal";
import { JsonObject } from "type-fest";
import { ensureDirectories, isGLibError } from "../utils";
import { Option } from "./option";
import { OptionTree } from "./tree";

function jsonifyTree(tree: OptionTree): string {
  const result: JsonObject = {};

  for (const key in tree) {
    const target = tree[key];
    if (target instanceof Option) {
      result[key] = target.get();
    } else {
      result[key] = jsonifyTree(target);
    }
  }

  return JSON.stringify(result);
}

export async function syncTreeToFile(tree: OptionTree, path: string) {
  const json = jsonifyTree(tree);
  ensureDirectories(path);
  await writeFileAsync(path, json);
  console.info(`OptionTree has been written to ${path}.`);
}

function traverseAndSync(
  tree: OptionTree,
  object: JsonObject,
  objectPath: string = "",
) {
  for (const key in object) {
    const objectTarget = object[key];
    const treeTarget = tree[key];
    const optionPath = objectPath + key;

    if (treeTarget === undefined) {
      throw new Error(`Unexcepted option at ${optionPath}`);
    }

    if (treeTarget instanceof Option) {
      try {
        treeTarget.set(objectTarget, { source: "tree-sync" });
      } catch (e) {
        if (e instanceof Error) {
          throw Error(`Failed to sync option at ${optionPath} (${e.message})`);
        }

        throw Error(`Failed to sync option at ${optionPath}`);
      }
    } else {
      if (typeof objectTarget !== "object") {
        throw Error(`Unexcepted value at ${objectPath}, excepted an object`);
      }

      traverseAndSync(treeTarget, objectTarget as JsonObject, `${objectPath}.`);
    }
  }
}

export async function syncTreeFromFile(tree: OptionTree, path: string) {
  let content: string;
  try {
    content = await readFileAsync(path);
  } catch (e) {
    if (isGLibError(e, Gio.IOErrorEnum, Gio.IOErrorEnum.NOT_FOUND)) {
      // File doesn't exists, ignore sync
      console.debug("File is missing, OptionTree is unchanged.");
      return;
    }

    throw e;
  }

  let object: JsonObject;
  try {
    const unsafe = JSON.parse(content);
    if (typeof unsafe !== "object") {
      throw new Error("JSON is not an object");
    }

    object = unsafe;
  } catch (e) {
    if (e instanceof Error) {
      throw Error(`Failed to parse options (${e.message})`);
    } else {
      throw Error("Failed to parse options");
    }
  }

  traverseAndSync(tree, object);
}
