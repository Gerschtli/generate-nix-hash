import {getInput, setFailed} from '@actions/core'
import {exec} from 'child_process'
import {writeFileSync} from 'fs'
import {promisify} from 'util'

const execAsync = promisify(exec)

async function run(): Promise<void> {
  try {
    const rev: string = getInput('rev')
    const owner: string = getInput('owner')
    const repo: string = getInput('repo')
    const file: string = getInput('file')

    const command = `nix-prefetch-url --unpack "https://github.com/${owner}/${repo}/archive/${rev}.tar.gz"`
    const {stdout} = await execAsync(command)

    const result = {rev, sha256: stdout.trim()}
    const content = `${JSON.stringify(result, null, 2)}\n`

    writeFileSync(file, content)
  } catch (error) {
    setFailed(error.message)
  }
}

run()
