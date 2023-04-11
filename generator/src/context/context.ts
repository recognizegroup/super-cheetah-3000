import {Project} from '../models/project'
import {Filesystem} from '../io/filesystem'
import {TemplateEngine} from '../templating/template-engine'
import {TestDataManager} from '../test-data/test-data-manager'

export class Context {
    private _project: Project;
    private _filesystem: Filesystem;
    private _templateEngine: TemplateEngine;
    private _testData: TestDataManager;

    constructor(object: { project: Project, filesystem: Filesystem, templateEngine: TemplateEngine, testData: TestDataManager }) {
      this._project = object.project
      this._filesystem = object.filesystem
      this._templateEngine = object.templateEngine
      this._testData = object.testData
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

    get templateEngine(): TemplateEngine {
      return this._templateEngine
    }

    set templateEngine(value: TemplateEngine) {
      this._templateEngine = value
    }

    get testData(): TestDataManager {
      return this._testData
    }

    set testData(value: TestDataManager) {
      this._testData = value
    }

    buildVariables(): { [key: string]: any } {
      return {
        project: this.project,
        testData: this.testData,
      }
    }
}
