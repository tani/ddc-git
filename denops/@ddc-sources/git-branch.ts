/*
 * Copyright (c) 2021 TANIGUCHI Masaya. All rights reserved.
 * This work is licensed under the MIT license. git.io/mit-license
 */

import { BaseSource, Candidate } from "https://lib.deno.dev/x/ddc_vim@v0/types.ts"
import { GatherCandidatesArguments } from "https://lib.deno.dev/x/ddc_vim@v0/base/source.ts"
import * as fn from "https://deno.land/x/denops_std@v2.1.1/function/mod.ts"
import { git } from "../../git.ts"

type UserData= Record<string, never>
type Params = Record<string, never>

export class Source extends BaseSource<Params, UserData> {
  async gatherCandidates(args: GatherCandidatesArguments<Params>) : Promise<Candidate<UserData>[]> {
    const cwd = await fn.getcwd(args.denops) as string
    const list = await git(cwd, 'branch')
    if (!list) {
      return []
    }
    return list.split("\n").map((item) => ({
      word: item.replace(/\s*\*\s*/, '').trim()
    }))
  }
  params(): Params {
    return {}
  }
}

