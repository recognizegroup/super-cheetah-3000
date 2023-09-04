import {EntityCodeProvider} from '../providers/entity-code-provider'
import {GeneratorMetaData} from './generator-meta-data'
import {ProjectCodeProvider} from '../providers/project-code-provider'
import {Input} from './input'
import {PreFlightViolation} from './pre-flight-violation'
import {InfrastructureCodeProvider} from '../providers/infrastructure-code-provider'

export interface Generator {
    readonly metaData: GeneratorMetaData;
    readonly entityCodeProvider: EntityCodeProvider | undefined;
    readonly projectCodeProvider: ProjectCodeProvider | undefined;
    infrastructureCodeProvider?: InfrastructureCodeProvider;
    readonly inputs: Input[];
    performPreFlightChecks?(): Promise<PreFlightViolation[]>;
}
