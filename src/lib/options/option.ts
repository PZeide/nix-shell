import { State } from "ags/state";
import type { JsonPrimitive } from "type-fest";
import { z } from "zod/v4-mini";

export type OptionTree = {
  [key: string]: Option | OptionTree;
};

export type OptionType = JsonPrimitive | JsonPrimitive[];

// Since zod 4, the Error returned isn't actually extending the Error object.
// GJS don't handle that so we need to recreate the error.
function zParse<T>(type: z.ZodMiniType<T>, data: unknown): T {
  const result = type.safeParse(data);
  if (result.success) {
    return result.data;
  }

  const error = new Error(z.prettifyError(result.error));
  error.name = result.error.name;
  error.cause = result.error.cause;
  error.stack = result.error.stack;
  throw error;
}

export class Option<T extends OptionType = OptionType> extends State<T> {
  public readonly type: z.ZodMiniType<T>;

  constructor(init: T, type: z.ZodMiniType<T>) {
    super(zParse(type, init));
    this.type = type;
  }

  public override set(value: T) {
    const parsedValue = zParse(this.type, value);
    return super.set(parsedValue);
  }
}
