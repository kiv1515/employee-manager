"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Department {
    constructor(id, department_name) {
        this.id = id;
        this.department_name = department_name;
    }
    printDetails() {
        console.log(`ID: ${this.id}`);
        console.log(`Department: ${this.department_name}`);
    }
}
exports.default = Department;