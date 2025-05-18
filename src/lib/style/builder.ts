import GLib from "gi://GLib?version=2.0";
import type { Option, OptionType } from "@/lib/options/option";
import { writeFileAsync } from "ags/file";
import { execAsync } from "ags/process";

export type StyleDependency<T extends OptionType> = {
  option: Option<T>;
  name: string;
  fallback?: () => T;
  transform?: (value: OptionType) => OptionType;
};

const tempFileName = "_@theme.scss";

function buildTempFileContent(
  dependencies: StyleDependency<OptionType>[]
): string {
  let content = "";
  for (const dependency of dependencies) {
    let value =
      dependency.option.get() ??
      (dependency.fallback ? dependency.fallback() : null);

    if (!value) {
      console.warn(`Missing value for style dependency ${dependency.name}.`);
      continue;
    }

    if (dependency.transform) {
      value = dependency.transform(value);
    }

    content += `$${dependency.name}: ${value};\n`;
  }

  return content;
}

export async function compileStyle(
  stylePath: string,
  dependencies: StyleDependency<OptionType>[]
): Promise<string> {
  const tempDir = GLib.dir_make_tmp("zs-style-XXXXXX");

  try {
    const tempFile = `${tempDir}/${tempFileName}`;
    await writeFileAsync(tempFile, buildTempFileContent(dependencies));
    console.debug(`Temporary style file written at ${tempFile}.`);
    return await execAsync(["sass", stylePath, "-I", tempDir]);
  } finally {
    await execAsync(["rm", "-r", tempDir]);
    console.debug("Cleaned style temporary directory.");
  }
}
