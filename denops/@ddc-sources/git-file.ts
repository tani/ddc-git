/*
 * Copyright (c) 2021 TANIGUCHI Masaya. All rights reserved.
 * This work is licensed under the MIT license. git.io/mit-license
 */

import {
  BaseSource,
  Candidate,
} from "https://lib.deno.dev/x/ddc_vim@v0/types.ts";
import {
  GatherCandidatesArguments,
  GetCompletePositionArguments,
} from "https://lib.deno.dev/x/ddc_vim@v0/base/source.ts";
import * as fn from "https://deno.land/x/denops_std@v2.1.1/function/mod.ts";
import { git } from "../../git.ts";

type UserData = Record<string, never>;
type Params = Record<string, never>;

function isValidUnixPath(path: string): boolean {
  let escape = false;
  for (let i = 0; i < path.length; i++) {
    if (!escape && path[i].match(/\s/)) {
      return false;
    }
    if (path[i] === "\\") {
      escape = !escape;
    } else {
      escape = false;
    }
  }
  return true;
}

export class Source extends BaseSource<Params, UserData> {
  override getCompletePosition(
    arg: GetCompletePositionArguments<Params>,
  ): Promise<number> {
    for (let i = 0; i < arg.context.input.length; i++) {
      if (isValidUnixPath(arg.context.input.slice(i))) {
        return Promise.resolve(i);
      }
    }
    return Promise.resolve(arg.context.input.length);
  }
  override async gatherCandidates(
    args: GatherCandidatesArguments<Params>,
  ): Promise<Candidate<UserData>[]> {
    const cwd = await fn.getcwd(args.denops) as string;
    const root = await git(cwd, "rev-parse", "--show-toplevel");
    if (!root) {
      return [];
    }
    const list = await git(root.trim(), "ls-files");
    if (!list) {
      return [];
    }
    return list.split("\n").map((item) => ({
      word: `${root.trim()}/${item.trim()}`.replaceAll(" ", "\\ "),
      abbr: `${root.trim()}/${item.trim()}`,
      mark: "git-file",
    }));
  }
  params(): Params {
    return {};
  }
}
