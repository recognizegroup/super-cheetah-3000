import {
    DataType,
    EntityCodeProvider as BaseEntityCodeProvider,
    Generator,
    Input,
    ProjectCodeProvider as BaseProjectCodeProvider
} from '@recognizebv/sc3000-generator';
import {EntityCodeProvider} from './providers/entity-code-provider';
import {ProjectCodeProvider} from './providers/project-code-provider';

export class TypescriptAngularFrontendGenerator implements Generator {
    get metaData() {
        return {
            name: "Typescript Angular Frontend",
            description: "A generator for Typescript Angular Frontends",
            version: "0.0.1-alpha",
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
            },
            {
                name: 'backendUrl',
                description: 'The url of the backend',
                type: DataType.string,
                required: true,
            }
        ]
    }
}
