import { Op } from "sequelize";
import { compare, genSalt, hash } from "bcrypt";
import { _generateToken } from "../utils/token";
import { MyContext } from "..";
import logger from "../utils/logger";
import { Doctor, Patient, sequelize, User, UserAccountMeta, UserLoginMeta } from "../models";
import { MutationLoginUserArgs, MutationSignUpUserArgs } from "../types/generated";
import { decryptAES, generateUserKeys } from "../utils/crypto";
import { client } from "../redis";



export const signUpUser = async (
    { firstName, lastName, email, password, hasAgreedToTermsAndAgreements, userType }: MutationSignUpUserArgs["input"],
    { req }: MyContext
) => {
    console.time("signup");
    let user: User | null = null;
    try {
        const alreadyExistingUser = await User.findOne({ where: { email } });

        if (!hasAgreedToTermsAndAgreements) {
            throw new Error("You must agree to terms and conditions.");
        }

        if (alreadyExistingUser) {
            throw new Error("User with this email already exists.");
        }

        const hashedPassword = await hash(password, await genSalt(10));

        const { encryptedPrivateKey, publicKey } = generateUserKeys(password)

        await sequelize.transaction(async (transaction) => {
            user = await User.create({
                firstName,
                lastName,
                email,
                encryptedPrivateKey,
                publicKey,
                avatar: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
                tally: hashedPassword,
            }, { transaction });

            await Promise.all([
                UserAccountMeta.create({
                    authType: "EMAIL",
                    hasAgreedToTermsAndAgreements,
                    ownerId: user.id,
                }, { transaction }),

                UserLoginMeta.create({
                    lastLoginAt: new Date(),
                    ownerId: user.id,
                }, { transaction }),

                ...(userType === "DOCTOR" ? [
                    Doctor.create({
                        userId: user.id,
                        available: true,
                        licenseNumber: "",
                        specialization: "",
                        bio: "",
                    }, { transaction })
                ] : []),

                ...(userType === "PATIENT" ? [
                    Patient.create({
                        userId: user.id,
                        dateOfBirth: null,
                        bloodType: "",
                        emergencyContact: "",
                    }, { transaction })
                ] : [])
            ]);
        });


        return {
            user,
            token: _generateToken(user),
        };

    } catch (e) {
        logger.error(`ERROR SIGNING UP: ${e}`);
        console.log(e);
        throw new Error("An error occurred while signing up. Please try again later.");
    }
};


export const loginUsers = async ({ email, password }: MutationLoginUserArgs, { req }: MyContext) => {
    try {
        const user = await User.findOne({
            where: { email },
            include: [
                {
                    model: UserAccountMeta,
                    as: "accountMeta",
                },
                {
                    model: UserLoginMeta,
                    as: "loginMeta",
                },
            ],
        });

        if (!user) {
            throw new Error("User does not exist");
        }

        const isMatch = await compare(password, user.tally);

        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        await UserLoginMeta.update(
            {
                lastLoginAt: new Date(),
            },
            {
                where: {
                    ownerId: user.id,
                }
            }
        );

        const decryptedPrivateKey = decryptAES(user.encryptedPrivateKey, password);

        await client.set(`user:privateKey:${user.id}`, decryptedPrivateKey, "EX", 60 * 60 * 24);

        return {
            user,
            token: _generateToken(user),
        }

    } catch (e) {
        logger.error(`ERROR SIGNING IN: ${e}`)
        throw e
    }
}


export const logoutUser = async ({ userId }: { userId: string }, { req }: MyContext) => {
    try {
        await client.del(`user:privateKey:${userId}`);
        return true;
    } catch (e) {
        logger.error(`ERROR LOGGING OUT: ${e}`);
        throw e;
    }
}