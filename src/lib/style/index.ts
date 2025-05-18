import type { Option, OptionType } from "@/lib/options/option";
import { debounce } from "@/lib/utils/helpers";
import app from "ags/gtk4/app";
import { type StyleDependency, compileStyle } from "./builder";

type StyleDependencyOptions<T extends OptionType> = {
  name: string;
  fallback?: () => T;
  transform?: (value: OptionType) => OptionType;
};

export function styleDep<T extends OptionType>(
  option: Option<T>,
  options: StyleDependencyOptions<T>
): StyleDependency<T> {
  return {
    option,
    name: options.name,
    fallback: options.fallback,
    transform: options.transform,
  };
}

async function updateStyle(
  stylePath: string,
  dependencies: StyleDependency<OptionType>[]
) {
  const css = await compileStyle(stylePath, dependencies);
  app.apply_css(css, true);
  console.debug("Shell style has been updated.");
}

export async function initStyle(
  baseStyle: string,
  dependencies: StyleDependency<OptionType>[]
) {
  await updateStyle(baseStyle, dependencies);

  const debouncedUpdateStyle = debounce(updateStyle, 150);
  for (const dependency of dependencies) {
    dependency.option.subscribe(() => {
      console.debug("Style dependency has changed.");

      debouncedUpdateStyle(baseStyle, dependencies).catch((e) =>
        console.error(`Failed to update style after change: ${e}.`)
      );
    });
  }
}
