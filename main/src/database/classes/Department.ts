class Department {
    id: number;
    department_name: string;

    constructor(
        id: number,
        department_name: string
    ) {
        this.id = id;
        this.department_name = department_name;
    }
     printDetails(): void {
        console.log(`ID: ${this.id}`);
        console.log(`Department: ${this.department_name}`);
    }
}

export default Department;