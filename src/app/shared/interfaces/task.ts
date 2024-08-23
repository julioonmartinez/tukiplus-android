export interface Task {
    id?:string,
    position?:number,
    name:string,
    completed:boolean,
    status?: 'pending' | 'inProgress' | 'Completed',
    relation:string,
}
