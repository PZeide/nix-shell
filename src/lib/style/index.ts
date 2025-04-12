import { App } from "astal/gtk4";
import { Option, OptionType } from "../options/option";
import { debounce } from "../utils";
import { buildStyle, StyleDependency } from "./builder";

export function styleDep(
  option: Option<OptionType>,
  cssName: string,
): StyleDependency {
  return { option, cssName };
}

async function updateStyle(baseStyle: string, dependencies: StyleDependency[]) {
  const css = buildStyle(baseStyle, dependencies);
  App.reset_css();
  App.apply_css(css);
  console.info("Shell style has been updated.");
}

export async function initStyle(
  baseStyle: string,
  dependencies: StyleDependency[],
) {
  await updateStyle(baseStyle, dependencies);

  const debouncedUpdateStyle = debounce(updateStyle, 150);
  for (const dependency of dependencies) {
    dependency.option.subscribe(async () => {
      console.debug("Style dependency has changed.");
      await debouncedUpdateStyle(baseStyle, dependencies);
    });
  }
}
