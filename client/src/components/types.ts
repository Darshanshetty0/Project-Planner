

export interface Manager{
    manager_email: string;
}

export interface Employee{
    name: string;
    created_by_manager?: string; //check if exists //shouldnt be deletable
    created_date: Date;
    id?: string; //unique
    _id?:string;
    holiday_calendar: string; //check if exists
    manager_set: string[]; //check if already exists in the list, if yes-> error
    shift_from: string;
    shift_to: string;
}

export interface Holiday{
    title: string;
    date: Date;
}

export interface Calendar{
    title: string;
    created_by_manager_email: string;
    year: number;
    id: string;
    _id?: string; 
    holidays: Holiday[]; 
}

export interface IUser{
    id?:string;
    _id?: string;
    name: string;
    email: string;
    password?: string;
}

export interface Task{
    id : string,
    title : string,
    desc : string,
    hrs_alloted : string,
    created_date: Date,
    deadline_date: Date,
    isDone: boolean,
    working_employ_id :[],
}

export interface Project{
    _id?: string;
    title: string;
    desc: string;
    created_date: Date;
    deadline_date: Date;
    created_by_manager?: string;
    id: string;
    tasksSet: Task[];
    employeeSet:[];
    managerSet:string[]; 
}