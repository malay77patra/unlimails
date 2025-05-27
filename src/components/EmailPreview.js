'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Copy, Check } from 'lucide-react';

export default function EmailPreview({ email }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!email) return null;

    return (
        <div className="mb-4 flex items-center gap-2">
            <p className="text-muted-foreground">
                Your email: <strong>{email}</strong>
            </p>
            <Button variant="ghost" size="icon" onClick={handleCopy}>
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </Button>
        </div>
    );
}
