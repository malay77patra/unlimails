'use client';

import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Dice5 } from 'lucide-react';
import EmailPreview from './EmailPreview';
import MailCard from './MailCard';
import { generateRandomTag } from '@/lib/helpers';

export default function MailFetcher() {
    const [tag, setTag] = useState('');
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const pageLoaded = page - 1;
    const [emailsCount, setEmailsCount] = useState(0);
    const limit = 10;

    useEffect(() => {
        const storedTag = localStorage.getItem('email_tag');
        setTag(storedTag || '');
    }, []);

    useEffect(() => {
        localStorage.setItem('email_tag', tag || '');
    }, [tag]);

    const handleFetch = async (reset = true) => {
        if (!tag.trim()) {
            setError('Please enter a tag to fetch emails.');
            return;
        }

        const apiKey = localStorage.getItem('auth_token');
        setError('');

        if (!apiKey) {
            setError('API key is missing. Please set it in the settings.');
            return;
        }

        setLoading(true);
        try {
            const currentPage = reset ? 1 : page;
            const res = await fetch(`/api/emails?tag=${tag}&limit=${limit}&page=${currentPage}`, {
                headers: {
                    Authorization: `Bearer ${apiKey}`
                }
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Failed to fetch emails');
            } else {
                if (reset) {
                    setEmails(data.emails);
                } else {
                    setEmails((prev) => [...prev, ...data.emails]);
                }

                setEmailsCount(data.count);
                setPage(currentPage + 1);
            }
        } catch (err) {
            console.error('Error fetching emails:', err);
            setError('Failed to fetch emails.');
        } finally {
            setLoading(false);
        }
    };

    const handleInitialFetch = () => {
        setPage(1);
        handleFetch(true);
    };

    const handleLoadMore = () => {
        handleFetch(false);
    };

    return (
        <div>
            <div className="flex gap-2 mb-4">
                <Input placeholder="Enter tag (e.g. vwxyz)" value={tag} onChange={(e) => setTag(e.target.value)} maxLength={7} />
                <Button onClick={() => setTag(generateRandomTag())} size="icon">
                    <Dice5 />
                </Button>
                <Button onClick={handleInitialFetch} disabled={loading}>
                    {loading ? 'Loading...' : 'Fetch Emails'}
                </Button>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <EmailPreview email={tag ? `${process.env.NEXT_PUBLIC_NAMESPACE}.${tag}@inbox.testmail.app` : ''} />

            <div className="space-y-4">
                {emails.length === 0 && !loading && !error && <p className="text-muted-foreground">No emails found.</p>}
                {emails.map((email) => (
                    <MailCard key={email.id} email={email} />
                ))}
            </div>

            {(emailsCount > (pageLoaded * limit)) && !loading && (
                <div className="mt-4">
                    <Button onClick={handleLoadMore} variant="ghost" className="text-blue-600 underline hover:text-blue-500">Load More</Button>
                </div>
            )}
        </div>
    );
}
