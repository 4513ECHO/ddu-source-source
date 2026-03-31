import { BaseKind } from "@shougo/ddu-vim/kind";
import { ActionFlags, type Actions } from "@shougo/ddu-vim/types";

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
