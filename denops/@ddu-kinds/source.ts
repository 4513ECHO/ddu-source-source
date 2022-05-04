import type {
  Actions,
  DduOptions,
} from "https://deno.land/x/ddu_vim@v1.5.0/types.ts";
import {
  ActionFlags,
  BaseKind,
} from "https://deno.land/x/ddu_vim@v1.5.0/types.ts";

export interface ActionData {
  name: string;
}
type Params = Record<never, never>;
type ActionParams = Record<string, unknown>;

export class Kind extends BaseKind<Params> {
  actions: Actions<Params> = {
    async execute(args) {
      const actionParams = args.actionParams as ActionParams;
      const options: DduOptions = {
        sources: args.items.map((i) => {
          const action = i?.action as ActionData;
          return {
            name: action.name,
            params: actionParams,
          };
        }),
      };
      await args.denops.call("ddu#start", options);
      return Promise.resolve(ActionFlags.None);
    },
  };

  params(): Params {
    return {};
  }
}
