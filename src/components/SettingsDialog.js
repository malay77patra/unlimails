'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export default function SettingsDialog({ open, onOpenChange }) {
  const [token, setToken] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('auth_token');
    if (saved) setToken(saved);
  }, []);

  const save = () => {
    localStorage.setItem('auth_token', token);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>API Key</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Enter your API key"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <Button onClick={save} className="mt-2 w-full">
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
}
