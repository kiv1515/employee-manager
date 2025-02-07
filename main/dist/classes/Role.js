"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Role {
    constructor(id, title, salary, department_id) {
        this.id = id;
        this.title = title;
        this.salary = salary;
        this.department_id = department_id;
    }
    printDetails() {
        console.log(`ID: ${this.id}`);
        console.log(`Title: ${this.title}`);
        console.log(`Salary: ${this.salary}`);
        console.log(`Department ID: ${this.department_id}`);
    }
}
exports.default = Role;