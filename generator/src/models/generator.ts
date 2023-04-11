import {EntityCodeProvider} from '../providers/entity-code-provider'
import {GeneratorMetaData} from './generator-meta-data'
import {ProjectCodeProvider} from '../providers/project-code-provider'

export interface Generator {
    metaData: GeneratorMetaData;
    entityCodeProvider: EntityCodeProvider | undefined;
    projectCodeProvider: ProjectCodeProvider | undefined;
}
