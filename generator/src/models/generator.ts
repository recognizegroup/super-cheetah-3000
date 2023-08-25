import {EntityCodeProvider} from '../providers/entity-code-provider'
import {GeneratorMetaData} from './generator-meta-data'
import {ProjectCodeProvider} from '../providers/project-code-provider'
import {Input} from './input'
import {PreFlightViolation} from './pre-flight-violation'

export interface Generator {
    readonly metaData: GeneratorMetaData;
    readonly entityCodeProvider: EntityCodeProvider | undefined;
    readonly projectCodeProvider: ProjectCodeProvider | undefined;
    readonly inputs: Input[];
    performPreFlightChecks?(): Promise<PreFlightViolation[]>;
}
