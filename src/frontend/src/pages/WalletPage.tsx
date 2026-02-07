import { useGetCallerWalletBalance } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wallet, Plus, Info } from 'lucide-react';
import { useState } from 'react';

export default function WalletPage() {
  const { identity } = useInternetIdentity();
  const { data: balance, isLoading } = useGetCallerWalletBalance();
  const [showTopUpInfo, setShowTopUpInfo] = useState(false);

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="py-12 text-center">
            <Wallet className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground mb-4">Please sign in to view your wallet</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatBalance = (bal: bigint | undefined) => {
    if (bal === undefined) return '0';
    return bal.toString();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Wallet</h1>
        <p className="text-muted-foreground">Manage your tournament funds and view transaction history</p>
      </div>

      <div className="grid gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader>
            <CardDescription>Current Balance</CardDescription>
            {isLoading ? (
              <Skeleton className="h-12 w-48" />
            ) : (
              <CardTitle className="text-5xl font-bold">{formatBalance(balance)} coins</CardTitle>
            )}
          </CardHeader>
          <CardContent>
            <Button
              variant="default"
              className="gap-2"
              onClick={() => setShowTopUpInfo(!showTopUpInfo)}
            >
              <Plus className="h-4 w-4" />
              Top Up Wallet
            </Button>
          </CardContent>
        </Card>

        {showTopUpInfo && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Demo Mode:</strong> This is a placeholder top-up feature. In a production environment, 
              this would integrate with a real payment provider. For demo purposes, please contact an 
              administrator to credit your wallet.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>View your recent wallet activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>Transaction history will appear here</p>
              <p className="text-sm mt-2">Join tournaments to see your transaction activity</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">How to Use Your Wallet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Your wallet balance is used to pay tournament entry fees</p>
            <p>• Winnings from tournaments will be credited to your wallet</p>
            <p>• All transactions are recorded and visible in your history</p>
            <p>• Contact support if you have any questions about your balance</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
