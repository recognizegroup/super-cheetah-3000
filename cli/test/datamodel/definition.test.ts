import {constants, promises as fs} from 'node:fs'
import {expect} from 'chai'
import * as definition from '../../src/datamodel/definition'
import * as importWrapper from '../../src/util/import-wrapper'
import sinon from 'sinon'
import ts from 'typescript'
import nodePath from 'node:path'
import temp from 'temp'
import * as execWrapper from '../../src/util/command-wrapper'

describe('project definition', () => {
  describe('check definition file exists in directory', () => {
    let sandbox: sinon.SinonSandbox

    beforeEach(() => {
      sandbox = sinon.createSandbox()
    })

    it('should throw an error if the definition file does not exist', async () => {
      const directory = '/path/to/nonexistent/directory'
      const accessStub = sandbox.stub(fs, 'access')
      accessStub.withArgs('/path/to/nonexistent/directory/sc3000.definition.ts', constants.F_OK).throws(new Error('Sample error'))

      try {
        await definition.checkDefinitionFileExistsInDirectory(directory)
        expect.fail('Expected an error to be thrown')
      } catch (error) {
        expect((error as Error).message).to.equal('Definition file not found at /path/to/nonexistent/directory/sc3000.definition.ts')
      }

      accessStub.restore()
    })

    it('should not throw an error if the definition file exists', async () => {
      const directory = '/path/to/existing/directory'
      const accessStub = sandbox.stub(fs, 'access')
      accessStub.withArgs('/path/to/existing/directory/sc3000.definition.ts', constants.F_OK).resolves()

      await definition.checkDefinitionFileExistsInDirectory(directory)
      sinon.assert.calledOnceWithExactly(accessStub, '/path/to/existing/directory/sc3000.definition.ts', constants.F_OK)
      accessStub.restore()
    })
  })

  describe('check definition file exists in current directory', () => {
    let sandbox: sinon.SinonSandbox

    beforeEach(() => {
      sandbox = sinon.createSandbox()
    })

    it('should call checkDefinitionFileExistsInDirectory with the current working directory', async () => {
      const cwdStub = sandbox.stub(process, 'cwd').returns('/path/to/current/directory')
      const checkDefinitionFileExistsInDirectoryStub = sinon.stub(definition, 'checkDefinitionFileExistsInDirectory')

      await definition.checkDefinitionFileExistsInCurrentDirectory()
      sinon.assert.calledOnceWithExactly(checkDefinitionFileExistsInDirectoryStub, '/path/to/current/directory')

      cwdStub.restore()
      checkDefinitionFileExistsInDirectoryStub.restore()
    })
  })

  describe('parse definition file', () => {
    let sandbox: sinon.SinonSandbox

    beforeEach(() => {
      sandbox = sinon.createSandbox()
    })

    afterEach(() => {
      sandbox.restore()
    })

    it('should throw an error if the definition file does not export anything', async () => {
      const path = '/path/to/definition/file'
      const compiled = '/path/to/compiled/file'
      const defined = null

      sandbox.stub(definition, 'compileDefinitionFileFromTypeScript').resolves(compiled)
      sandbox.stub(definition, 'getDefinitionFilePath').returns(path)
      sandbox.stub(importWrapper, 'importScript').resolves({default: defined})

      try {
        await definition.parseDefinitionFile(path)
        expect.fail('Expected an error to be thrown')
      } catch (error) {
        expect((error as Error).message).to.equal('Definition file does not export anything')
      }
    })

    it('should throw an error if the definition file does not export any entities', async () => {
      const path = '/path/to/definition/file'
      const compiled = '/path/to/compiled/file'
      const defined = {entities: null, project: {}}

      sandbox.stub(definition, 'compileDefinitionFileFromTypeScript').resolves(compiled)
      sandbox.stub(definition, 'getDefinitionFilePath').returns(path)
      sandbox.stub(importWrapper, 'importScript').resolves({default: defined})

      try {
        await definition.parseDefinitionFile(path)
        expect.fail('Expected an error to be thrown')
      } catch (error) {
        expect((error as Error).message).to.equal('Definition file does not export any entities')
      }
    })

    it('should throw an error if the definition file does not export a project', async () => {
      const path = '/path/to/definition/file'
      const compiled = '/path/to/compiled/file'
      const defined = {entities: [], project: null}

      sandbox.stub(definition, 'compileDefinitionFileFromTypeScript').resolves(compiled)
      sandbox.stub(definition, 'getDefinitionFilePath').returns(path)
      sandbox.stub(importWrapper, 'importScript').resolves({default: defined})

      try {
        await definition.parseDefinitionFile(path)
        expect.fail('Expected an error to be thrown')
      } catch (error) {
        expect((error as Error).message).to.equal('Definition file does not export a project')
      }
    })

    it('should return the parsed project definition if the definition file is valid', async () => {
      const path = '/path/to/definition/file'
      const compiled = '/path/to/compiled/file'
      const defined = {entities: [], project: {}}

      sandbox.stub(definition, 'compileDefinitionFileFromTypeScript').resolves(compiled)
      sandbox.stub(definition, 'getDefinitionFilePath').returns(path)
      sandbox.stub(importWrapper, 'importScript').resolves({default: defined})

      const result = await definition.parseDefinitionFile(path)
      expect(result).to.deep.equal(defined)
    })
  })

  describe('compile definition file from TypeScript', () => {
    let sandbox: sinon.SinonSandbox

    beforeEach(() => {
      sandbox = sinon.createSandbox()
    })

    afterEach(() => {
      sandbox.restore()
    })

    it('should throw an error if the compilation fails', async () => {
      const path = '/path/to/definition/file'
      const output = '/path/to/output/directory'

      sandbox.stub(nodePath, 'join').returns(output)
      sandbox.stub(temp, 'mkdirSync').returns(output)
      sandbox.stub(execWrapper, 'exec').resolves()
      sandbox.stub(ts, 'createProgram').throws(new Error('Compilation failed'))

      try {
        await definition.compileDefinitionFileFromTypeScript(path)
        // Fail the test if an error is not thrown
        expect.fail('Expected error was not thrown')
      } catch (error) {
        expect((error as Error).message).to.equal('Failed to compile definition file to JavaScript')
      }
    })

    it('should return the path of the compiled definition file if the compilation succeeds', async () => {
      const path = '/path/to/definition/file'
      const output = '/path/to/output/directory'
      const compiled = '/path/to/output/directory/sc3000.definition.js'

      sandbox.stub(nodePath, 'join').returns(output)
      sandbox.stub(temp, 'mkdirSync').returns(output)
      sandbox.stub(execWrapper, 'exec').resolves()
      sandbox.stub(ts, 'createProgram').returns({emit: () => ({emitSkipped: false})} as any)

      const result = await definition.compileDefinitionFileFromTypeScript(path)
      expect(result).to.equal(compiled)
    })
  })

  describe('parse definition file in current directory', () => {
    let sandbox: sinon.SinonSandbox

    beforeEach(() => {
      sandbox = sinon.createSandbox()
    })

    it('should call checkDefinitionFileExistsInDirectory with the current working directory', async () => {
      const cwdStub = sandbox.stub(process, 'cwd').returns('/path/to/current/directory')
      const parseDefinitionFileStub = sinon.stub(definition, 'parseDefinitionFile')

      await definition.parseDefinitionFileInCurrentDirectory()
      sinon.assert.calledOnceWithExactly(parseDefinitionFileStub, '/path/to/current/directory/sc3000.definition.ts')

      cwdStub.restore()
      parseDefinitionFileStub.restore()
    })
  })
})
