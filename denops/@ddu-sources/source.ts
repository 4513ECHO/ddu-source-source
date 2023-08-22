import {
  BaseSource,
  type OnInitArguments,
} from "https://deno.land/x/ddu_vim@v3.5.1/base/source.ts";
import type { Item } from "https://deno.land/x/ddu_vim@v3.5.1/types.ts";
import { basename } from "https://deno.land/std@0.199.0/path/mod.ts";
import { ensure, is } from "https://deno.land/x/unknownutil@v3.4.0/mod.ts";
import type { ActionData } from "../@ddu-kinds/source.ts";

type Params = Record<PropertyKey, never>;

export class Source extends BaseSource<Params, ActionData> {
  override kind = "source";
  #stream: ReadableStream<Item<ActionData>[]> = new ReadableStream();

  override async onInit(args: OnInitArguments<Params>): Promise<void> {
    const sourceFiles = ensure(
      await args.denops.eval(
        "globpath(&runtimepath, 'denops/@ddu-sources/*.ts', 1, 1)",
      ),
      is.ArrayOf(is.String),
    );
    const sources = sourceFiles
      .map((file) => basename(file, ".ts"))
      .concat(args.loader.getSourceNames())
      .concat(args.loader.getAliasNames("source"));
    const items = [...new Set(sources)]
      .map((word) => ({
        word,
        action: { name: word },
      }));
    this.#stream = ReadableStream.from([items]);
  }

  override gather(_args: unknown): ReadableStream<Item<ActionData>[]> {
    return this.#stream;
  }

  override params(): Params {
    return {};
  }
}
