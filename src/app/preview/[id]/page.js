import { notFound } from 'next/navigation';
import MailPreview from '@/components/MailPreview';

export async function generateStaticParams() {
    return [];
}

export default function MailPreviewPage({ params }) {
    const { id } = params;

    if (!id) {
        notFound();
    }

    return (
        <div className="p-4">
            <MailPreview id={id} />
        </div>
    );
}
