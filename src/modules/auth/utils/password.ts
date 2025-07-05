import crypto from "crypto";

const PASSWORD_SALT_LEN = 16;
const PASSWORD_HASH_LEN = 64;
const PASSWORD_DELIM = ":";

const PASSWORD_DELIM_OFFSET = PASSWORD_SALT_LEN;
const PASSWORD_HASH_OFFSET = PASSWORD_SALT_LEN + PASSWORD_DELIM.length;

const PASSWORD_HASH_FULL_LEN =
    PASSWORD_SALT_LEN +
    PASSWORD_DELIM.length +
    PASSWORD_HASH_LEN;

function scryptHashPassword(password: string, salt: Buffer) {
    return new Promise<Buffer>((resolve, reject) => {
        crypto.scrypt(password, salt, PASSWORD_HASH_LEN, (err, bfr) => {
            if (err) reject(err);
            else resolve(bfr);
        });
    });
}

export async function hashPassword(password: string): Promise<Buffer> {
    const salt = crypto.randomBytes(PASSWORD_SALT_LEN);
    const hash = await scryptHashPassword(password, salt);
    const buffer = Buffer.alloc(PASSWORD_HASH_FULL_LEN);
    
    for (let i = 0; i < salt.byteLength; i++) {
        buffer[i] = salt[i];
    }
    for (let i = 0; i < hash.byteLength; i++) {
        buffer[PASSWORD_HASH_OFFSET + i] = hash[i];
    }
    buffer[PASSWORD_DELIM_OFFSET] = PASSWORD_DELIM.charCodeAt(0);
    return buffer;
}

export async function verifyPassword(password: string, passwordHash: Buffer) {
    const salt = passwordHash.subarray(0, PASSWORD_SALT_LEN);
    const oldHash = passwordHash.subarray(PASSWORD_HASH_OFFSET);
    const newHash = await scryptHashPassword(password, salt);
    return crypto.timingSafeEqual(oldHash, newHash);
}
