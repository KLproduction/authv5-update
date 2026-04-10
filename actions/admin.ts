"use server"

import { currentRole } from "@/lib/auth";
import { adminAccessFlow } from "@/lib/auth-domains/admin";

export const admin = async ()=>{
    return adminAccessFlow(await currentRole())

}
