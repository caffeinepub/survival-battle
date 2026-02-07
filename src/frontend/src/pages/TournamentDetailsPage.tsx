import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetTournamentDetails, useJoinTournament, useGetCallerUserProfile, useGetCallerWalletBalance } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import ErrorNotice from '../components/common/ErrorNotice';
import { Calendar, Coins, Users, Trophy, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function TournamentDetailsPage() {
  const { tournamentId } = useParams({ from: '/tournament/$tournamentId' });
  const navigate = useNavigate();
  const tournamentIdBigInt = BigInt(tournamentId);
  const { data: tournament, isLoading } = useGetTournamentDetails(tournamentIdBigInt);
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: balance } = useGetCallerWalletBalance();
  const joinTournament = useJoinTournament();
  const [joinError, setJoinError] = useState<string | null>(null);

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatus = (startTime: bigint) => {
    const now = Date.now() * 1000000;
    const start = Number(startTime);
    if (start > now) return 'upcoming';
    return 'live';
  };

  const handleJoin = async () => {
    setJoinError(null);

    if (!userProfile?.freeFireUid) {
      setJoinError('Please set your Free Fire UID in your profile before joining.');
      return;
    }

    if (balance !== undefined && tournament && balance < tournament.entryFee) {
      setJoinError('Insufficient wallet balance to pay the entry fee.');
      return;
    }

    try {
      await joinTournament.mutateAsync(tournamentIdBigInt);
    } catch (error) {
      setJoinError(error instanceof Error ? error.message : 'Failed to join tournament');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-32 mb-6" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorNotice error="Tournament not found" />
      </div>
    );
  }

  const status = getStatus(tournament.startTime);
  const canJoin = status === 'upcoming' && userProfile?.freeFireUid;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-6 gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Tournaments
      </Button>

      <Card className="bg-card/95 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <CardTitle className="text-3xl mb-2">{tournament.name}</CardTitle>
              <CardDescription className="flex items-center gap-2 text-base">
                <Calendar className="h-5 w-5" />
                {formatDate(tournament.startTime)}
              </CardDescription>
            </div>
            <Badge variant={status === 'upcoming' ? 'default' : 'secondary'} className="text-sm px-3 py-1">
              {status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Coins className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Entry Fee</p>
                  <p className="text-2xl font-bold">{tournament.entryFee.toString()} coins</p>
                </div>
              </div>

              {tournament.maxParticipants && (
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Max Participants</p>
                    <p className="text-2xl font-bold">{tournament.maxParticipants.toString()}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center">
              <img
                src="/assets/generated/ff-badges-set.dim_512x512.png"
                alt="Tournament Badge"
                className="h-32 w-32 object-contain opacity-80"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Tournament Information
            </h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-sm">
                <span className="font-medium">Game:</span> Free Fire
              </p>
              <p className="text-sm">
                <span className="font-medium">Format:</span> Battle Royale
              </p>
              <p className="text-sm">
                <span className="font-medium">Status:</span> {status === 'upcoming' ? 'Registration Open' : 'In Progress'}
              </p>
            </div>
          </div>

          {(joinError || joinTournament.isError) && (
            <ErrorNotice error={joinError || joinTournament.error || 'Failed to join tournament'} />
          )}

          {joinTournament.isSuccess && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
              <p className="text-primary font-semibold">Successfully joined the tournament!</p>
            </div>
          )}

          {!userProfile?.freeFireUid && (
            <div className="bg-muted/50 border border-border rounded-lg p-4 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                You need to set your Free Fire UID before joining tournaments.
              </p>
              <Button variant="outline" onClick={() => navigate({ to: '/profile' })}>
                Go to Profile
              </Button>
            </div>
          )}

          {canJoin && !joinTournament.isSuccess && (
            <Button
              size="lg"
              className="w-full"
              onClick={handleJoin}
              disabled={joinTournament.isPending}
            >
              {joinTournament.isPending ? 'Joining...' : `Join Tournament (${tournament.entryFee.toString()} coins)`}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
