"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { getAccountByUserId } from "@/data/account"
import { isGuestExpired, serializeGuestExpiresAt } from "@/lib/guest-policy"

export const currentUser = async()=>{
    const session = await auth()

    if (!session?.user?.id) {
        return null
    }

    const dbUser = await db.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            isTwoFactorEnabled: true,
            isGuest: true,
            guestExpiresAt: true,
        },
    })

    if (!dbUser) {
        return null
    }

    if (dbUser.isGuest && isGuestExpired(dbUser.guestExpiresAt)) {
        return null
    }

    const account = await getAccountByUserId(dbUser.id)

    return {
        ...session.user,
        ...dbUser,
        isOAuth: !!account,
        guestExpiresAt: serializeGuestExpiresAt(dbUser.guestExpiresAt),
    }
}
export const currentRole = async()=>{
    const user = await currentUser()

    return user?.role
}
