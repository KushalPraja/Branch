'use client' 
import React, { useState } from 'react';

interface LinkCardProps {
  title: string;
  url: string;
  buttonClassName?: string;
  id?: string;
  icon?: string;
}

export default function LinkCard({ title, url, buttonClassName = '', icon }: LinkCardProps) {
  const [clicked, setClicked] = useState(false);
  
  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 500);
  };

  const defaultButtonClass = "bg-purple-600 hover:bg-purple-700 text-white";
  const buttonClass = buttonClassName || defaultButtonClass;
  
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`flex items-center p-4 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 transition-all ${clicked ? 'scale-95' : ''} ${buttonClass}`}
    >
      {icon && <span className="mr-3 text-xl">{icon}</span>}
      <span className="font-medium">{title}</span>
    </a>
  );
}
