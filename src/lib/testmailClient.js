import { GraphQLClient } from '@testmail.app/graphql-request';

const testmailClient = new GraphQLClient(
    'https://api.testmail.app/api/graphql',
    {
        headers: {
            Authorization: `Bearer ${process.env.TESTMAIL_API_KEY}`,
        },
    }
);

export default testmailClient;
