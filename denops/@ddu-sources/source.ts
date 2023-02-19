import * as path from "https://deno.land/std@0.177.0/path/mod.ts";
import type {
  GatherArguments,
  OnInitArguments,
} from "https://deno.land/x/ddu_vim@v2.3.0/base/source.ts";
import type {
  DduExtType,
  Item,
} from "https://deno.land/x/ddu_vim@v2.3.0/types.ts";
import { BaseSource } from "https://deno.land/x/ddu_vim@v2.3.0/types.ts";
import {
  ensureArray,
  ensureLike,
} from "https://deno.land/x/unknownutil@v2.1.0/mod.ts";
import { ActionData } from "../@ddu-kinds/source.ts";

type Params = Record<never, never>;
type Aliases = Record<DduExtType, Record<string, string>>;

export class Source extends BaseSource<Params, ActionData> {
  override kind = "source";
  #items: Item<ActionData>[] = [];

  override async onInit(args: OnInitArguments<Params>): Promise<void> {
    const sourceFiles = ensureArray<string>(
      await args.denops.eval(
        "globpath(&runtimepath, 'denops/@ddu-sources/*.ts', 1, 1)",
      ),
    );
    const aliases = ensureLike<Aliases, unknown>(
      { ui: {}, source: {}, filter: {}, kind: {}, column: {} },
      await args.denops.call("ddu#custom#get_aliases"),
    );
    this.#items = sourceFiles
      .map((file) => path.basename(file, ".ts"))
      .concat(Object.keys(aliases.source))
      .map((word) => ({
        word,
        action: { name: word },
      }));
  }

  override gather(
    _args: GatherArguments<Params>,
  ): ReadableStream<Item<ActionData>[]> {
    return new ReadableStream({
      start: (controller) => {
        controller.enqueue(this.#items);
        controller.close();
      },
    });
  }

  override params(): Params {
    return {};
  }
}
