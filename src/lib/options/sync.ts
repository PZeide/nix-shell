import Gio from "gi://Gio?version=2.0";
import { isGLibError } from "@/lib/utils/glib";
import { readFileAsync } from "ags/file";
import type { JsonObject } from "type-fest";
import { Option, type OptionTree } from "./option";

function traverseAndSync(
  tree: OptionTree,
  object: JsonObject,
  objectPath = ""
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
        // We can safely cast to never because zod will catch any type errors
        treeTarget.set(objectTarget as never);
      } catch (e) {
        throw Error(`Failed to sync option at ${optionPath}`, { cause: e });
      }
    } else {
      if (typeof objectTarget !== "object") {
        throw Error(`Unexcepted value at ${objectPath}, excepted an object`);
      }

      traverseAndSync(treeTarget, objectTarget as JsonObject, `${key}.`);
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
      console.debug(`File ${path} is missing, option tree is unchanged.`);
      return;
    }

    throw new Error(`Failed to read file ${path}.`, { cause: e });
  }

  let object: JsonObject;
  try {
    const unsafe = JSON.parse(content);
    if (typeof unsafe !== "object") {
      throw new Error("JSON is not an object");
    }

    object = unsafe;
  } catch (e) {
    throw Error("Failed to parse options", { cause: e });
  }

  traverseAndSync(tree, object);
}
