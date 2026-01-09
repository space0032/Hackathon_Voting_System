import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { userId, teamId, points } = await request.json();

        // Transaction: 1. Check user points, 2. Create Vote, 3. Deduct points
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where: { id: userId },
                include: { event: true },
            });

            if (!user) {
                throw new Error('User not found');
            }

            const totalAllowed = user.role === 'JUDGE' ? user.event.judgePoints : user.event.audiencePoints;

            if (user.pointsSpent + points > totalAllowed) {
                throw new Error('Insufficient points balance');
            }

            // Check if already voted for this team
            const existingVote = await tx.vote.findUnique({
                where: {
                    userId_teamId: { userId, teamId }
                }
            });

            if (existingVote) {
                throw new Error('You have already voted for this team');
            }

            const vote = await tx.vote.create({
                data: {
                    userId,
                    teamId,
                    points,
                },
            });

            await tx.user.update({
                where: { id: userId },
                data: { pointsSpent: { increment: points } },
            });

            return vote;
        });

        return NextResponse.json({ success: true, vote: result });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message || 'Voting failed' }, { status: 400 });
    }
}
