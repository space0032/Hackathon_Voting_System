import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, context: { params: { id: string } }) {
    try {
        const id = context.params.id;
        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
}
