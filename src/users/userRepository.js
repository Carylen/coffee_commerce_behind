import { param } from "express-validator";
import sql from "../db_helper/neon_utils.js";

const table_name = process.env.TABLE_USER


const getAllUser = async() => {
    const result = await sql`SELECT * FROM ${sql.unsafe(table_name)}`
    return result
}

const getUserByEmail = async(email) => {
    const result = await sql`
                            SELECT  
                                *
                            FROM
                                ${sql.unsafe(table_name)}
                            WHERE
                                email = ${email};`
    return result[0]
}

const insertNewUser = async(userName, email, password) => {
    const result = await sql`
                            INSERT INTO ${sql.unsafe(table_name)} (user_name, email, password)
                            VALUES(${userName}, ${email}, ${password})
                            RETURNING user_name, email, created_on, updated_on;`
    return result[0]
}

const updateUser = async(email, updateData) => {
    const fields = []
    const values = []
    let paramIndex = 1

    for(const key in updateData) {
        // fields.push(`${key} = ${updateData[key]}`);
        fields.push(`${key} = $${paramIndex}`);
        values.push(updateData[key]);
        paramIndex++;    
    }

    fields.push(`updated_on = $${paramIndex}`)
    values.push(new Date())
    paramIndex++

    const query = `
                    UPDATE ${table_name}
                    SET ${fields.join(', ')}
                    WHERE email = $${paramIndex}
                    RETURNING user_id, user_name, email, updated_on;
                `;
    values.push(email);
    console.log(query)
    console.log(table_name)
    
    // const result = await sql`
    //                         UPDATE ${sql.unsafe(table_name)} 
    //                         SET ${fields.join(',')}
    //                         WHERE   
    //                             email = ${paramIndex}`
    const result = await sql.query(query, values)
    return result[0] || null
}

export default { getAllUser, getUserByEmail, insertNewUser, updateUser }