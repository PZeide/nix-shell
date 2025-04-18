import { execAsync, GLib, writeFileAsync } from "astal";
import { Option, OptionType } from "../options/option";

export type StyleDependency<T extends OptionType> = {
  option: Option<T>;
  name: string;
  fallback?: () => T;
};

const tempFileName = "_~theme.scss";

function buildTempFileContent(
  dependencies: StyleDependency<OptionType>[],
): string {
  let content = "";
  for (const dependency of dependencies) {
    const value =
      dependency.option.get() ??
      (dependency.fallback ? dependency.fallback() : null);

    if (!value) {
      console.warn(`Missing value for style dependency ${dependency.name}.`);
      continue;
    }

    content += `$${dependency.name}: ${value};\n`;
  }

  return content;
}

export async function compileStyle(
  stylePath: string,
  dependencies: StyleDependency<OptionType>[],
): Promise<string> {
  const tempDir = GLib.dir_make_tmp("zs-style-XXXXXX");

  try {
    const tempFile = `${tempDir}/${tempFileName}`;
    await writeFileAsync(tempFile, buildTempFileContent(dependencies));
    console.debug(`Temporary style file written at ${tempFile}.`);
    return await execAsync(["sass", stylePath, "-I", tempDir]);
  } finally {
    await execAsync(["rm", "-r", tempDir]);
    console.debug(`Cleaned style temporary directory.`);
  }
}
