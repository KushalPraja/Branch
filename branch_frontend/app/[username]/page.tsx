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

  // Get theme settings or use defaults
  const pageBackground = profile.theme?.pageBackground || 'bg-black';
  const buttonStyle = profile.theme?.buttonStyle || 'solid';

  // Apply the user's theme settings to the public profile page with modern design
  return (
    <div className={`flex flex-col items-center min-h-screen py-20 px-6 ${pageBackground} text-white`}>
      {/* Light effect overlay */}
      <div className="absolute inset-0 w-full h-full opacity-30 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent)]"></div>
      
      <div className="max-w-md w-full space-y-8 text-center relative z-10">
        <div className="flex flex-col items-center">
          <div className="w-28 h-28 rounded-full relative overflow-hidden border-2 border-purple-500/20 shadow-xl shadow-purple-900/20">
            <Image 
              src={profile.avatar || 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_1.png'} 
              alt={profile.name || profile.username}
              fill
              className="object-cover"
            />
          </div>
          <h1 className="mt-6 text-3xl font-bold">{profile.name || profile.username}</h1>
          
          {profile.bio && (
            <p className="mt-3 text-zinc-300 max-w-sm mx-auto leading-relaxed">
              {profile.bio}
            </p>
          )}
        </div>
        
        <div className="mt-10 space-y-4">
          {profile.links.length > 0 ? (
            profile.links.map((link: any) => (
              <a 
                key={link.id} 
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full p-4 rounded-lg text-center font-medium transition-all transform hover:scale-[1.01] ${
                  buttonStyle === 'solid' ? 'bg-purple-600 hover:bg-purple-700 text-white' :
                  buttonStyle === 'outline' ? 'bg-transparent border border-purple-600 text-purple-600 hover:bg-purple-600/10' :
                  'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                }`}
              >
                {link.title}
              </a>
            ))
          ) : (
            <div className="bg-zinc-800/30 backdrop-blur-sm rounded-xl p-8 border border-zinc-700/20">
              <p className="text-zinc-400">No links added yet.</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-xs text-zinc-500">
            Powered by <span className="text-purple-400 font-medium">Branch</span>
          </p>
        </div>
      </div>
    </div>
  );
}
