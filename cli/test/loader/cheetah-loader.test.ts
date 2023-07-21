import {expect} from 'chai'
import {CheetahLoader} from '../../src/loader/cheetah-loader'

describe('CheetahLoader', () => {
  let cheetahLoader: CheetahLoader

  beforeEach(() => {
    cheetahLoader = new CheetahLoader()
  })

  afterEach(async () => {
    await cheetahLoader.stop()
  })

  it('should start the loader', async () => {
    await cheetahLoader.start()
    expect(cheetahLoader.interval).to.not.be.undefined
  })

  it('should stop the loader', async () => {
    await cheetahLoader.start()
    await cheetahLoader.stop()
    expect(cheetahLoader.interval).to.be.undefined
  })
})

