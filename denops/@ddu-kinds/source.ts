import type { Actions } from "https://deno.land/x/ddu_vim@v3.4.3/types.ts";
import {
  ActionFlags,
  BaseKind,
} from "https://deno.land/x/ddu_vim@v3.4.3/types.ts";

export interface ActionData {
  name: string;
}
type Params = Record<never, never>;

export class Kind extends BaseKind<Params> {
  override actions: Actions<Params> = {
    async execute(args) {
      const options = {
        sources: args.items.map((item) => ({
          name: (item?.action as ActionData).name,
          params: args.actionParams,
        })),
      };
      await args.denops.call("ddu#start", options);
      return Promise.resolve(ActionFlags.None);
    },
  };

  override params(): Params {
    return {};
  }
}
