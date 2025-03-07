'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { createLink, deleteLink, updateProfile, getCurrentUser } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [links, setLinks] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  
  // Fetch links directly from database
  const fetchLinksFromDatabase = async () => {
    try {
      console.log('Fetching fresh links from database...');
      const response = await getCurrentUser();
      console.log('Fetched links from database:', response.data.links);
      setLinks(response.data.links || []);
    } catch (error) {
      console.error('Error fetching links from database:', error);
    }
  };
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/signin');
    }
    
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      
      // Directly fetch links from the database instead of using user object
      fetchLinksFromDatabase();
    }
  }, [isLoading, isAuthenticated, user, router]);
  
  const addLink = async () => {
    if (newTitle && newUrl) {
      setSaving(true);
      try {
        await createLink({ 
          title: newTitle, 
          url: newUrl.startsWith('http') ? newUrl : `https://${newUrl}`
        });
        
        // Re-fetch links from database after adding
        await fetchLinksFromDatabase();
        
        setNewTitle('');
        setNewUrl('');
      } catch (error) {
        console.error("Error adding link:", error);
      } finally {
        setSaving(false);
      }
    }
  };
  
  const removeLink = async (id: string) => {
    setSaving(true);
    try {
      await deleteLink(id);
      
      // Re-fetch links from database after removing
      await fetchLinksFromDatabase();
    } catch (error) {
      console.error("Error removing link:", error);
    } finally {
      setSaving(false);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile({ name, bio });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            {user && (
              <Button asChild variant="outline">
                <Link href={`/${user.username}`} target="_blank">Preview Branch</Link>
              </Button>
            )}
            <Button onClick={logout} variant="outline" className="text-red-500 border-red-500 hover:bg-red-500/10">Logout</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
              <h2 className="text-xl font-medium mb-4">Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Display Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 rounded bg-zinc-800 border border-zinc-700"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Bio</label>
                  <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-2 rounded bg-zinc-800 border border-zinc-700"
                    placeholder="Tell visitors about yourself"
                    rows={3}
                  ></textarea>
                </div>
                <Button onClick={saveProfile} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
            </div>
            
            <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
              <h2 className="text-xl font-medium mb-4">Your Links</h2>
              <div className="space-y-4">
                {links.map(link => (
                  <div key={link.id} className="flex items-center border border-zinc-800 p-3 rounded bg-zinc-800/50">
                    <div className="flex-1">
                      <h3 className="font-medium">{link.title}</h3>
                      <p className="text-sm text-zinc-400">{link.url}</p>
                    </div>
                    <button 
                      onClick={() => removeLink(link.id)}
                      className="text-zinc-500 hover:text-red-500"
                      disabled={saving}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm mb-2">Title</label>
                    <input 
                      type="text" 
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full p-2 rounded bg-zinc-800 border border-zinc-700"
                      placeholder="Link Title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">URL</label>
                    <input 
                      type="url" 
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      className="w-full p-2 rounded bg-zinc-800 border border-zinc-700"
                      placeholder="https://"
                    />
                  </div>
                  <Button onClick={addLink} className="w-full" disabled={saving}>
                    {saving ? 'Adding...' : 'Add Link'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
              <h2 className="text-xl font-medium mb-4">Your Branch</h2>
              <div className="text-sm">
                <p>Your unique URL:</p>
                <div className="flex items-center mt-2">
                  <code className="bg-zinc-800 p-2 rounded flex-1 overflow-hidden truncate">
                    {typeof window !== 'undefined' && window.location.origin}/{user?.username}
                  </code>
                  <button 
                    className="ml-2 text-zinc-400 hover:text-white"
                    onClick={() => {
                      navigator.clipboard.writeText(`${typeof window !== 'undefined' ? window.location.origin : ''}/${user?.username}`);
                      alert('URL copied to clipboard!');
                    }}
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
