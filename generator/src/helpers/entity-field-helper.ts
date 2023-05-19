import {Entity} from '../models/entity'
import {RelationshipParity} from '../enums/relationship-parity'
import {Field} from '../models/field'

export class EntityFieldHelper {
  public static flattenEntityFieldsForTestResults(entity: Entity, prefix = '', collectionFields = 1): { name: string, field: Field }[] {
    const fields: { name: string, field: Field }[] = []

    for (const field of entity.fields) {
      if (typeof field.type === 'string') {
        fields.push({name: `${prefix}${field.name}`, field})
      } else if (field.type.parity === RelationshipParity.manyToOne || field.type.parity === RelationshipParity.oneToMany) {
        fields.push(...this.flattenEntityFieldsForTestResults(field.type.target, `${prefix}${field.name}.`))
      } else {
        for (let i = 0; i < collectionFields; i++) {
          fields.push(...this.flattenEntityFieldsForTestResults(field.type.target, `${prefix}${field.name}[${i}].`))
        }
      }
    }

    return fields
  }

  public static findRelatedEntities(entity: Entity, base: { path: string, entity: Entity }[] = [], prefix = '', collectionFields = 1): { path: string, entity: Entity }[] {
    for (const field of entity.fields) {
      if (typeof field.type !== 'string') {
        const target = field.type.target
        const exists = base.some(item => item.entity.name === target.name)

        if (!exists) {
          base.push({
            path: `${prefix}${field.name}`,
            entity: target,
          })

          if (field.type.parity === RelationshipParity.manyToOne || field.type.parity === RelationshipParity.oneToMany) {
            this.findRelatedEntities(field.type.target, base, `${prefix}${field.name}.`)
          } else {
            for (let i = 0; i < collectionFields; i++) {
              this.findRelatedEntities(field.type.target, base, `${prefix}${field.name}[${i}].`)
            }
          }
        }
      }
    }

    return base.reverse()
  }
}
