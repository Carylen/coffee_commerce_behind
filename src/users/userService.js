import userHelper from "./userRepository.js"
import bcrypt from "bcryptjs";

const registerUser = async(userName, email, password) => {
    const checkAvailability = await userHelper.getUserByEmail(email)
    try {
        if(checkAvailability) {
            throw new Error("Email has been registered.");
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const result = await userHelper.insertNewUser(userName, email, hashedPassword)

        return result
    } catch (error) {
        throw new Error({ errorMessage : error.message });
    }
}

const getAll = async() => {
    try {
        const result = await userHelper.getAllUser()
        if(!result) {
            throw new Error("there are no user registered");
        }
        return result
    } catch (error) {
        throw new Error({ errorMessage : error.message });
    }
}

const getByEmail = async(email) => {
    try {
        const result = await userHelper.getUserByEmail(email)
        if(!result) {
            throw new Error("that email was not found, please register.");
        }
        return result
    } catch (error) {
        throw new Error({ errorMessage : error.message });
    }
}

export default { registerUser, getAll, getByEmail }