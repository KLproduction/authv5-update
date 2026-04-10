"use server"

import * as z from "zod"

import { db } from "@/lib/db"
import { SettingSchema } from "@/schemas"
import { getUserByEmail, getUserById } from "@/data/user"
import { currentUser } from "@/lib/auth"
import { generateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/mail"
import bcrypt from "bcryptjs"
import { settingsFlow } from "@/lib/auth-domains/settings"

export const setting = async(
    values: z.infer<typeof SettingSchema>
)=>{
    const user = await currentUser()
    
    if(!user){
        return{error:"Unauthorized"}
    }


    const dbUser = await getUserById(user.id!)



    if(!dbUser){
        return{error:"Unauthorized"}
    }

    return settingsFlow(values, user, {
        getUserById,
        getUserByEmail,
        generateVerificationToken,
        sendVerificationEmail,
        comparePassword: async (plain, hash) => bcrypt.compare(plain, hash),
        hashPassword: async (password) => bcrypt.hash(password, 10),
        updateUser: async (id, nextValues) => {
            await db.user.update({
                where: { id },
                data: nextValues,
            });
        },
    });
}
