import { useListTournaments } from '../hooks/useQueries';
import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Coins, Users } from 'lucide-react';

export default function TournamentsPage() {
  const { data: tournaments, isLoading } = useListTournaments();

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-[calc(100vh-200px)] bg-cover bg-center"
      style={{
        backgroundImage: 'url(/assets/generated/ff-tourney-hero-bg.dim_1600x900.png)',
      }}
    >
      <div className="bg-gradient-to-b from-background/95 via-background/90 to-background/95 min-h-[calc(100vh-200px)]">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Active Tournaments</h1>
            <p className="text-muted-foreground">Browse and join competitive Free Fire tournaments</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments?.map((tournament, index) => {
              const status = getStatus(tournament.startTime);
              return (
                <Card key={index} className="bg-card/90 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-xl">{tournament.name}</CardTitle>
                      <Badge variant={status === 'upcoming' ? 'default' : 'secondary'}>
                        {status}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(tournament.startTime)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Coins className="h-4 w-4" />
                        <span>Entry Fee</span>
                      </div>
                      <span className="font-semibold">{tournament.entryFee.toString()} coins</span>
                    </div>
                    {tournament.maxParticipants && (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>Max Players</span>
                        </div>
                        <span className="font-semibold">{tournament.maxParticipants.toString()}</span>
                      </div>
                    )}
                    <Link to="/tournament/$tournamentId" params={{ tournamentId: index.toString() }}>
                      <Button className="w-full">View Details</Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {tournaments && tournaments.length === 0 && (
            <Card className="bg-card/90 backdrop-blur-sm">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No tournaments available at the moment.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
