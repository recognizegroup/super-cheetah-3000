import {Project} from '@recognizebv/sc3000-generator'

export class ProjectBuilder implements Project {
  client = ''
  name = ''
  team = ''

  public withClient(client: string): ProjectBuilder {
    this.client = client
    return this
  }

  public withName(name: string): ProjectBuilder {
    this.name = name
    return this
  }

  public withTeam(team: string): ProjectBuilder {
    this.team = team
    return this
  }
}
