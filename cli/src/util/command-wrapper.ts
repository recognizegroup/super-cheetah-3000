
import util from 'node:util'
import {exec as originalExec} from 'node:child_process'

const exec = util.promisify(originalExec)

export {exec}
