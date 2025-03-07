'use client';

import { useEffect, useState } from 'react';
import { getUserProfile } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LinkCard from '@/components/LinkCard';

export default function BranchPage({ params }: { params: { username: string } }) {
  const [profile, setProfile] = useState<any | null | undefined>(undefined); // undefined = loading, null = not found
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await getUserProfile(params.username);
        setProfile(response.data);
      } catch (error: any) {
        console.error('Error fetching user profile:', error);
        if (error.response && error.response.status === 404) {
          setProfile(null);
        }
      }
    }
    fetchProfile();
  }, [params.username, router]);

  if (profile === undefined) return <div>Loading...</div>;
  if (profile === null) return <div>User not found</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex flex-col items-center">
          <Image 
            src={profile.avatar || 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_1.png'} 
            alt={profile.name || profile.username}
            width={96}
            height={96}
            className="rounded-full"
          />
          <h1 className="mt-4 text-2xl font-bold">{profile.name || profile.username}</h1>
          {profile.bio && <p className="text-zinc-400 mt-2">{profile.bio}</p>}
        </div>
        
        <div className="mt-8 space-y-4">
          {profile.links.map((link: any) => (
            <LinkCard key={link.id} {...link} />
          ))}
          
          {profile.links.length === 0 && (
            <p className="text-zinc-500">No links added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
