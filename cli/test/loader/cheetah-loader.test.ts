import {expect} from 'chai'
import {readFile} from 'node:fs/promises'
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

  it('should correctly load the content from file', async () => {
    await cheetahLoader.start()
    const expectedContent = await readFile(`${__dirname}/../../src/loader/cheetah.txt`, 'utf-8')
    expect(cheetahLoader.loaderContent).to.equal(expectedContent)
  })
})

