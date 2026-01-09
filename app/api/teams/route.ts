import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const eventId = searchParams.get('eventId');

        if (!eventId) {
            return NextResponse.json({ error: 'Event ID required' }, { status: 400 });
        }

        const teams = await prisma.team.findMany({
            where: { eventId },
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { votes: true } } }
        });

        return NextResponse.json(teams);
    } catch (error) {
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
