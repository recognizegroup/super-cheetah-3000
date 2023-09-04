import {Network} from './network'
import {Storage} from './storage'
import {Service} from './service'
import {Database} from './database'

export interface Infrastructure {
  network?: Network;
  storages: Storage[];
  services: Service[];
  databases: Database[];
}
