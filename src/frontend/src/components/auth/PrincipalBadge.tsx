import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Badge } from '@/components/ui/badge';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function PrincipalBadge() {
  const { identity } = useInternetIdentity();
  const [copied, setCopied] = useState(false);

  if (!identity) return null;

  const principal = identity.getPrincipal().toString();
  const shortPrincipal = `${principal.slice(0, 5)}...${principal.slice(-3)}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(principal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary" className="font-mono text-xs">
        {shortPrincipal}
      </Badge>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={handleCopy}
        title="Copy full principal"
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      </Button>
    </div>
  );
}
