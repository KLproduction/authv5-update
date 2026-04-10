"use server"
import * as z from "zod"
import { NewPasswordSchema } from "@/schemas"
import { getPasswordResetTokenByToken } from "@/data/password-reset-token"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { getUserByEmail } from "@/data/user"
import { newPasswordFlow } from "@/lib/auth-flow"

export const newPassword = async (
    values: z.infer< typeof NewPasswordSchema>,
    token?: string | null,
)=>{
    return newPasswordFlow(values, token, {
        getPasswordResetTokenByToken,
        getUserByEmail,
        hashPassword: async (password) => bcrypt.hash(password, 10),
        updateUserPassword: async (userId, password) => {
            await db.user.update({
                where:{id:userId},
                data:{password}
            })
        },
        deletePasswordResetToken: async (id) => {
            await db.passwordResetToken.delete({
                where:{id}
            })
        },
    })
}
