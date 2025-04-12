import { Option, OptionType } from "./option";

export type OptionTree = {
  [key: string]: Option<OptionType> | OptionTree;
};

type LeafChangeCallback<T extends OptionType> = (
  leaf: Option<T>,
  value: T,
) => void;

export function subscribeToTree(
  tree: OptionTree,
  onLeafChange: LeafChangeCallback<OptionType>,
) {
  for (const key in tree) {
    const target = tree[key];
    if (target instanceof Option) {
      target.subscribe((value) => onLeafChange(target, value));
    } else {
      return subscribeToTree(target, onLeafChange);
    }
  }
}
