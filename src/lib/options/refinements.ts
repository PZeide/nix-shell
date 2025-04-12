import colorString from "color-string";
import { SuperRefinement, z } from "zod";

export const CssColorRefinement: SuperRefinement<string> = (arg, ctx) => {
  if (colorString.get(arg) === null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Invalid css color string.",
    });
  }
};
