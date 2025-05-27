'use client';

import { Card, CardContent } from './ui/card';
import { format } from 'date-fns';

export default function MailCard({ email }) {
    const handleClick = () => {
        window.open(`/preview/${email.id}`, '_blank');
    };

    return (
        <Card onClick={handleClick} className="cursor-pointer hover:bg-accent transition">
            <CardContent>
                <p className="text-sm text-muted-foreground text-end">{format(new Date(email.date), 'PPpp')}</p>
                <h4 className="font-semibold break-words">{email.subject}</h4>
                <p className="text-sm text-muted-foreground break-all">From: {email.from}</p>
            </CardContent>
        </Card>
    );
}
