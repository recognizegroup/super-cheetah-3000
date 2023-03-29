import { Filesystem } from "../io/filesystem";
import { TemplateEngine } from "../templating/template-engine";
import { TestDataManager } from "../test-data/test-data-manager";
import { Project } from "./project";

export interface Context {
    project: Project;
    filesystem: Filesystem;
    templateEngine: TemplateEngine;
    testData: TestDataManager;
}