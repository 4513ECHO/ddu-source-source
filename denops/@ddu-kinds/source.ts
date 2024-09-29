import { BaseKind } from "jsr:@shougo/ddu-vim@^6.2.0/kind";
import { ActionFlags, type Actions } from "jsr:@shougo/ddu-vim@^6.2.0/types";

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
      return ActionFlags.None;
    },
  };

  override params(): Params {
    return {};
  }
}
