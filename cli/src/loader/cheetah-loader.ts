import {Loader} from './loader'
import readline from 'node:readline'

const cheetah = `
                                                                                            ████████
                                                                                          ████░░░░░░██████
                                                                                      ▓▓▓▓░░░░░░░░██░░░░░░▓▓▓▓▓▓
                                                                                  ████░░░░░░░░██░░░░░░██░░░░░░░░██████████
                                                                            ██████░░██░░██░░░░░░░░██░░░░░░░░██░░░░██    ████████
                                                                    ████████░░██░░░░░░░░░░░░██░░░░░░░░░░██░░░░░░░░██  ░░██░░░░░░██
                                                        ████████████░░░░░░░░░░░░░░░░██░░██░░░░░░██░░██░░░░░░░░████░░░░░░██░░░░░░░░██
                                                  ██████░░░░░░░░░░░░██░░░░██░░░░██░░░░░░░░░░██░░░░░░░░░░░░██░░░░██  ░░██░░░░░░░░▒▒██
                                          ████████░░░░░░██░░░░██░░░░░░░░░░░░░░░░░░░░██░░░░░░░░░░████░░██░░░░░░░░██░░░░░░░░░░░░░░████
                                  ▓▓▓▓▓▓▓▓░░░░░░░░▓▓░░██░░▓▓░░░░░░▓▓░░░░██░░░░██░░░░░░░░▓▓░░░░▓▓▒▒░░░░░░░░░░██░░░░░░░░░░░░░░░░▓▓░░██▓▓
            ██████              ██▓▓██▓▓▓▓██░░██░░░░░░░░░░██░░██░░░░░░░░░░░░░░░░░░██░░░░░░░░██▓▓░░░░██░░██░░░░░░██░░██░░██░░░░░░░░░░██
        ████  ██░░██████      ████░░░░████░░░░██░░░░██░░░░██░░░░░░██░░██░░░░██░░    ░░██░░░░██░░██░░░░░░░░░░██░░░░  ██░░░░  ██  ░░████
    ████░░██  ██  ██░░░░██████░░░░██████░░████░░██░░░░░░██░░██░░░░░░░░░░░░      ████  ░░░░██░░░░░░░░░░██░░░░██    ██████    ████    ██
  ██  ██  ████  ████████░░░░██░░██    ██░░░░██░░░░░░░░░░██░░░░  ██    ██  ██████    ██    ██░░██░░██░░░░░░██░░████    ██████  ██████
  ██████████          ██████████    ██████░░██░░░░██░░██░░    ████████████            ██████░░░░░░░░████████░░██
                                  ▓▓░░██░░▓▓░░▓▓░░░░▓▓██▓▓▓▓▓▓                            ██░░▓▓░░░░██░░░░░░▓▓░░▓▓
                                ██▒▒░░░░░░██░░░░████                                        ██▒▒░░██▒▒██░░░░░░░░░░██
                              ██░░████████░░████                                              ████░░░░░░██████████░░██
                              ██░░██  ██░░░░░░██                                                  ▓▓▓▓▓▓░░██    ██    ▓▓
                            ██░░████  ████████                                                        ██░░░░██    ██  ██
                      ████████░░░░██  ██░░██                                                            ██  ██    ██  ██
                    ██        ████  ████░░██                                                            ██  ██      ████
                      ████████      ██░░██                                                              ██  ██
                                  ██░░  ██                                                                ████
                                  ██  ██
                                ██░░  ██
                                ██▒▒▒▒


`

export class CheetahLoader implements Loader {
  loaderContent = '';
  private readonly updateSpeed = 5
  interval: any;

  async start(): Promise<void> {
    this.loaderContent = cheetah

    this.moveText(this.loaderContent)
  }

  async update(_status: string): Promise<void> {}

  async stop(): Promise<void> {
    clearInterval(this.interval)
    console.log('\n')
    this.interval = undefined
  }

  private moveText(text: string): void {
    const lines = text.split('\n')
    const linePositions: number[] = lines.map(() => 0)

    this.interval = setInterval(() => {
      readline.cursorTo(process.stdout, 0, 0)

      for (const [i, line] of lines.entries()) {
        const position = linePositions[i]

        readline.cursorTo(process.stdout, position, i)
        process.stdout.write(line)

        linePositions[i] = (position + 1) % process.stdout.columns
      }
    }, this.updateSpeed)
  }
}
