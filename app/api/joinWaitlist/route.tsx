import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: { email },
        });

        return NextResponse.json({ message: "success", user });
    } catch (error) {
        return NextResponse.json({ error: "Error upserting user" }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ message: "GET method not allowed" }, { status: 405 });
}