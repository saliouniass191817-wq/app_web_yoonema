import React, { useEffect, useState } from 'react';
import { Button } from '../ui/Button';

const dismissedKey = 'yoonema_install_prompt_dismissed_at';
const sevenDays = 7 * 24 * 60 * 60 * 1000;

export default function InstallPrompt() {
  const [promptEvent, setPromptEvent] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissedAt = Number(localStorage.getItem(dismissedKey) || 0);
    const canShow = Date.now() - dismissedAt > sevenDays;

    const handler = (event) => {
      event.preventDefault();
      setPromptEvent(event);
      if (canShow) {
        window.setTimeout(() => setVisible(true), 30000);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!visible || !promptEvent) {
    return null;
  }

  const dismiss = () => {
    localStorage.setItem(dismissedKey, String(Date.now()));
    setVisible(false);
  };

  const install = async () => {
    promptEvent.prompt();
    await promptEvent.userChoice;
    dismiss();
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white p-4 shadow-xl">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-gray-900">Installez Yoonema sur votre téléphone pour une meilleure expérience</p>
        <div className="flex gap-2">
          <Button size="sm" onClick={install}>Installer</Button>
          <Button size="sm" variant="outline" onClick={dismiss}>Plus tard</Button>
        </div>
      </div>
    </div>
  );
}
