class Role {
    id: number;
    title: string;
    salary: number;
    department_id: number;

    constructor(
        id: number,
        title: string,
        salary: number,
        department_id: number
    ) {
        this.id = id;
        this.title = title;
        this.salary = salary;
        this.department_id = department_id;
    }
    
     printDetails(): void {
        console.log(`ID: ${this.id}`);
        console.log(`Title: ${this.title}`);
        console.log(`Salary: ${this.salary}`);
        console.log(`Department ID: ${this.department_id}`);
        
    }
}
export default Role;