const jwt = require("jsonwebtoken")
const mongoose = require('mongoose')

// const Authenticate = async function (req, res, next) {
//     try {
//         let token = req.headers["authorization"];
//         // console.log(token)

//         if (!token) return res.status(400).send({ status: false, message: "Token must be present in the request header" })
//         token = token.replace("Bearer " , "")
//         // console.log(token)
//         jwt.verify(token , "As calm as the sea", (error, decodedToken) => {
//             if (error) {
//                 return res.status(401).send({ status: false, error:error.message })
//             }
//             else {
//                 req.decodedToken = decodedToken
//                 next()
//             }
//         })
//     } catch (error) {
//         return res.status(500).send({ status: false, message: error.message })
//     }
// }




let Authenticate = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        if (!token) return res.status(403).send({ status: false, message: "token is required" })

        jwt.verify(token, "secreat_key for token", (error, decodedToken) => {
            if (error) {
                return res.status(401).send({ message: error.message })
            }
            else {
                req.token = decodedToken
                next()
            }
        })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



module.exports.Authenticate = Authenticate






