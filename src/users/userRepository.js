import sql from "../db_helper/neon_utils.js";

const table_name = process.env.TABLE_USER


const getAllUser = async() => {
    const result = await sql`SELECT * FROM ${sql.unsafe(table_name)}`
    try {
        if(!result) {
            throw new Error(`Table ${table_name} are empty..`);
        }
        return result
    } catch (error) {
        throw new Error({ errorMessage : error.message });
    }
}

const getUserByEmail = async(email) => {
    const result = await sql`
                            SELECT  
                                *
                            FROM
                                ${sql.unsafe(table_name)}
                            WHERE
                                email = ${email};`
    try {
        if(!result) {
            throw new Error(`Email not registered. Please register`);
        }
        return result[0]
    } catch (error) {
        throw new Error({ errorMessage : error.message });
    }
}

const insertNewUser = async(userName, email, password) => {
    const result = await sql`
                            INSERT INTO ${sql.unsafe(table_name)} (user_name, email, password)
                            VALUES(${userName}, ${email}, ${password})
                            RETURNING user_name, email, created_on, updated_on;`
    try {
        if(!result) {
            throw new Error("The Request Body cannot be empty...");
        }
        return result[0]
    } catch (error) {
        throw new Error({ errorMessage : error.message });
    }
}

const updateUserName = async(userName, email) => {
    const result = await sql`
                            UPDATE ${sql.unsafe(table_name)} 
                            SET 
                                user_name = ${userName},
                                updated_on = NOW(),
                            WHERE   
                                email = ${email}
                            
                        `
    try {
        if(!result) {
            throw new Error("The Request Body cannot be empty...");
        }
        return result[0]
    } catch (error) {
        throw new Error({ errorMessage : error.message });
    }
}

export default { getAllUser, getUserByEmail, insertNewUser, updateUserName }