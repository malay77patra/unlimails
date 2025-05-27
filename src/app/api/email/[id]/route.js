import { withAuth } from "@/lib/withAuth";
import testmailClient from "@/lib/testmailClient";

export const GET = withAuth(async (request, { params }) => {
    const { id } = params;
    const namespace = process.env.NEXT_PUBLIC_NAMESPACE;

    if (!namespace) throw new Error('NEXT_PUBLIC_NAMESPACE is not set');

    if (!id) {
        return new Response(JSON.stringify({ error: 'Missing id parameter' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Correct query using inbox with advanced filter to find email by ID
    const query = `
        query GetEmailById($namespace: String!, $id: String!) {
            inbox(
                namespace: $namespace
                advanced_filters: [
                    {
                        field: id
                        match: exact
                        action: include
                        value: $id
                    }
                ]
                limit: 1
            ) {
                result
                message
                count
                emails {
                    id
                    subject
                    date
                    from
                    to
                    cc
                    text
                    html
                    attachments {
                        filename
                        contentType
                        size
                        downloadUrl
                    }
                    messageId
                    tag
                    downloadUrl
                }
            }
        }
    `;

    try {
        const data = await testmailClient.request(query, {
            namespace: namespace,
            id: id
        });

        if (!data.inbox || data.inbox.result !== 'success' || !data.inbox.emails || data.inbox.emails.length === 0) {
            return new Response(JSON.stringify({ error: 'Email not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Return the first (and only) email
        const email = data.inbox.emails[0];

        return new Response(JSON.stringify(email), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        console.error('Mail API error:', err);
        return new Response(
            JSON.stringify({ message: 'Oops! Something went wrong.' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
});