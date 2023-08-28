import {
  ActionFlags,
  type Actions,
  BaseKind,
} from "https://deno.land/x/ddu_vim@v3.6.0/types.ts";

export type ActionData = {
  name: string;
};
type Params = Record<PropertyKey, never>;

export class Kind extends BaseKind<Params> {
  override actions: Actions<Params> = {
    async execute(args) {
      const options = {
        sources: args.items.map((item) => ({
          name: (item?.action as ActionData).name,
          params: args.actionParams,
        })),
      };
      await args.denops.dispatcher.start(options);
      return Promise.resolve(ActionFlags.None);
    },
  };

  override params(): Params {
    return {};
  }
}
