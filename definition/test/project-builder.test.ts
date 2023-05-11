import {expect} from 'chai'
import {ProjectBuilder} from '../src/project-builder'

describe('project builder', () => {
  let projectBuilder: ProjectBuilder

  beforeEach(() => {
    projectBuilder = new ProjectBuilder()
  })

  it('should set the client', () => {
    const client = 'Acme Corp'
    const result = projectBuilder.withClient(client)

    expect(result).to.equal(projectBuilder)
    expect(projectBuilder.client).to.equal(client)
  })

  it('should set the name', () => {
    const name = 'Awesome Project'
    const result = projectBuilder.withName(name)

    expect(result).to.equal(projectBuilder)
    expect(projectBuilder.name).to.equal(name)
  })

  it('should set the team', () => {
    const team = 'Development Team'
    const result = projectBuilder.withTeam(team)

    expect(result).to.equal(projectBuilder)
    expect(projectBuilder.team).to.equal(team)
  })
})
