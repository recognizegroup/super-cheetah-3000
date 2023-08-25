import {expect} from 'chai'
import {DefaultLoader} from '../../src/loader/default-loader'

describe('default loader', () => {
  let loader: DefaultLoader

  beforeEach(() => {
    loader = new DefaultLoader()
  })

  afterEach(() => {
    loader.spinner?.stop()
  })

  it('should start the generation', async () => {
    await loader.start()
    expect(loader.spinner?.isSpinning).to.be.true
  })

  it('should update the status', async () => {
    const status = 'Updating status'
    await loader.update(status)
    expect(loader.spinner?.isSpinning).to.be.true
    expect(loader.spinner?.text).to.equal(status)
  })

  it('should stop the loader', async () => {
    await loader.start()
    expect(loader.spinner?.isSpinning).to.be.true

    await loader.stop()
    expect(loader.spinner?.isSpinning).to.be.false
  })
})
