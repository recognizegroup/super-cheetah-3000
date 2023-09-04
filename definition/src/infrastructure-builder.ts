import {
  Database, DatabaseType,
  Infrastructure,
  Network,
  Service, Storage,
} from '@recognizebv/sc3000-generator'

export class InfrastructureBuilder implements Infrastructure {
  public network?: Network;
  public storages: Storage[] = []
  public services: Service[]  = []
  public databases: Database[] = []

  public withNetwork(ipRange: string): InfrastructureBuilder {
    if (this.network) throw new Error('Network already set')

    this.network = {ipRange}
    return this
  }

  public withStorage(name: string) {
    this.storages.push({name})
    return this
  }

  public withService(name: string) {
    this.services.push({name})
    return this
  }

  public withDatabase(type: DatabaseType, name: string) {
    this.databases.push({type, name})
    return this
  }
}
