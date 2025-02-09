import { DatabaseSync } from "node:sqlite";
import fs from "fs";
export const db = new DatabaseSync("blogs.db");

export const initDB = () => {
    const dataSql = fs.readFileSync("db/blogs.sql").toString();
    db.exec(dataSql);
};
