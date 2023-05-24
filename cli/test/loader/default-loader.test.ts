import {expect} from 'chai'
import {ux} from '@oclif/core'
import {DefaultLoader} from '../../src/loader/default-loader'

describe('default loader', () => {
  let loader: DefaultLoader

  beforeEach(() => {
    loader = new DefaultLoader()
  })

  afterEach(() => {
    // Reset the action status after each test
    ux.action.stop()
  })

  it('should start the generation', async () => {
    await loader.start()
    expect(ux.action.running).to.be.true
  })

  it('should update the status', async () => {
    const status = 'Updating status'
    await loader.update(status)
    expect(ux.action.running).to.be.true
  })

  it('should stop the loader', async () => {
    loader.hasCurrentSpinner = true
    await loader.stop()
    expect(ux.action.running).to.be.false
  })
})
