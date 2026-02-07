import { useState, useEffect } from 'react';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ErrorNotice from '../components/common/ErrorNotice';
import { User, Save, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const [displayName, setDisplayName] = useState('');
  const [freeFireUid, setFreeFireUid] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setFreeFireUid(userProfile.freeFireUid || '');
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(false);
    try {
      await saveProfile.mutateAsync({
        displayName: displayName || undefined,
        freeFireUid: freeFireUid || undefined,
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Profile save error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Skeleton className="h-10 w-48 mb-6" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your display name and Free Fire player information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Player Information
          </CardTitle>
          <CardDescription>
            Your Free Fire UID is required to join tournaments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
              />
              <p className="text-xs text-muted-foreground">
                This name will be shown to other players
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="freeFireUid">
                Free Fire UID <span className="text-destructive">*</span>
              </Label>
              <Input
                id="freeFireUid"
                value={freeFireUid}
                onChange={(e) => setFreeFireUid(e.target.value)}
                placeholder="Enter your Free Fire UID"
                required
              />
              <p className="text-xs text-muted-foreground">
                Your unique Free Fire player ID (required to join tournaments)
              </p>
            </div>

            {saveProfile.isError && (
              <ErrorNotice
                error={saveProfile.error || 'Failed to save profile'}
                title="Save Failed"
              />
            )}

            {showSuccess && (
              <Alert className="bg-primary/10 border-primary/20">
                <CheckCircle className="h-4 w-4 text-primary" />
                <AlertDescription className="text-primary">
                  Profile saved successfully!
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full gap-2"
              disabled={saveProfile.isPending || !freeFireUid}
            >
              <Save className="h-4 w-4" />
              {saveProfile.isPending ? 'Saving...' : 'Save Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {userProfile && (
        <Card className="mt-6 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account Created:</span>
              <span className="font-medium">
                {new Date(Number(userProfile.createdAt) / 1000000).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Updated:</span>
              <span className="font-medium">
                {new Date(Number(userProfile.updatedAt) / 1000000).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
