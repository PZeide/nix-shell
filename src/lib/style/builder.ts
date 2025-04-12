import { Option, OptionType } from "../options/option";

export type StyleDependency = {
  option: Option<OptionType>;
  cssName: string;
};

export function buildStyle(
  baseStyle: string,
  dependencies: StyleDependency[],
): string {
  let rootDeclaration = ":root {";
  for (const dependency of dependencies) {
    rootDeclaration += `\n  --${dependency.cssName}: ${dependency.option.get()};`;
  }
  rootDeclaration += "\n}\n\n";

  return rootDeclaration + baseStyle;
}
