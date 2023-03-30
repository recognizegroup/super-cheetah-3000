import {expect, test} from '@oclif/test'

describe('generate', () => {
  test
  .stdout()
  .command(['generate'])
  .it('runs generate cmd', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })
})
