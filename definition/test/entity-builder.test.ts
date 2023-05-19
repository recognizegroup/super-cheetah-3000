import {expect} from 'chai'
import {EntityBuilder} from '../src/entity-builder'
import {DataType, RelationshipParity} from '@recognizebv/sc3000-generator'

describe('entity builder', () => {
  let entityBuilder: EntityBuilder

  beforeEach(() => {
    entityBuilder = new EntityBuilder('User')
  })

  it('should set the entity name', () => {
    expect(entityBuilder.name).to.equal('User')
  })

  it('should add a field', () => {
    const fieldName = 'username'
    const fieldType = DataType.string
    const result = entityBuilder.addField(fieldName, fieldType)

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.fields).to.deep.equal([{name: fieldName, type: fieldType, required: false}])
  })

  it('should add a required field', () => {
    const fieldName = 'email'
    const fieldType = DataType.string
    const options = {required: true}
    const result = entityBuilder.addField(fieldName, fieldType, options)

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.fields).to.deep.equal([{name: fieldName, type: fieldType, required: true}])
  })

  it('should add a one-to-many relationship', () => {
    const fieldName = 'posts'
    const targetEntity = new EntityBuilder('Post')
    const result = entityBuilder.addOneToMany(fieldName, targetEntity)

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.fields).to.deep.equal([
      {name: fieldName, type: {target: targetEntity, parity: RelationshipParity.oneToMany}},
    ])
  })

  it('should add a many-to-one relationship', () => {
    const fieldName = 'author'
    const targetEntity = new EntityBuilder('User')
    const result = entityBuilder.addManyToOne(fieldName, targetEntity)

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.fields).to.deep.equal([
      {name: fieldName, type: {target: targetEntity, parity: RelationshipParity.manyToOne}},
    ])
  })

  it('should add a many-to-many relationship', () => {
    const fieldName = 'tags'
    const targetEntity = new EntityBuilder('Tag')
    const result = entityBuilder.addManyToMany(fieldName, targetEntity)

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.fields).to.deep.equal([
      {name: fieldName, type: {target: targetEntity, parity: RelationshipParity.manyToMany}},
    ])
  })

  it('should add a one-to-one relationship', () => {
    const fieldName = 'profile'
    const targetEntity = new EntityBuilder('Profile')
    const result = entityBuilder.addOneToOne(fieldName, targetEntity)

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.fields).to.deep.equal([
      {name: fieldName, type: {target: targetEntity, parity: RelationshipParity.oneToOne}},
    ])
  })

  it('should enable read operation', () => {
    const result = entityBuilder.enableRead()

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.operations.read.enabled).to.equal(true)
  })

  it('should enable create operation', () => {
    const result = entityBuilder.enableCreate()

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.operations.create.enabled).to.equal(true)
  })

  it('should enable update operation', () => {
    const result = entityBuilder.enableUpdate()

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.operations.update.enabled).to.equal(true)
  })

  it('should enable delete operation', () => {
    const result = entityBuilder.enableDelete()

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.operations.read.enabled).to.equal(true)
  })

  it('should enable all operations', () => {
    const result = entityBuilder.enableAllOperations()

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.operations.create.enabled).to.equal(true)
    expect(entityBuilder.operations.read.enabled).to.equal(true)
    expect(entityBuilder.operations.update.enabled).to.equal(true)
    expect(entityBuilder.operations.delete.enabled).to.equal(true)
  })

  it('should disable read operation', () => {
    const result = entityBuilder.disableRead()

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.operations.read.enabled).to.equal(false)
  })

  it('should disable create operation', () => {
    const result = entityBuilder.disableCreate()

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.operations.create.enabled).to.equal(false)
  })

  it('should disable update operation', () => {
    const result = entityBuilder.disableUpdate()

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.operations.update.enabled).to.equal(false)
  })

  it('should disable delete operation', () => {
    const result = entityBuilder.disableDelete()

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.operations.delete.enabled).to.equal(false)
  })

  it('should disable all operations', () => {
    const result = entityBuilder.disableAllOperations()

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.operations.create.enabled).to.equal(false)
    expect(entityBuilder.operations.read.enabled).to.equal(false)
    expect(entityBuilder.operations.update.enabled).to.equal(false)
    expect(entityBuilder.operations.delete.enabled).to.equal(false)
  })

  it('should require a role for read operation', () => {
    const result = entityBuilder.requireReadRole('admin')

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.operations.read.roles).to.deep.equal(['admin'])
  })

  it('should require a roles for read operation', () => {
    const result = entityBuilder.requireReadRoles('admin', 'project-manager')

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.operations.read.roles).to.deep.equal(['admin', 'project-manager'])
  })

  it('should require a role for create operation', () => {
    const result = entityBuilder.requireCreateRole('admin')

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.operations.create.roles).to.deep.equal(['admin'])
  })

  it('should require a roles for create operation', () => {
    const result = entityBuilder.requireCreateRoles('admin', 'project-manager')

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.operations.create.roles).to.deep.equal(['admin', 'project-manager'])
  })

  it('should require a role for update operation', () => {
    const result = entityBuilder.requireUpdateRole('admin')

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.operations.update.roles).to.deep.equal(['admin'])
  })

  it('should require a roles for update operation', () => {
    const result = entityBuilder.requireUpdateRoles('admin', 'project-manager')

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.operations.update.roles).to.deep.equal(['admin', 'project-manager'])
  })

  it('should require a role for delete operation', () => {
    const result = entityBuilder.requireDeleteRole('admin')

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.operations.delete.roles).to.deep.equal(['admin'])
  })

  it('should require a roles for delete operation', () => {
    const result = entityBuilder.requireDeleteRoles('admin', 'project-manager')

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.operations.delete.roles).to.deep.equal(['admin', 'project-manager'])
  })

  it('should require role for all operations', () => {
    const result = entityBuilder.requireRoleForEntity('admin')

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.operations.entity.roles).to.deep.equal(['admin'])
  })

  it('should require roles for all operations', () => {
    const result = entityBuilder.requireRolesForEntity('admin', 'project-manager')

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.operations.entity.roles).to.deep.equal(['admin', 'project-manager'])
  })
})
