import sql from '../db_helper/neon_utils.js'
// import CustomParseFormat from 'dayjs/plugin/customParseFormat.js'

const table_name = process.env.TABLE_TOKEN

const historyToken = async() => {
    try {
        const result = await sql`SELECT * FROM ${sql.unsafe(table_name)};`
        if (!result) {
            throw new Error("Table is Empty...");
        }
        return result
    } catch (error) {
        throw new Error({ errorMessage : error.message });
    }
}

const costToken = async(date_usage) =>{
    console.log(date_usage)
    
    try {
        const result = await sql`
                            SELECT 
                                DATE(created_on) AS date_used,
                                SUM(token_usage) AS total_token,
                                SUM(total_cost) AS total_cost
                            FROM
                                ${sql.unsafe(table_name)}
                            WHERE
                                DATE(created_on) = ${date_usage}
                            GROUP BY
                                date_used;`
        if (!result) {
            throw new Error("There are no token used today...");
        }
        return result
    } catch (error) {
        throw new Error({ errorMessage : error.message });
    }
}

const insertHistoryToken = async(token_type, token_usage) => {
    let cost = 0

    if (token_type.trim().toLowerCase() == 'input_token') {
        // For calculate the input_token
        cost = (token_usage / 1000000 * 16520 * 0.075).toFixed(2)
    }
    else{
        // For calculate the output_token
        cost = (token_usage / 1000000 * 16520 * 0.30).toFixed(2)
    }
    console.log(`Token Type : ${token_type}\nToken Usage : ${token_usage}\nCost : ${cost}`)

    try {
        const result = await sql`
                                INSERT INTO ${sql.unsafe(table_name)} (token_type, token_usage, total_cost)
                                VALUES (${token_type}, ${token_usage}, ${cost})
                                RETURNING *;`
        if(!result) {
            throw new Error("The Request Body cannot be empty..."); 
        }
        return result
    } catch (error) {
        console.log(`Error : ${error.message}`)
        throw new Error({ errorMessage : error.message });
    }
}


export default { historyToken, costToken, insertHistoryToken }