class Employee {
    id: number;
    first_name: string;
    last_name: string;
    role_id: number;
    manager_id: number;

    constructor(
        id: number,
        first_name: string,
        last_name: string,
        role_id: number,
        manager_id: number

    ) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.role_id = role_id;
        this.manager_id = manager_id;

    }
        printDetails(): void {
            console.log(`ID: ${this.id}`);
            console.log(`First Name: ${this.first_name}`);
            console.log(`Last Name: ${this.last_name}`);
            console.log(`Role: ${this.role_id}`);
            console.log(`Manager: ${this.manager_id}`);
        }
}

export default Employee;