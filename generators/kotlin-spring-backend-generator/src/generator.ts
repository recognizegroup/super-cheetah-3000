import {EntityCodeProvider as BaseEntityCodeProvider, Generator, GeneratorMetaData, ProjectCodeProvider as BaseProjectCodeProvider} from '@recognizebv/sc3000-generator';
import { EntityCodeProvider } from './providers/entity-code-provider';
import { ProjectCodeProvider } from './providers/project-code-provider';

export class KotlinSpringBackendGenerator implements Generator {
    metaData = {
        name: "Kotlin Spring Backend",
        description: "A generator for Kotlin Spring Backends",
        version: "0.0.1-alpha",
        authors: ["Recognize", "Bart Wesselink"],
        templateRoot: __dirname + "/../templates/",
    }
    entityCodeProvider: EntityCodeProvider = new EntityCodeProvider(this);
    projectCodeProvider: ProjectCodeProvider = new ProjectCodeProvider(this);
}