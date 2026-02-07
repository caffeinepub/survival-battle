import { Link, useRouterState } from '@tanstack/react-router';
import AuthStatus from '../auth/AuthStatus';
import PrincipalBadge from '../auth/PrincipalBadge';
import { useGetCallerUserProfile, useGetCallerWalletBalance } from '../../hooks/useQueries';
import { Trophy, Wallet, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: balance } = useGetCallerWalletBalance();

  const navItems = [
    { path: '/', label: 'Tournaments', icon: Trophy },
    { path: '/wallet', label: 'Wallet', icon: Wallet },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const formatBalance = (bal: bigint | undefined) => {
    if (bal === undefined) return '0';
    return bal.toString();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/assets/generated/ff-tourney-logo.dim_512x512.png"
                alt="Free Fire Tournament"
                className="h-10 w-10 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-foreground">FF Tournaments</h1>
                <p className="text-xs text-muted-foreground">Compete & Conquer</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground ${
                      isActive ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-4">
              {userProfile && (
                <div className="hidden sm:flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      {userProfile.displayName || 'Player'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Balance: {formatBalance(balance)} coins
                    </p>
                  </div>
                  <PrincipalBadge />
                </div>
              )}
              <AuthStatus />
            </div>
          </div>

          <nav className="md:hidden flex items-center gap-4 mt-4 border-t border-border/40 pt-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors hover:text-foreground ${
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm mt-auto">
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
