import {
  BaseSource,
  type OnInitArguments,
} from "jsr:@shougo/ddu-vim@^6.0.0/source";
import type { Item } from "jsr:@shougo/ddu-vim@^6.0.0/types";
import { basename } from "jsr:@std/path@^1.0.3/basename";
import type { ActionData } from "../@ddu-kinds/source.ts";

type Params = Record<PropertyKey, never>;

export class Source extends BaseSource<Params, ActionData> {
  kind = "source";
  #items: Item<ActionData>[] = [];

  async onInit(args: OnInitArguments<Params>): Promise<void> {
    const sourceFiles = await args.denops.eval(
      "globpath(&runtimepath, 'denops/@ddu-sources/*.ts', v:true, v:true)",
    ) as string[];
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

  gather(): ReadableStream<Item<ActionData>[]> {
    return ReadableStream.from([this.#items]);
  }

  params(): Params {
    return {};
  }
}
