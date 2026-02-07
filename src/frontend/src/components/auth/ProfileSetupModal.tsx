import { useState } from 'react';
import { useSaveCallerUserProfile } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function ProfileSetupModal() {
  const [displayName, setDisplayName] = useState('');
  const [freeFireUid, setFreeFireUid] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveProfile.mutateAsync({
        displayName: displayName || undefined,
        freeFireUid: freeFireUid || undefined,
      });
    } catch (error) {
      console.error('Profile setup error:', error);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome! Set Up Your Profile</DialogTitle>
          <DialogDescription>
            Please provide your display name and Free Fire UID to get started.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="freeFireUid">Free Fire UID</Label>
            <Input
              id="freeFireUid"
              value={freeFireUid}
              onChange={(e) => setFreeFireUid(e.target.value)}
              placeholder="Enter your Free Fire UID"
            />
          </div>
          {saveProfile.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {saveProfile.error instanceof Error ? saveProfile.error.message : 'Failed to save profile'}
              </AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full" disabled={saveProfile.isPending}>
            {saveProfile.isPending ? 'Saving...' : 'Continue'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
