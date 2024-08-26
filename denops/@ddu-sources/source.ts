import {
  BaseSource,
  type GatherArguments,
  type OnInitArguments,
} from "jsr:@shougo/ddu-vim@^5.0.0/source";
import type { Item } from "jsr:@shougo/ddu-vim@^5.0.0/types";
import { basename } from "jsr:@std/path@^1.0.2/basename";
import { ensure } from "jsr:@core/unknownutil@^4.3.0/ensure";
import { is } from "jsr:@core/unknownutil@^4.3.0/is";
import type { ActionData } from "../@ddu-kinds/source.ts";

type Params = Record<PropertyKey, never>;

export class Source extends BaseSource<Params, ActionData> {
  kind = "source";
  #items: Item<ActionData>[] = [];

  async onInit(args: OnInitArguments<Params>): Promise<void> {
    const sourceFiles = ensure(
      await args.denops.eval(
        "globpath(&runtimepath, 'denops/@ddu-sources/*.ts', 1, 1)",
      ),
      is.ArrayOf(is.String),
    );
    const sources = [
      sourceFiles.map((file) => basename(file, ".ts")),
      await args.denops.dispatcher.getSourceNames() as string[],
      await args.denops.dispatcher.getAliasNames("source") as string[],
    ].flat();
    this.#items = [...new Set(sources)]
      .map((word) => ({
        word,
        action: { name: word },
      }));
  }

  gather(_args: GatherArguments<Params>): ReadableStream<Item<ActionData>[]> {
    return ReadableStream.from([this.#items]);
  }

  params(): Params {
    return {};
  }
}
