import {Project} from './project'
import {Entity} from './entity'
import {ProjectGenerator} from './project-generator'
import {Infrastructure} from './infrastructure'
import {SecurityConfiguration} from './security-configuration'

export interface ProjectDefinition {
  project: Project;
  entities: Entity[];
  generators: ProjectGenerator[];
  workingDirectory: string;
  infrastructure?: Infrastructure;
  securityConfiguration?: SecurityConfiguration;
}
