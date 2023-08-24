import {expect} from 'chai'
import sinon from 'sinon'
import {promises as fs} from 'node:fs'
import {LocalFilesystem} from '../../src'
import * as os from 'node:os'

describe('local file system', () => {
  let localFs: LocalFilesystem
  let root: string
  let sandbox: sinon.SinonSandbox
  let directorySeparator: string = '/'

  beforeEach(() => {
    const tempDir = os.tmpdir() // /tmp
    directorySeparator = tempDir.includes('\\') ? '\\' : '/'
    root = tempDir + directorySeparator + 'test' + directorySeparator
    localFs = new LocalFilesystem(root)
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('read', () => {
    it('should read file from disk with correct path', async () => {
      const path = 'file.txt'
      const content = 'Hello, world!'

      const readFileStub = sandbox.stub(fs, 'readFile')
      readFileStub.resolves(Buffer.from(content))

      const result = await localFs.read(path)

      sinon.assert.calledOnce(readFileStub)
      sinon.assert.calledWithExactly(readFileStub, `${root}${path}`)

      expect(result.toString()).to.equal(content)
    })

    it("should reject with error if file doesn't exist", async () => {
      const path = 'non-existent-file.txt'

      const readFileStub = sandbox.stub(fs, 'readFile')
      readFileStub.rejects()

      try {
        await localFs.read(path)
        throw new Error('Expected error was not thrown')
      } catch (error) {
        expect(error).to.be.an.instanceOf(Error)
      }

      sinon.assert.calledOnce(readFileStub)
      sinon.assert.calledWithExactly(readFileStub, `${root}${path}`)
    })
  })

  describe('write', () => {
    const path = 'path/to/file.txt'
    const content = Buffer.from('Hello, World!')
    const permissions = 0o644

    it('should write the content to the specified file path', async () => {
      const writeFileStub = sandbox.stub(fs, 'writeFile')
      await localFs.write(path, content)

      sinon.assert.calledOnceWithExactly(writeFileStub, root + 'path' + directorySeparator + 'to' + directorySeparator + 'file.txt', content)
    })

    it('should set the permissions if provided', async () => {
      const chmodStub = sandbox.stub(fs, 'chmod')
      await localFs.write(path, content, permissions)

      sinon.assert.calledOnceWithExactly(chmodStub, root + 'path' + directorySeparator + 'to' + directorySeparator + 'file.txt', permissions)
    })

    it('should not set the permissions if not provided', async () => {
      const chmodStub = sandbox.stub(fs, 'chmod')
      await localFs.write(path, content)

      sinon.assert.notCalled(chmodStub)
    })

    it('should create the directory if it does not exist', async () => {
      const ensureDirectoryExistsStub = sandbox.stub(localFs, 'ensureDirectoryExistsForFile')

      await localFs.write(path, content)

      ensureDirectoryExistsStub.calledOnceWith('/path/to/root/path/to')
    })

    it('should not create the directory if it already exists', async () => {
      const existsStub = sandbox.stub(localFs as any, 'exists')
      const mkdirStub = sandbox.stub(fs, 'mkdir')

      existsStub.resolves(true)

      await localFs.write(path, content)

      // Check that 'mkdir' was not called
      sinon.assert.notCalled(mkdirStub)
    })
  })

  describe('exists', () => {
    it('should return true if the file exists', async () => {
      const accessStub = sinon.stub(fs, 'access')
      accessStub.resolves()

      const result = await localFs.exists('/path/to/file.txt')

      expect(result).to.be.true

      accessStub.restore()
    })

    it('should return false if the file does not exist', async () => {
      const accessStub = sinon.stub(fs, 'access')
      accessStub.rejects()

      const result = await localFs.exists('/path/to/file.txt')

      expect(result).to.be.false

      accessStub.restore()
    })
  })

  describe('delete', () => {
    it('should delete a file from the filesystem', async () => {
      const unlinkStub = sinon.stub(fs, 'unlink')
      unlinkStub.resolves()

      await localFs.delete('/path/to/file.txt')

      expect(unlinkStub.calledOnceWith(root + 'path' + directorySeparator + 'to' + directorySeparator + 'file.txt')).to.be.true

      unlinkStub.restore()
    })
  })

  describe('copy', () => {
    it('should copy a file from one location to another', async () => {
      const ensureDirectoryExistsForFileStub = sinon.stub(localFs, 'ensureDirectoryExistsForFile')
      ensureDirectoryExistsForFileStub.resolves()

      const copyFileStub = sinon.stub(fs, 'copyFile')

      await localFs.copy('/path/to/file.txt', '/path/to/other/file.txt')

      expect(copyFileStub.calledOnceWith(root + 'path' + directorySeparator + 'to' + directorySeparator + 'file.txt',
        root + 'path' + directorySeparator + 'to' + directorySeparator + 'other' + directorySeparator + 'file.txt')).to.be.true
    })
  })

  describe('list', () => {
    it('should list all files in a directory', async () => {
      const readDirStub = sinon.stub(fs, 'readdir')
      const lstatStub = sinon.stub(fs, 'lstat')

      // First time return a list of 2 files, second time return a list of 0 files
      readDirStub.onFirstCall().resolves(['1/', 'file2.txt'] as any)
      readDirStub.onSecondCall().resolves([])

      // First time return a directory, second time return a file
      lstatStub.onFirstCall().resolves({isDirectory: () => true} as any)
      lstatStub.onSecondCall().resolves({isDirectory: () => false} as any)

      const result = await localFs.list('/path/to/dir')

      expect(result).to.deep.equal([
        'file2.txt',
      ])
    })
  })

  describe('create directory', () => {
    it('should create a directory', async () => {
      const mkdirStub = sinon.stub(fs, 'mkdir')
      mkdirStub.resolves()

      await localFs.createDirectory('/path/to/dir')

      expect(mkdirStub.calledOnceWith(root + 'path' + directorySeparator + 'to' + directorySeparator + 'dir')).to.be.true
    })
  })

  describe('delete directory', () => {
    it('should delete a directory', async () => {
      const rmdirStub = sinon.stub(fs, 'rmdir')
      rmdirStub.resolves()

      await localFs.deleteDirectory('/path/to/dir')

      expect(rmdirStub.calledOnceWith(root + 'path' + directorySeparator + 'to' + directorySeparator + 'dir')).to.be.true
    })
  })

  describe('update permissions', () => {
    it('should update the permissions of a file', async () => {
      const chmodStub = sinon.stub(fs, 'chmod')
      chmodStub.resolves()

      await localFs.updatePermissions('/path/to/file.txt', 0o644)

      expect(chmodStub.calledOnceWith(root + 'path' + directorySeparator + 'to' + directorySeparator + 'file.txt', 0o644)).to.be.true
    })
  })

  describe('fetch permissions', () => {
    it('should fetch the permissions of a file', async () => {
      const statStub = sinon.stub(fs, 'stat')
      statStub.resolves({mode: 0o644} as any)

      const result = await localFs.fetchPermissions('/path/to/file.txt')

      expect(result).to.equal(0o644)
    })
  })
})
