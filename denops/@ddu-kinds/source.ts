// import * as anonymous from "https://deno.land/x/denops_std@v3.2.0/anonymous/mod.ts";
// import * as fn from "https://deno.land/x/denops_std@v3.2.0/function/mod.ts";
import type {
  ActionFlags,
  Actions,
  DduOptions,
} from "https://deno.land/x/ddu_vim@v1.3.0/types.ts";
import { BaseKind } from "https://deno.land/x/ddu_vim@v1.3.0/types.ts";

type Params = Record<never, never>;

export interface ActionData {
  name: string;
  options?: Pick<DduOptions, "sources">;
}

export class Kind extends BaseKind<Params> {
  actions: Actions<Params> = {
    async execute(args) {
      const options: DduOptions = {
        sources: args.items.map((i) => {
          const action = i?.action as ActionData;
          return {
            name: action.name,
          };
        }),
        // ...args.items.map((i) => (i?.action as ActionData).options ?? {}),
      };
      await args.denops.call("ddu#start", options);
      return Promise.resolve(ActionFlags.None);
    },
  };

  params(): Params {
    return {};
  }
}
