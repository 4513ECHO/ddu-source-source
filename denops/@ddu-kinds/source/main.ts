import { BaseKind } from "@shougo/ddu-vim/kind";
import {
  ActionFlags,
  type Actions,
  type DduOptions,
} from "@shougo/ddu-vim/types";

export type ActionData = {
  name: string;
};
type Params = Record<PropertyKey, never>;

export class Kind extends BaseKind<Params> {
  override actions: Actions<Params> = {
    async execute(args) {
      const options: Partial<DduOptions> = {
        ...args.actionParams,
        sources: args.items.map((item) => ({
          name: (item?.action as ActionData).name,
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
