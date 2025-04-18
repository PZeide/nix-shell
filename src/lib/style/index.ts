import { App } from "astal/gtk4";
import { Option, OptionType } from "../options/option";
import { debounce } from "../utils";
import { compileStyle, StyleDependency } from "./builder";

export function styleDep<T extends OptionType>(
  option: Option<T>,
  name: string,
  fallback?: () => T,
): StyleDependency<T> {
  return { option, name, fallback };
}

async function updateStyle(
  stylePath: string,
  dependencies: StyleDependency<OptionType>[],
) {
  const css = await compileStyle(stylePath, dependencies);
  App.reset_css();
  App.apply_css(css);
  console.info("Shell style has been updated.");
}

export async function initStyle(
  baseStyle: string,
  dependencies: StyleDependency<OptionType>[],
) {
  await updateStyle(baseStyle, dependencies);

  const debouncedUpdateStyle = debounce(updateStyle, 150);
  for (const dependency of dependencies) {
    dependency.option.subscribe(() => {
      console.debug("Style dependency has changed.");

      debouncedUpdateStyle(baseStyle, dependencies).catch((e) =>
        console.error(`Failed to update style after change: ${e}.`),
      );
    });
  }
}
