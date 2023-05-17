import {Project} from '../models/project'
import {Filesystem} from '../io/filesystem'
import {TemplateEngine} from '../templating/template-engine'
import {TestDataManager} from '../test-data/test-data-manager'

export class Context {
    private _project: Project;
    private _filesystem: Filesystem;
    private _testData: TestDataManager;
    private _inputs: Record<string, unknown> = {};

    constructor(object: { project: Project, filesystem: Filesystem, testData: TestDataManager, inputs: Record<string, unknown> }) {
      this._project = object.project
      this._filesystem = object.filesystem
      this._testData = object.testData
      this._inputs = object.inputs
    }

    get project(): Project {
      return this._project
    }

    set project(value: Project) {
      this._project = value
    }

    get filesystem(): Filesystem {
      return this._filesystem
    }

    set filesystem(value: Filesystem) {
      this._filesystem = value
    }

    get testData(): TestDataManager {
      return this._testData
    }

    set testData(value: TestDataManager) {
      this._testData = value
    }

    findInputValue<T>(name: string): T | undefined {
      return this._inputs[name] as T
    }

    buildVariables(): { [key: string]: any } {
      return {
        project: this.project,
        testData: this.testData,
      }
    }
}
