const express = require("express");


const { EmployeeModel } = require("../models/employees.model")
const dashboardRouter = express.Router()

dashboardRouter.post("/employees", async (req, res) => {
    const { firstname, lastname, email, department, salary } = req.body
    if (!firstname || !lastname || !email || !department || !salary) {
        return res.status(401).json({ message: "Invalid Credentials" })
    }
    try {
        delete req.body.id
        // console.log(req.body)
        const employee = new EmployeeModel(req.body)
        await employee.save()
        return res.status(201).json({ message: "Employee Created Successfully" })
    } catch (error) {
        console.log(error)
    }
})
dashboardRouter.get("/employees", async (req, res) => {
    try {
        let condition = {}
        let query = EmployeeModel.find(condition);
        let totalEmployeesQuery = EmployeeModel.find(condition);
        if (req.query._page && req.query._limit) {
            const pageSize = req.query._limit;
            const page = req.query._page;
            query = query.skip(pageSize * (page - 1)).limit(pageSize);
        }
        const totalEmployees = await totalEmployeesQuery.count().exec();
        const employees = await query.exec();
        return res.status(200).json({ message: "All Employee", employees, totalCount: totalEmployees })
    } catch (error) {
        console.log(error)
    }
})

dashboardRouter.delete("/employees/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(401).json({ message: "Invalid Credentials" })
    }
    try {
        await EmployeeModel.findByIdAndDelete(id)
        return res.status(201).json({ message: "Employee Deleted Successfully" })
    } catch (error) {
        console.log(error)
    }
})
dashboardRouter.patch("/employees/:id", async (req, res) => {
    const { firstname, lastname, email, department, salary } = req.body;
    const { id } = req.params;
    if (!firstname || !lastname || !email || !department || !salary || !id) {
        return res.status(401).json({ message: "Invalid Credentials" })
    }
    try {
        await EmployeeModel.findByIdAndUpdate(id, { ...req.body }, { new: true })
        return res.status(201).json({ message: "Employee Edited Successfully" })
    } catch (error) {
        console.log(error)
    }
})

module.exports = {
    dashboardRouter
}
