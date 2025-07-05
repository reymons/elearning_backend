import { db } from "@/lib/db";
import type { CreateData } from "./types";

export abstract class User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    date_of_birth: string;
    created_at: number;

    static getById(id: number) {
        return db.one<User>("SELECT * FROM app_user WHERE id = $1", id);
    }

    static getByEmail(email: string) {
        return db.one<User>("SELECT * FROM app_user WHERE email = $1", email);
    }

    static create(data: CreateData) {
        return db.one<User>(
            "INSERT INTO app_user (first_name,last_name,email,date_of_birth,password) VALUES ($1,$2,$3,$4,$5) RETURNING *",
            [
                data.firstName,
                data.lastName,
                data.email,
                data.dateOfBirth,
                data.password,
            ]
        )
    }
}
