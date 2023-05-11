import {EntityCodeProvider} from '../providers/entity-code-provider'
import {GeneratorMetaData} from './generator-meta-data'
import {ProjectCodeProvider} from '../providers/project-code-provider'
import {Input} from './input'
import {Output} from './output'

export interface Generator {
    readonly metaData: GeneratorMetaData;
    readonly entityCodeProvider: EntityCodeProvider | undefined;
    readonly projectCodeProvider: ProjectCodeProvider | undefined;
    readonly inputs: Input[];
}
