import { db } from "@/lib/db";
import { getServerSideUser } from "@/lib/getServerSideUser";
import { createCompanionValidator } from "@/lib/validator/companion.validator";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";



export const PATCH = async (req: NextRequest, { params }: { params: { companionId: string } }) => {
    try {
        const user = await getServerSideUser()
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        const body = await req.json()
        const { name, description, category, avatar,instruction } = createCompanionValidator.parse(body)
        const existCompanion = await db.companion.findUnique({
            where: {
                id: params.companionId
            }
        })
        if (!existCompanion) return NextResponse.json({ message: "Companion not found please try later" }, { status: 404 })
        await db.companion.update({
            where: {
                id: params.companionId
            },
            data: {
                name, description, category, avatar,instruction
            }
        })
        return NextResponse.json({ message: "success",redirectId: existCompanion.id },{status:200})
    } catch (error) {

        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ message: "something went wrong" }, { status: 500 })
    }
}