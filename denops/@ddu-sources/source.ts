import * as path from "https://deno.land/std@0.135.0/path/mod.ts";
import type { GatherArguments } from "https://deno.land/x/ddu_vim@v1.5.0/base/source.ts";
import type {
  DduExtType,
  Item,
} from "https://deno.land/x/ddu_vim@v1.5.0/types.ts";
import { BaseSource } from "https://deno.land/x/ddu_vim@v1.5.0/types.ts";
import {
  ensureArray,
  ensureLike,
} from "https://deno.land/x/unknownutil@v2.0.0/mod.ts";
import { ActionData } from "../@ddu-kinds/source.ts";

type Params = Record<never, never>;
type Aliases = Record<DduExtType, Record<string, string>>;

export class Source extends BaseSource<Params, ActionData> {
  kind = "source";

  gather(args: GatherArguments<Params>): ReadableStream<Item<ActionData>[]> {
    return new ReadableStream({
      async start(controller) {
        const sourceFiles = ensureArray<string>(
          await args.denops.eval(
            "globpath(&runtimepath, 'denops/@ddu-sources/*.ts', 1, 1)",
          ),
        );
        const aliases = ensureLike<Aliases>(
          { ui: {}, source: {}, filter: {}, kind: {} },
          await args.denops.call("ddu#custom#get_aliases"),
        );
        const sources = sourceFiles
          .map((i) => path.basename(i, ".ts"))
          .filter((i) => i !== "")
          .concat(Object.keys(aliases.source));
        controller.enqueue(
          sources.map((i) => {
            return {
              word: i,
              action: {
                name: i,
              },
            };
          }),
        );
        controller.close();
      },
    });
  }

  params(): Params {
    return {};
  }
}
