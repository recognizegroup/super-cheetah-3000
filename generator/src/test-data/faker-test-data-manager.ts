import {Entity} from '../models/entity'
import {TestDataManager} from './test-data-manager'
import {faker} from '@faker-js/faker'
import {Field} from '../models/field'
import {DataType} from '../enums/data-type'
import {Relationship} from '../models/relationship'

export class FakerTestDataManager implements TestDataManager {
  fetchTestDataForEntity(entity: Entity, seed: number): Record<typeof entity.fields[number]['name'], any> {
    const baseSeed = seed * 1_000_000

    return Object.fromEntries([
      ['id', baseSeed],
      ...entity.fields.map((field, index) => [
        field.name,
        this.generateTestDataForField(field, baseSeed + (index * 1000)),
      ]),
    ])
  }

  findTestDataForPath(testData: Record<string, any>, path: string) {
    return path.split('.').reduce((value, key) => {
      if (key.includes('[')) {
        const [arrayKey, arrayIndex] = key.split('[')
        return value[arrayKey][Number.parseInt(arrayIndex.replace(']', ''), 10)]
      }

      return value[key]
    }, testData)
  }

  private generateTestDataForField(field: Field, seed: number) {
    faker.seed(seed)

    switch (field.type) {
    case DataType.string: {
      return faker.lorem.word()
    }

    case DataType.text: {
      return faker.lorem.paragraph(1)
    }

    case DataType.integer: {
      return faker.number.int()
    }

    case DataType.boolean: {
      return faker.datatype.boolean()
    }

    default: {
      return this.generateForRelationship(field.type as Relationship, seed)
    }
    }
  }

  private generateForRelationship(relationship: Relationship, seed: number): Record<typeof relationship.target.fields[number]['name'], any> {
    const target = relationship.target

    return Object.fromEntries([
      ...target.fields.map((field, index) => [
        field.name,
        this.generateTestDataForField(field, seed + index),
      ]),
      ['id', seed],
    ])
  }
}
