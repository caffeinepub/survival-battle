import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ErrorNoticeProps {
  error: Error | string;
  title?: string;
}

export default function ErrorNotice({ error, title = 'Error' }: ErrorNoticeProps) {
  const message = typeof error === 'string' ? error : error.message;

  const friendlyMessage = message
    .replace(/Insufficient balance to join tournament/i, 'Insufficient wallet balance to pay the entry fee.')
    .replace(/You have already joined this tournament/i, 'You have already joined this tournament.')
    .replace(/Tournament is full/i, 'This tournament is full.')
    .replace(/You must set your Free Fire UID before joining a tournament/i, 'Please set your Free Fire UID in your profile before joining.')
    .replace(/You must create a profile before joining a tournament/i, 'Please complete your profile setup before joining.');

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{friendlyMessage}</AlertDescription>
    </Alert>
  );
}
