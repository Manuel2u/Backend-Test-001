import crypto from "crypto";
import { User } from "../models";
import { client } from "../redis";
const AES_ALGORITHM = "aes-256-gcm";
const SALT = "static-salt";


export const encryptAES = (text: string, password: string) => {
    const keyBuffer = crypto.scryptSync(password, SALT, 32);
    const key = new Uint8Array(keyBuffer);

    const ivBuffer = crypto.randomBytes(12);
    const iv = new Uint8Array(ivBuffer);

    const cipher = crypto.createCipheriv(AES_ALGORITHM, key, iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag().toString("hex");

    return `${Buffer.from(iv).toString("hex")}:${authTag}:${encrypted}`;
};


export const decryptAES = (encryptedPrivateKey: string, password: string) => {
    try {
        const [ivHex, tagHex, encryptedHex] = encryptedPrivateKey.split(":");

        const ivBuffer = Buffer.from(ivHex, "hex");
        const iv = new Uint8Array(ivBuffer.buffer, ivBuffer.byteOffset, ivBuffer.byteLength);

        const authTagBuffer = Buffer.from(tagHex, "hex");
        const authTag = new Uint8Array(authTagBuffer.buffer, authTagBuffer.byteOffset, authTagBuffer.byteLength);

        const encryptedBuffer = Buffer.from(encryptedHex, "hex");
        const encrypted = new Uint8Array(encryptedBuffer.buffer, encryptedBuffer.byteOffset, encryptedBuffer.byteLength);

        const keyBuffer = crypto.scryptSync(password, SALT, 32);
        const key = new Uint8Array(keyBuffer.buffer, keyBuffer.byteOffset, keyBuffer.byteLength);

        const decipher = crypto.createDecipheriv(AES_ALGORITHM, key, iv);
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encrypted, undefined, "utf8");
        decrypted += decipher.final("utf8");

        return decrypted;
    } catch (err) {
        throw new Error("Decryption failed", err);
    }
};

export const generateUserKeys = (password: string) => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" }
    });

    const encryptedPrivateKey = encryptAES(privateKey, password);

    return { publicKey, encryptedPrivateKey };
};


export const encryptNote = async (note: string, userId: string) => {
    const patient = await User.findByPk(userId, { attributes: ["publicKey"] });

    if (!patient || !patient.publicKey) {
        throw new Error("Patient public key not found.");
    }

    const encryptedNote = crypto.publicEncrypt(
        {
            key: patient.publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
        },
        new Uint8Array(Buffer.from(note))
    );

    return encryptedNote.toString("base64");
};


export const decryptNote = async (encryptedNote: string, patientId: string) => {
    const patient = await User.findByPk(patientId, { attributes: ["encryptedPrivateKey"] });

    if (!patient) {
        throw new Error("Patient  not found.");
    }

    const privateKey = await client.get(`user:privateKey:${patientId}`);

    if (!privateKey) {
        throw new Error("User private key not found in session. User might be logged out.");
    }

    const encryptedBuffer = Buffer.from(encryptedNote, "base64");
    const encryptedUint8Array = new Uint8Array(encryptedBuffer.buffer, encryptedBuffer.byteOffset, encryptedBuffer.byteLength);

    const decryptedNote = crypto.privateDecrypt(
        {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
        },
        encryptedUint8Array
    );

    return decryptedNote.toString("utf8");
};
