export async function git(cwd: string, ...args: string[]): Promise<string | null> {
    const proc = Deno.run({cwd, cmd: ['git', ...args], stdout: "piped", stderr: "null"})
    const status = await proc.status()
    if (!status.success) {
      return null
    }
    const output = await proc.output()
    const decoder = new TextDecoder()
    const result = decoder.decode(output)
    proc.close()
    return result
}

