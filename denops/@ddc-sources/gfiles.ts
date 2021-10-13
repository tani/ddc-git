import { BaseSource, Candidate } from "https://lib.deno.dev/x/ddc_vim@v0/types.ts"
import { GatherCandidatesArguments } from "https://lib.deno.dev/x/ddc_vim@v0/base/source.ts"
import * as fn from "https://deno.land/x/denops_std@v2.1.1/function/mod.ts"

type UserData= Record<string, never>
type Params = Record<string, never>

async function git(cwd: string, ...args: string[]): Promise<string | null> {
    const proc = Deno.run({cwd, cmd: ['git', ...args], stdout: "piped"})
    const status = await proc.status()
    if (!status.success) {
      return null
    }
    const output = await proc.output()
    const decoder = new TextDecoder()
    const result = decoder.decode(output)
    proc.close()
    return result.trim()
}

export class Source extends BaseSource<Params, UserData> {
  async gatherCandidates(args: GatherCandidatesArguments<Params>) : Promise<Candidate<UserData>[]> {
    const cwd = await fn.getcwd(args.denops) as string
    const root = await git(cwd, 'rev-parse', '--show-toplevel')
    if (!root) {
      return []
    }
    const files = await git(root, 'ls-files')
    if (!files) {
      return []
    }
    return files.split("\n").map((file) => ({ word: `${root}/${file}`}))
  }
  params(): Params {
    return {}
  }
}

