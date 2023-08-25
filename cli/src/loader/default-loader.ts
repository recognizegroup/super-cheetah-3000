import {Loader} from './loader'
import ora, {Ora} from 'ora'

export class DefaultLoader implements Loader {
  spinner?: Ora

  async start(): Promise<void> {
    this.spinner = ora('Starting generation...').start()
  }

  async update(status: string): Promise<void> {
    this.checkStop()
    this.spinner = ora(status).start()
  }

  async stop(): Promise<void> {
    this.checkStop()
  }

  private checkStop(): void {
    this.spinner?.stop()
  }
}
