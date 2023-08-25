import {Loader} from './loader'
import ora, {Ora} from 'ora'

export class DefaultLoader implements Loader {
  spinner?: Ora

  async start(): Promise<void> {
    this.spinner = ora({
      text: 'Starting generation',
      isEnabled: true,
    }).start()
  }

  async update(status: string): Promise<void> {
    this.checkStop()
    this.spinner = ora({
      text: status,
      isEnabled: true,
    }).start()
  }

  async stop(): Promise<void> {
    this.checkStop()
  }

  private checkStop(): void {
    this.spinner?.stop()
  }
}
