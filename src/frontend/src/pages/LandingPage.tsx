import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Wallet, Users, Zap } from 'lucide-react';

export default function LandingPage() {
  const { login, loginStatus } = useInternetIdentity();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div
        className="relative flex-1 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/assets/generated/ff-tourney-hero-bg.dim_1600x900.png)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />

        <div className="relative container mx-auto px-4 py-16">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
            <img
              src="/assets/generated/ff-tourney-logo.dim_512x512.png"
              alt="Free Fire Tournament"
              className="h-24 w-24 mb-6"
            />
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Free Fire Tournaments
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join competitive tournaments, manage your wallet, and compete for glory
            </p>
            <Button
              size="lg"
              onClick={handleLogin}
              disabled={loginStatus === 'logging-in'}
              className="text-lg px-8 py-6"
            >
              {loginStatus === 'logging-in' ? 'Signing in...' : 'Sign In to Get Started'}
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <Trophy className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Compete</CardTitle>
                <CardDescription>Join exciting Free Fire tournaments</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Browse and join tournaments with various entry fees and prize pools
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <Wallet className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Wallet</CardTitle>
                <CardDescription>Manage your tournament funds</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Track your balance and transaction history in one place
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <Users className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Profile</CardTitle>
                <CardDescription>Set up your player identity</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Link your Free Fire UID and customize your display name
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <Zap className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Fast & Secure</CardTitle>
                <CardDescription>Built on Internet Computer</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Secure authentication and transparent tournament management
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2026. Built with ❤️ using <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline">caffeine.ai</a></p>
            <p className="text-xs">Free Fire Tournament Platform</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
