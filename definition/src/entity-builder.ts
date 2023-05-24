import {DataType, Entity, Field, Operations, RelationshipParity, Role} from '@recognizebv/sc3000-generator'

export type Options = { required?: boolean, sortable?: boolean, searchable?: boolean, mainProperty?: boolean, visibleInList?: boolean }

export class EntityBuilder implements Entity {
  public name: string
  public fields: Field[] = []
  public operations: Operations = {
    create: {enabled: true, roles: []},
    read: {enabled: true, roles: []},
    update: {enabled: true, roles: []},
    delete: {enabled: true, roles: []},
    entity: {roles: []},
  };

  public properties: Record<string, any> = {}

  constructor(name: string) {
    this.name = name
  }

  public withProperty(name: string, value: any): EntityBuilder {
    this.properties[name] = value

    return this
  }

  public addField(name: string, type: DataType & string, options?: Options): EntityBuilder {
    this.fields.push({
      name,
      type,
      required: options?.required ?? false,
      sortable: options?.sortable ?? true,
      searchable: options?.searchable ?? true,
      mainProperty: options?.mainProperty ?? false,
      visibleInList: options?.visibleInList ?? true,
    })

    return this
  }

  public addOneToMany(field: string, target: Entity, options?: Options): EntityBuilder {
    this.fields.push({
      name: field,
      type: {
        target: target,
        parity: RelationshipParity.oneToMany,
      },
      sortable: options?.sortable ?? true,
      searchable: options?.searchable ?? true,
      mainProperty: options?.mainProperty ?? false,
      visibleInList: options?.visibleInList ?? true,
    })

    return this
  }

  public addManyToOne(field: string, target: Entity, options?: Options): EntityBuilder {
    this.fields.push({
      name: field,
      type: {
        target: target,
        parity: RelationshipParity.manyToOne,
      },
      sortable: options?.sortable ?? true,
      searchable: options?.searchable ?? true,
      mainProperty: options?.mainProperty ?? false,
      visibleInList: options?.visibleInList ?? true,
    })

    return this
  }

  public addManyToMany(field: string, target: Entity, options?: Options): EntityBuilder {
    this.fields.push({
      name: field,
      type: {
        target: target,
        parity: RelationshipParity.manyToMany,
      },
      sortable: options?.sortable ?? true,
      searchable: options?.searchable ?? true,
      mainProperty: options?.mainProperty ?? false,
      visibleInList: options?.visibleInList ?? true,
    })

    return this
  }

  public addOneToOne(field: string, target: Entity, options?: Options): EntityBuilder {
    this.fields.push({
      name: field,
      type: {
        target: target,
        parity: RelationshipParity.oneToOne,
      },
      sortable: options?.sortable ?? true,
      searchable: options?.searchable ?? true,
      mainProperty: options?.mainProperty ?? false,
      visibleInList: options?.visibleInList ?? true,
    })

    return this
  }

  public enableRead(): EntityBuilder {
    this.operations.read.enabled = true

    return this
  }

  public enableCreate(): EntityBuilder {
    this.operations.create.enabled = true

    return this
  }

  public enableUpdate(): EntityBuilder {
    this.operations.update.enabled = true

    return this
  }

  public enableDelete(): EntityBuilder {
    this.operations.delete.enabled = true

    return this
  }

  public enableAllOperations(): EntityBuilder {
    this.enableRead()
    this.enableCreate()
    this.enableUpdate()
    this.enableDelete()

    return this
  }

  public disableRead(): EntityBuilder {
    this.operations.read.enabled = false

    return this
  }

  public disableCreate(): EntityBuilder {
    this.operations.create.enabled = false

    return this
  }

  public disableUpdate(): EntityBuilder {
    this.operations.update.enabled = false

    return this
  }

  public disableDelete(): EntityBuilder {
    this.operations.delete.enabled = false

    return this
  }

  public disableAllOperations(): EntityBuilder {
    this.disableRead()
    this.disableCreate()
    this.disableUpdate()
    this.disableDelete()

    return this
  }

  public requireReadRole(role: Role): EntityBuilder {
    this.operations.read.roles.push(role)

    return this
  }

  public requireCreateRole(role: Role): EntityBuilder {
    this.operations.create.roles.push(role)

    return this
  }

  public requireUpdateRole(role: Role): EntityBuilder {
    this.operations.update.roles.push(role)

    return this
  }

  public requireDeleteRole(role: Role): EntityBuilder {
    this.operations.delete.roles.push(role)

    return this
  }

  public requireReadRoles(...roles: Role[]): EntityBuilder {
    this.operations.read.roles = [...roles, ...this.operations.read.roles]

    return this
  }

  public requireCreateRoles(...roles: Role[]): EntityBuilder {
    this.operations.create.roles = [...roles, ...this.operations.create.roles]

    return this
  }

  public requireUpdateRoles(...roles: Role[]): EntityBuilder {
    this.operations.update.roles = [...roles, ...this.operations.update.roles]

    return this
  }

  public requireDeleteRoles(...roles: Role[]): EntityBuilder {
    this.operations.delete.roles = [...roles, ...this.operations.delete.roles]

    return this
  }

  public requireRolesForEntity(...roles: Role[]): EntityBuilder {
    this.operations.entity.roles = [...roles, ...this.operations.entity.roles]

    return this
  }

  public requireRoleForEntity(role: Role): EntityBuilder {
    this.operations.entity.roles.push(role)

    return this
  }
}
