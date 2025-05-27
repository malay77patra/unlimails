'use client';

import MailFetcher from '@/components/MailFetcher';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import SettingsDialog from '@/components/SettingsDialog';

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">📬 Temp Mail Dashboard</h1>
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      <MailFetcher />

      <SettingsDialog open={open} onOpenChange={setOpen} />
    </main>
  );
}
