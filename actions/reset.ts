"use server"

import { ResetSchema } from "@/schemas"
import { getUserByEmail } from "@/data/user"
import * as z from "zod"
import { sendPasswordResentEmail } from "@/lib/mail"
import { generateResetPasswordToken } from "@/lib/tokens"
import { resetFlow } from "@/lib/auth-flow"

export const reset = async (values:z.infer<typeof ResetSchema>)=>{
    return resetFlow(values, {
        getUserByEmail,
        generateResetPasswordToken,
        sendPasswordResetEmail: sendPasswordResentEmail,
    })
}
