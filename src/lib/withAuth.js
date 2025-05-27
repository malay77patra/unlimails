import jwt from 'jsonwebtoken';

export function withAuth(handler) {
    return async (request, context) => {
        const auth = request.headers.get('authorization');

        if (!auth || !auth.startsWith('Bearer ')) {
            return new Response(JSON.stringify({ message: 'Missing or invalid Authorization header' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const token = auth.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            request.user = decoded;

            return handler(request, context);
        } catch (err) {
            console.error('JWT verification failed:', err.message);
            return new Response(JSON.stringify({ message: 'Invalid or expired token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    };
}
