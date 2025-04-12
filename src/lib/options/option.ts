import { Variable } from "astal";
import { JsonPrimitive } from "type-fest";
import { z } from "zod";

export type OptionType = JsonPrimitive | JsonPrimitive[];

export type ChangeSource = "tree-sync" | "external";
export type ExternalChangeListener<T extends OptionType> = (value: T) => void;

export class Option<T extends OptionType> extends Variable<T> {
  public readonly init: T;
  public readonly type: z.ZodType<T>;
  private _changeSource: ChangeSource | null;

  constructor(init: T, type: z.ZodType<T>) {
    super(type.parse(init));

    this.init = init;
    this.type = type;
    this._changeSource = null;
  }

  public get changeSource() {
    return this._changeSource;
  }

  public override set = (
    value: unknown,
    options: { source: ChangeSource } = { source: "external" },
  ) => {
    const parsedValue = this.type.parse(value);
    this._changeSource = options.source;
    super.set(parsedValue);
    console.debug(
      `Option changed to ${parsedValue} from source ${options.source}.`,
    );
  };

  public reset() {
    this.set(this.init);
  }
}
