import { BaseKind } from "jsr:@shougo/ddu-vim@^9.0.1/kind";
import { ActionFlags, type Actions } from "jsr:@shougo/ddu-vim@^9.0.1/types";

export type ActionData = {
  name: string;
};
type Params = Record<PropertyKey, never>;

export class Kind extends BaseKind<Params> {
  override actions: Actions<Params> = {
    async execute(args) {
      for (const item of args.items) {
        const sourceName = (item?.action as ActionData).name;
        await args.denops.dispatcher.start({
          name: sourceName,
        });
      }
      return ActionFlags.None;
    },
  };

  override params(): Params {
    return {};
  }
}
