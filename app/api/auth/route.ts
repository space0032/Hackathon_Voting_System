import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { name, email } = await request.json();

        if (!email || !name) {
            return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
        }

        // 1. Find active event
        const activeEvent = await prisma.event.findFirst({
            where: { isActive: true },
        });

        if (!activeEvent) {
            return NextResponse.json({ error: 'No active event found' }, { status: 404 });
        }

        // 2. Find or Create User
        let user = await prisma.user.findFirst({
            where: { email, eventId: activeEvent.id },
        });

        if (!user) {
            if (!name) {
                return NextResponse.json({ error: 'Name required for registration' }, { status: 400 });
            }
            user = await prisma.user.create({
                data: {
                    name,
                    email,
                    eventId: activeEvent.id,
                    role: 'AUDIENCE',
                },
            });
        }

        return NextResponse.json({ user, event: activeEvent });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }
}
