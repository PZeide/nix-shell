import { State } from "ags/state";
import type { JsonPrimitive } from "type-fest";
import type z from "zod";

export type OptionTree = {
  [key: string]: Option | OptionTree;
};

export type OptionType = JsonPrimitive | JsonPrimitive[];

export class Option<T extends OptionType = OptionType> extends State<T> {
  public readonly type: z.ZodType<T>;

  constructor(init: T, type: z.ZodType<T>) {
    super(type.parse(init));
    this.type = type;
  }

  public override set(value: T) {
    const parsedValue = this.type.parse(value);
    return super.set(parsedValue);
  }
}
