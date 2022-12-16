const bcrypt = require("bcrypt");
const saltRound = 10

// const marksModel = require("../model/marksModel.js")
const teacherModel = require("../model/teacherModel")
const jwt = require("jsonwebtoken")
const { isValidName, isValidEmail} = require("../validation/validation")




const createStudent = async (req, res) => {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Please Provide Teacher Information" })
        }
        const { name, email, password } = data
        if (!name) {
            return res.status(400).send({ status: false, message: "Name is mandatory" })

        }

        if (!isValidName(name)) {
            return res.status(400).send({ status: false, message: "Name is invalid" });
        }

        if (!email) {
            return res.status(400).send({ status: false, message: "email is mandatory" })
        }
        if (!isValidEmail(email)) {
            return res.status(404).send({ status: false, message: "email is invalid" })
        }


        let emailExist = await teacherModel.findOne({ email });
        if (emailExist) {
            return res.status(400).send({ status: false, message: "Teacher with this email already exists" })
        }

        if (!password) {
            return res.status(400).send({ status: false, message: "Password is mandatory" })
        }
        // if (!isValidPassword(password)) {
        // return res.status(400).send({ status: false, message: "Password is invalid" })
        // }
        let encryptedPassword = bcrypt
            .hash(req.body.password, saltRound)
            .then((hash) => {
                // console.log(`Hash: ${hash}`);
                return hash;
            });
        req.body.password = await encryptedPassword;

        const student = await teacherModel.create(data);
        return res.status(201).send({ status: true, message: "Teacher is successfully created", data: student })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};

// ===========================login=============================================================

const teacherLogin = async (req, res) => {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Please Provide data" })
        }
        const { email, password } = data
        if (!email) {
            return res.status(400).send({ status: false, message: "email is mandatory" })
        }
        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "Please Provide Valid Email " })
        }
        if (!password) {
            return res.status(400).send({ status: false, message: "Password is mandatory" })
        }

        const Login = await teacherModel.findOne({ email });
        if (!Login)
            return res.status(404).send({ status: false, message: "Not a register email Id" });

        let decodePwd = await bcrypt.compare(password, Login.password);
        if (!decodePwd)
            return res.status(400).send({ status: false, message: "Password not match" });

        let token = jwt.sign(
            {
                teacherId: Login._id.toString(),
            },
            "secreat_key for token",
            { expiresIn: "50d" }
        );

        return res.status(200).send({status: true,message: "Teacher login successfull",data: { userId: Login._id, token: token },
        })
        //  if(!isValidPassword(Password)){
        //     return res
        //   .status(400)
        //   .send({status:false, message:"Please Provide Password "})
        //  }
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}
module.exports = { createStudent, teacherLogin }