'use client' 
import { useState } from 'react';

interface LinkCardProps {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

export default function LinkCard({ title, url, icon }: LinkCardProps) {
  const [clicked, setClicked] = useState(false);
  
  const handleClick = () => {
    setClicked(true);
    // Reset the "clicked" state after animation completes
    setTimeout(() => setClicked(false), 500);
  };
  
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`flex items-center p-4 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 transition-all ${clicked ? 'scale-95' : ''}`}
    >
      {icon && <span className="mr-3 text-xl">{icon}</span>}
      <span className="font-medium">{title}</span>
    </a>
  );
}
