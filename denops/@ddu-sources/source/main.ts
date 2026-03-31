import type { Denops } from "@denops/std";
import {
  BaseSource,
  type GatherArguments,
  type OnInitArguments,
} from "@shougo/ddu-vim/source";
import type { Item } from "@shougo/ddu-vim/types";
import { basename } from "@std/path/basename";
import { dirname } from "@std/path/dirname";
import type { ActionData } from "../../@ddu-kinds/source/main.ts";

type Params = Record<PropertyKey, never>;

export class Source extends BaseSource<Params, ActionData> {
  override kind = "source";
  #sourceFiles: string[] = [];

  override async onInit(args: OnInitArguments<Params>): Promise<void> {
    const sourceFiles = await args.denops.eval(
      "globpath(&runtimepath, 'denops/@ddu-sources/*.ts', v:true, v:true)",
    ) as string[];

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
