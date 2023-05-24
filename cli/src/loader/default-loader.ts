import {Loader} from './loader'
import {ux} from '@oclif/core'

export class DefaultLoader implements Loader {
  hasCurrentSpinner = false

  async start(): Promise<void> {
    ux.action.start('Starting generation...')

    this.hasCurrentSpinner = true
  }

  async update(status: string): Promise<void> {
    this.checkStop()

    ux.action.start(status)
  }

  async stop(): Promise<void> {
    this.checkStop()

    this.hasCurrentSpinner = true
  }

  private checkStop(): void {
    if (this.hasCurrentSpinner) {
      ux.action.stop('done')
    }
  }
}
