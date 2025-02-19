export interface Manager{
    manager_email: string;
}

export interface Employee{
    name: string;
    created_by_manager_email: string; //check if exists //shouldnt be deletable
    created_date: Date;
    id: string; //unique
    holiday_calendar: string; //check if exists
    manager_set: Manager[]; //check if already exists in the list, if yes-> error
    shift_from: string;
    shift_to: string;
}

export interface Holiday {
    title: string;
    date: Date;
}

export interface Calendar {
    title: string;
    created_by_manager_email: string;
    year: number;
    id: string;
    holidays: Holiday[]; 
}

export interface IUser{
    name: string;
    email: string;
    password: string;
}

export interface Task{
    id : string,
    title : string,
    desc : string,
    hrs_alloted : string,
    created_date: Date,
    deadline_date: Date,
    isDone: boolean,
    working_employ_id : [],
}

export interface Project{
    title: string;
    desc: string;
    created_date: Date;
    deadline_date: Date;
    created_by_manager_email?: string;
    id: string;
    tasksSet: Task[];
    employeeSet: Employee[];
    managerSet: IUser[]; 
}