import {Task} from './task'

export interface Habits {
    id?:string,
    name:string,
    listTask?: Task[],
}
