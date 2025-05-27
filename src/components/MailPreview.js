'use client';

import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Download } from 'lucide-react';
import { Button } from './ui/button';
import DOMPurify from 'dompurify';

export default function MailPreview({ id }) {
    const [email, setEmail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;

        const fetchEmail = async () => {
            setLoading(true);
            setError('');
            setEmail(null);

            const apiKey = localStorage.getItem('auth_token');
            if (!apiKey) {
                setError('API key is missing. Please set it in the settings.');
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`/api/email/${id}`, {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                    },
                });

                if (!res.ok) {
                    const data = await res.json();
                    setError(data.message || 'Failed to fetch email.');
                    setLoading(false);
                    return;
                }

                const data = await res.json();
                setEmail(data);
            } catch (err) {
                console.error('Error fetching email:', err);
                setError('Failed to fetch email.');
            } finally {
                setLoading(false);
            }
        };

        fetchEmail();
    }, [id]);

    if (!id)
        return (
            <p className="text-center text-muted-foreground py-8">
                Please select an email to preview.
            </p>
        );

    if (loading)
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Loading email...
            </div>
        );

    if (error)
        return (
            <div className="flex items-center gap-2 text-red-600 py-8 justify-center">
                <AlertCircle />
                <span>{error}</span>
            </div>
        );

    if (!email) return null;

    const date = new Date(email.date).toLocaleString();

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-end">
                <Button
                    as="a"
                    href={email.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    size="sm"
                    className="inline-flex items-center gap-2"
                >
                    <Download className="h-4 w-4" />
                    Download Raw Email
                </Button>
            </div>
            <h2 className="text-2xl font-semibold mb-2">{email.subject}</h2>
            <p className="text-sm text-gray-500 mb-1 font-medium">
                <span className="text-black">From:</span> {email.from}
            </p>
            <p className="text-sm text-gray-500 mb-4 font-medium">
                <span className="text-black">Date:</span> {date}
            </p>

            <div
                className="prose max-w-none mb-6"
                dangerouslySetInnerHTML={{
                    __html: email.html ? DOMPurify.sanitize(email.html) : email.text,
                }}
            />
        </div>
    );
}
