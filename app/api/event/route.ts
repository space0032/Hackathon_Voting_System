import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, audiencePoints, judgePoints } = body;

        const event = await prisma.event.create({
            data: {
                name,
                audiencePoints: parseInt(audiencePoints),
                judgePoints: parseInt(judgePoints),
                isActive: true,
            },
        });

        return NextResponse.json(event);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const event = await prisma.event.findFirst({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(event);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
    }
}
