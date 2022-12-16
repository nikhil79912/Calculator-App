const mongoose = require("mongoose");
const marksModel = require("../model/marksModel.js");
const teacherModel = require("../model/teacherModel.js");
const { isValidName} = require("../validation/validation")
const ObjectId = require('mongoose').Types.ObjectId

//---------------------creating students---------------------
const studentData = async (req, res) => {
    try {

        let info = req.body;
        if (Object.keys(info).length == 0) {
            return res.status(400).send({ status: false, message: "Please Provide Student Infomation " })
        }
        const { name, subject, marks, teacherId } = info
        // let id = req.query.teacherId
        // if (!mongoose.Types.ObjectId.isValid(id)) {
        //     return res.status(400).send({ status: false, msg: "userId is not valid" })
        // }


        if (!name) {
            return res.status(400).send({ status: false, message: "Name is mandatory" })
        }

        if (!isValidName(name)) {
            return res.status(400).send({ status: false, message: "Name is invalid" });
        }

        if (!subject) {
            return res.status(400).send({ status: false, message: "subject is mandatory " })

        }
        if (!marks) {
            return res.status(400).send({ status: false, message: "marks is mandatory " })

        }
        if (!teacherId) {
            return res.status(400).send({ status: false, message: "Teacher Id is mandatory " })

        }

        let id = req.body.teacherId
        if (!ObjectId.isValid(id)) return res.status(400).send({ status: false, message: "Teacher id  is not correct" })

        const teacher = await teacherModel.findById(id);
        if (!teacher)
            return res.status(400).send({ status: false, msg: "Teacher Not found" });

        let savedData = await marksModel.create(info)

        let data = {
            name: savedData.name,
            marks: savedData.marks,
            subject: savedData.subject,
            teacherId: savedData.teacherId
        }

        return res.status(201).send({ status: true, data: data })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}

//-----------------------get student data---------------------
// const getStudentData = async (req, res) => {
//     try {
//         let filter = req.query

//         let checkDelete = { isDeleted: false }
//         const { name, subject, ...rest } = filter

        
//         if (Object.keys(filter).length == 0) {
//         let findAll= await marksModel.find(checkDelete)
//         return res.status(200).send({status:true,data:findAll})
//         }
//         // if (Object.keys(rest).length > 0)
//         //     return res.status(400).send({ status: false, message: "Filter By Name and Subject Only" })


//         if (Object.keys(filter).length < 1) {
//             return res.status(404).send({ status: false, message: "Name and Subject Required For Filter" })
//         }

//         if (name) {
//             checkDelete["name"] = name
//         }


//         if (subject) {
//             checkDelete["subject"] = subject
//         }


//         let find = await marksModel.find(checkDelete)

//         if (find.length <= 0) return res.status(404).send({ status: false, message: "no such student exist" })

//         return res.status(200).send({ status: true, data: find })

//     } catch (error) {
//         return res.status(500).send({ status: false, message: error.message })
//     }

// }

const getStudentData = async (req, res) => {
    try {
        let filter = req.query
        let checkDelete = { isDeleted: false }
        const { name, subject, ...rest } = filter

        if (Object.keys(rest).length > 0)
            return res.status(400).send({ status: false, message: "Filter By Name and Subject Only" })


        if (Object.keys(filter).length < 1) {
            return res.status(404).send({ status: false, message: "Name and Subject Required For Filter" })
        }

        if (name) {
            checkDelete["name"] = name
        }


        if (subject) {
            checkDelete["subject"] = subject
        }


        let find = await marksModel.find(checkDelete)

        if (find.length <= 0) return res.status(404).send({ status: false, message: "no such studend exist" })

        return res.status(200).send({ status: true, data: find })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}

// 
// const getStudentData=async function (req,res){
//     try{
//         let data = req.query
       

//         let query={isDeleted:false}
//         // const {userId,category,subcategory}=data
//         if (!Object.keys(data).length) {
//             let marks = await marksModel.find({ $and: [{ isDeleted: false }] });
//             if (!Object.keys(marks).length) {
//                 return res.status(404).send({ status: false, message: "no such student exist" });
//             }
//             return res.status(200).send({ status: true,message:"Ok" ,data: marks });
//         } else {
//             let marks = await marksModel.find(query)
//             if (!Object.keys(marks).length) {
//                 return res.status(404).send({ status: false, message: " No such book exist" ,data:marks});
//             }
        
//             return res.status(200).send({ status: true,message:"getbooklists", data: marks});
//             // return res.status(200).send({ status: true, list: books });
           
//         }
//     }catch (error) {
//         return res.status(500).send({ status: false, message: error.message })
//     }
// }

//----------------------update/Edit data----------------------

// let allBooks= await BookModel.findOneAndUpdate( 
//             { authorName: "ABC"} , //condition
//             { $set: data }, //update in data
//             { new: true , upsert: true} ,// new: true - will give you back the updated document // Upsert: it finds and updates the document but if the doc is not found(i.e it does not exist) then it creates a new document i.e UPdate Or inSERT  
//          )

const editStudent = async (req, res) => {
    try {

        const data = req.body
        const id = req.params.studentId
        let findId = await marksModel.findOne({ "_id": id })
       
        let { name, subject, marks} = data
        let savedData = await marksModel.findOne({ name: name, subject: subject })
        let checkDelete=savedData.isDeleted
        if(checkDelete==true) return res.status(400).send({status:false,message:"no such data found"})
        if (savedData) {
            let CreateData = await marksModel.findOneAndUpdate({ name: name },
                { $set: { marks: savedData.marks + marks } },
                { new: true, upsert: true })
            return res.status(200).send({ data: CreateData, message: "marks updated successfully" })

        }
        else if (!savedData) {
            data.teacherId = findId.teacherId
            let create1 = await marksModel.create(data)
            return res.status(201).send({ status: true, data: create1 })
        }

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


//------------------------delete student----------------------
const deleatByid = async (req, res) => {
    try {
        let id = req.params.studentId
        if (!ObjectId.isValid(id)) return res.status(400).send({ status: false, message: "Student id  is not correct" })
        
        let student = await marksModel.findById(id)
        if (!student) return res.status(404).send({ status: false, message: "Student does not exist" })

        let is_Deleted = student.isDeleted
        if (is_Deleted == true) return res.status(404).send({ status: false, message: "Student is already Deleted " })

        let deleteStudent = await marksModel.findOneAndUpdate({ _id: id }, { $set: { isDeleted: true } }, { new: true })
        return res.status(200).send({ status: true, data: deleteStudent })

    } catch (err) {
        return res.send({ status: false, message: err.message })
    }
}



module.exports = { studentData, getStudentData, editStudent, deleatByid }