import { currentRole } from "@/lib/auth";
import { adminAccessFlow } from "@/lib/auth-domains/admin";
import { NextResponse } from "next/server";

export async function GET(){
    const result = adminAccessFlow(await currentRole())

    if("success" in result){
        return new NextResponse(null, {status:200})
    }
    return new NextResponse(null,{status:403})
}
