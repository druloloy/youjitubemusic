import { useState } from 'preact/hooks';

export function useUserId(): string {
  const [userId] = useState(() => {
    let id = localStorage.getItem('userId');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('userId', id);
    }
    return id;
  });
  return userId;
}
