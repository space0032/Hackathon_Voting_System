import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const eventId = searchParams.get('eventId');

        if (!eventId) {
            return NextResponse.json({ error: 'Event ID required' }, { status: 400 });
        }

        let targetEventId = eventId;
        if (eventId === 'current') {
            const activeEvent = await prisma.event.findFirst({
                where: { isActive: true },
                select: { id: true }
            });
            if (activeEvent) {
                targetEventId = activeEvent.id;
            } else {
                return NextResponse.json({ error: 'No active event found' }, { status: 404 });
            }
        }

        const teams = await prisma.team.findMany({
            where: { eventId: targetEventId },
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { votes: true } } }
        });

        return NextResponse.json(teams);
    } catch (error) {
        console.error('Teams API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, description, eventId } = body;

        const team = await prisma.team.create({
            data: {
                name,
                description,
                eventId,
            },
        });

        return NextResponse.json(team);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create team' }, { status: 500 });
    }
}
