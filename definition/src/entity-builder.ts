import {DataType, Entity, Field, Operations, RelationshipParity} from '@recognizebv/sc3000-generator'

export class EntityBuilder implements Entity {
  public name: string
  public fields: Field[] = []
  public operations?: Operations;

  constructor(name: string) {
    this.name = name
  }

  public addField(name: string, type: DataType & string, options?: { required?: boolean }): EntityBuilder {
    this.fields.push({
      name,
      type,
      required: options?.required ?? false,
    })

    return this
  }

  public addOneToMany(field: string, target: Entity): EntityBuilder {
    this.fields.push({
      name: field,
      type: {
        target: target,
        parity: RelationshipParity.oneToMany,
      },
    })

    return this
  }

  public addManyToOne(field: string, target: Entity): EntityBuilder {
    this.fields.push({
      name: field,
      type: {
        target: target,
        parity: RelationshipParity.manyToOne,
      },
    })

    return this
  }

  public addManyToMany(field: string, target: Entity): EntityBuilder {
    this.fields.push({
      name: field,
      type: {
        target: target,
        parity: RelationshipParity.manyToMany,
      },
    })

    return this
  }

  public addOneToOne(field: string, target: Entity): EntityBuilder {
    this.fields.push({
      name: field,
      type: {
        target: target,
        parity: RelationshipParity.oneToOne,
      },
    })

    return this
  }

  public enableRead(): EntityBuilder {
    this.operations = {
      ...this.operations,
      read: true,
    }

    return this
  }

  public enableCreate(): EntityBuilder {
    this.operations = {
      ...this.operations,
      create: true,
    }

    return this
  }

  public enableUpdate(): EntityBuilder {
    this.operations = {
      ...this.operations,
      update: true,
    }

    return this
  }

  public enableDelete(): EntityBuilder {
    this.operations = {
      ...this.operations,
      delete: true,
    }

    return this
  }

  public enableAllOperations(): EntityBuilder {
    this.operations = {
      read: true,
      create: true,
      update: true,
      delete: true,
    }

    return this
  }

  public disableRead(): EntityBuilder {
    this.operations = {
      ...this.operations,
      read: false,
    }

    return this
  }

  public disableCreate(): EntityBuilder {
    this.operations = {
      ...this.operations,
      create: false,
    }

    return this
  }

  public disableUpdate(): EntityBuilder {
    this.operations = {
      ...this.operations,
      update: false,
    }

    return this
  }

  public disableDelete(): EntityBuilder {
    this.operations = {
      ...this.operations,
      delete: false,
    }

    return this
  }

  public disableAllOperations(): EntityBuilder {
    this.operations = {
      read: false,
      create: false,
      update: false,
      delete: false,
    }

    return this
  }
}
