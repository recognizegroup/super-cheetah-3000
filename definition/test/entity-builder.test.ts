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
    expect(entityBuilder.operations).to.deep.equal({read: true})
  })

  it('should enable create operation', () => {
    const result = entityBuilder.enableCreate()

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.operations).to.deep.equal({create: true})
  })

  it('should enable update operation', () => {
    const result = entityBuilder.enableUpdate()

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.operations).to.deep.equal({update: true})
  })

  it('should enable delete operation', () => {
    const result = entityBuilder.enableDelete()

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.operations).to.deep.equal({delete: true})
  })

  it('should enable all operations', () => {
    const result = entityBuilder.enableAllOperations()

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.operations).to.deep.equal({
      read: true,
      create: true,
      update: true,
      delete: true,
    })
  })

  it('should disable read operation', () => {
    const result = entityBuilder.disableRead()

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.operations).to.deep.equal({read: false})
  })

  it('should disable create operation', () => {
    const result = entityBuilder.disableCreate()

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.operations).to.deep.equal({create: false})
  })

  it('should disable update operation', () => {
    const result = entityBuilder.disableUpdate()

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.operations).to.deep.equal({update: false})
  })

  it('should disable delete operation', () => {
    const result = entityBuilder.disableDelete()

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.operations).to.deep.equal({delete: false})
  })

  it('should disable all operations', () => {
    const result = entityBuilder.disableAllOperations()

    expect(result).to.equal(entityBuilder)
    expect(entityBuilder.operations).to.deep.equal({
      read: false,
      create: false,
      update: false,
      delete: false,
    })
  })
})
