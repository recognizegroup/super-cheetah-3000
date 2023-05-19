import {expect} from 'chai'
import {describe, it} from 'mocha'
import {DataType, Entity, FakerTestDataManager, Field, RelationshipParity} from '../../src'

describe('faker test data manager', () => {
  const otherEntity = {
    name: 'OtherEntity',
    fields: [
      {
        name: 'id',
        type: DataType.integer,
      },
      {
        name: 'name',
        type: DataType.string,
      },
      {
        name: 'description',
        type: DataType.text,
      },
    ],
  }

  const testEntity: Entity = {
    name: 'TestEntity',
    fields: [
      {
        name: 'id',
        type: DataType.integer,
      },
      {
        name: 'name',
        type: DataType.string,
      },
      {
        name: 'description',
        type: DataType.text,
      },
      {
        name: 'is_active',
        type: DataType.boolean,
      },
      {
        name: 'other_entity',
        type: {
          target: otherEntity,
          parity: RelationshipParity.oneToMany,
        },
      },
    ],
  }

  const testDataManager = new FakerTestDataManager()

  it('should generate test data for string field', () => {
    const field: Field = testEntity.fields[1]
    const testData = testDataManager.fetchTestDataForEntity(testEntity, 123)

    expect(testData[field.name]).to.be.a('string')
  })

  it('should generate test data for text field', () => {
    const field: Field = testEntity.fields[2]
    const testData = testDataManager.fetchTestDataForEntity(testEntity, 456)

    expect(testData[field.name]).to.be.a('string')
  })

  it('should generate test data for integer field', () => {
    const field: Field = testEntity.fields[0]
    const testData = testDataManager.fetchTestDataForEntity(testEntity, 789)

    expect(testData[field.name]).to.be.a('number')
  })

  it('should generate test data for boolean field', () => {
    const field: Field = testEntity.fields[3]
    const testData = testDataManager.fetchTestDataForEntity(testEntity, 101)

    expect(testData[field.name]).to.be.a('boolean')
  })

  it('should generate test data for relationship field', () => {
    const field: Field = testEntity.fields[4]
    const testData = testDataManager.fetchTestDataForEntity(testEntity, 234)

    expect(testData[field.name]).to.be.an('object')
    expect(testData[field.name].id).to.equal(234_004_000)
    expect(testData[field.name].name).to.be.a('string')
    expect(testData[field.name].description).to.be.a('string')
  })

  it('should find test data for a given path', () => {
    const testData = {
      nested: {
        array: [
          {
            sample: 'value',
          },
        ],
      },
    }

    expect(testDataManager.findTestDataForPath(testData, 'nested.array[0].sample')).to.equal('value')
  })
})
