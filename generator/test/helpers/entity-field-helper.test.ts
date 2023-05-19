import {expect} from 'chai'
import {DataType, Entity, RelationshipParity} from '../../src'
import {EntityFieldHelper} from '../../src/helpers/entity-field-helper'

describe('entity field helper', () => {
  it('should flatten entity fields with prefix', () => {
    const entity: Entity = {
      name: 'EntityA',
      fields: [
        {name: 'field1', type: DataType.string},
        {name: 'field2', type: {parity: RelationshipParity.manyToOne, target: {name: 'EntityB', fields: [
          {name: 'nestedField1', type: DataType.string},
        ]}}},
        {name: 'field3', type: {parity: RelationshipParity.manyToMany, target: {name: 'EntityC', fields: [
          {name: 'nestedField2', type: DataType.string},
        ]}}},
      ],
    }

    const expectedResult = [
      {name: 'field1', field: {name: 'field1', type: DataType.string}},
      {name: 'field2.nestedField1', field: {name: 'nestedField1', type: 'string'}},
      {name: 'field3[0].nestedField2', field: {name: 'nestedField2', type: 'string'}},
    ]

    const result = EntityFieldHelper.flattenEntityFieldsForTestResults(entity, '', 1)
    expect(result).to.deep.equal(expectedResult)
  })

  it('should find related entities', () => {
    const entity: Entity = {
      name: 'EntityA',
      fields: [
        {name: 'field1', type: DataType.string},
        {name: 'field2', type: {parity: RelationshipParity.manyToOne, target: {name: 'EntityB', fields: [
          {name: 'nestedField1', type: DataType.string},
        ]}}},
      ],
    }

    const expectedResult = [
      {path: 'field2', entity: {name: 'EntityB', fields: [
        {name: 'nestedField1', type: 'string'},
      ]}},
    ]

    const result = EntityFieldHelper.findRelatedEntities(entity, [], '', 1)
    expect(result).to.deep.equal(expectedResult)
  })
})
