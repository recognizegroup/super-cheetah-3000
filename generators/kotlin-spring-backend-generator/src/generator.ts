import {
    DataType,
    EntityCodeProvider as BaseEntityCodeProvider,
    Generator,
    Input,
    ProjectCodeProvider as BaseProjectCodeProvider
} from '@recognizebv/sc3000-generator';
import {EntityCodeProvider} from './providers/entity-code-provider';
import {ProjectCodeProvider} from './providers/project-code-provider';

export class KotlinSpringBackendGenerator implements Generator {
    get metaData() {
        return {
            name: "@recognizegroup/sc3000-kotlin-spring-backend-generator",
            description: "A generator for Kotlin Spring Backends",
            authors: ["Recognize", "Bart Wesselink"],
            templateRoot: __dirname + "/../templates/",
        }
    }

    get entityCodeProvider(): BaseEntityCodeProvider | undefined {
        return new EntityCodeProvider(this);
    }

    get projectCodeProvider(): BaseProjectCodeProvider | undefined {
        return new ProjectCodeProvider(this);
    }

    get inputs(): Input[] {
        return [
            {
                name: 'directory',
                description: 'The directory to generate the project in',
                type: DataType.string,
                required: true,
            }
        ]
    }
}
