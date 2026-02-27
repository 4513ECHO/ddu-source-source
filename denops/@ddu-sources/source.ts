import { Denops } from "jsr:@denops/std@^7.4.0";
import {
  BaseSource,
  type GatherArguments,
  type OnInitArguments,
} from "jsr:@shougo/ddu-vim@^9.0.1/source";
import type { Item } from "jsr:@shougo/ddu-vim@^9.0.1/types";
import { basename } from "jsr:@std/path@^1.0.6/basename";
import { dirname } from "jsr:@std/path@^1.0.6/dirname";
import type { ActionData } from "../@ddu-kinds/source.ts";

type Params = Record<PropertyKey, never>;

export class Source extends BaseSource<Params, ActionData> {
  override kind = "source";
  #sourceFiles: string[] = [];

  override async onInit(args: OnInitArguments<Params>): Promise<void> {
    // Get sources with pattern: denops/@ddu-sources/*.ts
    const sourceFiles = await args.denops.eval(
      "globpath(&runtimepath, 'denops/@ddu-sources/*.ts', v:true, v:true)",
    ) as string[];

    // Get sources with pattern: denops/@ddu-sources/*/main.ts
    const mainSourceFiles = await args.denops.eval(
      "globpath(&runtimepath, 'denops/@ddu-sources/*/main.ts', v:true, v:true)",
    ) as string[];

    this.#sourceFiles = [
      ...sourceFiles.map((file) => basename(file, ".ts")),
      ...mainSourceFiles.map((file) => basename(dirname(file))),
    ];
  }

  override gather(
    args: GatherArguments<Params>,
  ): ReadableStream<Item<ActionData>[]> {
    return ReadableStream.from(this.#gather(args.denops, args.options.name));
  }

  override params(): Params {
    return {};
  }

  async *#gather(
    denops: Denops,
    name: string,
  ): AsyncGenerator<Item<ActionData>[]> {
    const sources = [
      this.#sourceFiles,
      await denops.dispatcher.getSourceNames(name) as string[],
      await denops.dispatcher.getAliasNames(name, "source") as string[],
    ].flat();
    yield [...new Set(sources)]
      .map((word) => ({
        word,
        action: { name: word },
      }));
  }
}
