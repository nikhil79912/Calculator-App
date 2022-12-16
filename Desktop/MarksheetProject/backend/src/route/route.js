const express = require('express');
const route = express.Router();
const teacherController = require("../controller/teacherController");
const studentController = require('../controller/studentController')
const Authentication = require('../Middleware/authentication')
const authorization = require('../Middleware/authorization')

route.post("/register", teacherController.createStudent)

route.post("/teacherLogin", teacherController.teacherLogin)

route.post("/studentData", Authentication.Authenticate, studentController.studentData)

route.get("/studentData/:teacherId", Authentication.Authenticate, studentController.getStudentData)

// route.get("/studentData", studentController.getStudentData)

// route.get("/studentData/:userId"  , studentController.getStudentData)
route.put("/studentData/:studentId", Authentication.Authenticate, authorization.Authorization, studentController.editStudent)

route.delete("/student/:studentId", Authentication.Authenticate, authorization.Authorization, studentController.deleatByid)


module.exports = route;