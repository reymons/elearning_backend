import { db } from "@/lib/db";

export class RefreshTokenBlacklist {
    static add(token: string, userId: number) {
        return db.query(
            "INSERT INTO refresh_token_blacklist (token,user_id) VALUES ($1,$2)",
            [token, userId]
        );
    }
}
