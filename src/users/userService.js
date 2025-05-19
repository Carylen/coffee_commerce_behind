import userHelper from "./userRepository.js"
import bcrypt from "bcryptjs";

const getAll = async() => {
    const result = await userHelper.getAllUser()
    if(!result) {
        const err = new Error("table users are empty.")
        err.statusCode = 404
        throw err
    }
    return result
}

const getByEmail = async(email) => {
    const result = await userHelper.getUserByEmail(email)
    if(!result) {
        const err = new Error("email not registered, please register with that email.")
        err.statusCode = 404
        throw err
    }
    return result
}

const updateUser = async(email, updateData) => {
    if(updateData.password) {
       updateData.password = await bcrypt.hash(updateData.password, 10) 
    }

    const result = await userHelper.updateUser(email, updateData)
    if(!result) {
        const err = new Error('User not found or update failed!')
        err.statusCode = 404
        err.status = 'FAILED'
        throw err
    }
    return result[0]
}

const registerUser = async(userName, email, password) => {
    const checkAvailability = await userHelper.getUserByEmail(email)
    
    if(checkAvailability) {
        const err = new Error("Email already registered.")
        err.statusCode = 409
        err.status = 'FAILED'
        throw err
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await userHelper.insertNewUser(userName, email, hashedPassword)

    return result
}


export default { registerUser, getAll, getByEmail, updateUser }