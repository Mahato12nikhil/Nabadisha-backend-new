export interface IEvent{
    name: string;
    description:string,
    eventImages:string[],
    startDate: number;
    endDate:number,
    eventManagement: IEventManagement,
    createdAt:number,
    updatedAt:number,
    createdBy:string,
    updatedBy:string,
}
export interface IEventManagement{
    president:string,
    treasurers:string,
    secretary:string,
    vice_president:string,
    vice_secretary:string
}