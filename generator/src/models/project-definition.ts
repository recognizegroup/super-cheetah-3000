import {Project} from './project'
import {Entity} from './entity'
import {ProjectGenerator} from './project-generator'

export interface ProjectDefinition {
  project: Project;
  entities: Entity[];
  generators: ProjectGenerator[];
  workingDirectory: string;
}
