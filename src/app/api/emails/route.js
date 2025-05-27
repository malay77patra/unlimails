import { withAuth } from '@/lib/withAuth';
import testmailClient from '@/lib/testmailClient';

export const GET = withAuth(async (request) => {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const offset = (page - 1) * limit;
    const namespace = process.env.NEXT_PUBLIC_NAMESPACE;

    if (!namespace) {
        throw new Error('NEXT_PUBLIC_NAMESPACE is not set in environment variables');
    }

    if (!tag) {
        return new Response(JSON.stringify({ error: 'Missing tag parameter' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const query = `
    query GetInbox($namespace: String!, $tag: String!, $limit: Int!, $offset: Int!) {
      inbox(namespace: $namespace, tag: $tag, limit: $limit, offset: $offset) {
        result
        message
        count
        emails {
          id
          subject
          from
          date
        }
      }
    }
  `;

    const variables = { namespace, tag, limit, offset };

    try {
        const res = await testmailClient.request(query, variables);

        return new Response(JSON.stringify(res.inbox), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (err) {
        console.error('Mail API error:', err);
        return new Response(JSON.stringify({ message: 'Oops! Something went wrong.' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
});