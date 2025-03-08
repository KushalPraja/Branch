'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { getCurrentUser, createLink, deleteLink, updateProfile } from '@/lib/api';
import { 
  Home, 
  Link as LinkIcon, 
  Settings, 
  User, 
  LogOut, 
  PlusCircle, 
  ExternalLink, 
  Trash2, 
  Copy, 
  ChevronRight
} from 'lucide-react';

export default function Dashboard() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [links, setLinks] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('links');
  
  // Theme settings (for preview and configuration only)
  const [pageBackground, setPageBackground] = useState('bg-black');
  const [buttonStyle, setButtonStyle] = useState('solid');
  
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
      
      // Set theme settings from user object if they exist
      if (user.theme) {
        setPageBackground(user.theme.pageBackground || 'bg-black');
        setButtonStyle(user.theme.buttonStyle || 'solid');
      }
      
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
      await updateProfile({ 
        name, 
        bio, 
        theme: {
          pageBackground,
          buttonStyle
        }
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const saveThemeSettings = async () => {
    setSaving(true);
    try {
      await updateProfile({ 
        theme: {
          pageBackground,
          buttonStyle
        }
      });
      alert("Theme settings saved successfully!");
    } catch (error) {
      console.error("Error saving theme settings:", error);
      alert("Error saving theme settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Preview component for the theme settings 
  const ThemePreview = () => (
    <div className={`w-full h-32 rounded-lg ${pageBackground} flex items-center justify-center overflow-hidden border border-zinc-700 mb-4`}>
      <div className="text-center p-4">
        <div className="text-lg font-bold mb-2">Theme Preview</div>
        <button 
          className={`px-4 py-2 rounded-md ${
            buttonStyle === 'solid' ? 'bg-purple-600 text-white' : 
            buttonStyle === 'outline' ? 'bg-transparent border border-purple-600 text-purple-600' : 
            'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
          }`}
        >
          Button Preview
        </button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 border-r border-zinc-800 bg-zinc-900 flex flex-col">
          <div className="p-4">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">Branch</h1>
          </div>
          
          <nav className="flex-1 px-2 py-4 space-y-1">
            <button 
              onClick={() => setActiveTab('links')}
              className={`flex items-center px-4 py-3 text-sm rounded-md w-full ${activeTab === 'links' ? 'bg-purple-900/30 text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}
            >
              <LinkIcon className="h-5 w-5 mr-3" />
              My Links
              <ChevronRight className="h-4 w-4 ml-auto" />
            </button>
            
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center px-4 py-3 text-sm rounded-md w-full ${activeTab === 'profile' ? 'bg-purple-900/30 text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}
            >
              <User className="h-5 w-5 mr-3" />
              Profile
              <ChevronRight className="h-4 w-4 ml-auto" />
            </button>
            
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex items-center px-4 py-3 text-sm rounded-md w-full ${activeTab === 'settings' ? 'bg-purple-900/30 text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}
            >
              <Settings className="h-5 w-5 mr-3" />
              Settings
              <ChevronRight className="h-4 w-4 ml-auto" />
            </button>
          </nav>
          
          <div className="p-4 border-t border-zinc-800">
            {user && (
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mr-3">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="font-medium">{user.name || 'User'}</div>
                  <div className="text-xs text-zinc-400">@{user.username}</div>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Button asChild variant="outline" size="sm" className="w-full justify-start">
                <Link href={`/${user?.username}`} target="_blank">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View My Page
                </Link>
              </Button>
              
              <Button onClick={logout} variant="outline" size="sm" className="w-full justify-start text-red-500 border-red-500/20 hover:bg-red-500/10">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-4xl">
            {activeTab === 'links' && (
              <>
                <h2 className="text-2xl font-bold mb-6">Manage Links</h2>
                
                <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 mb-6">
                  <h3 className="text-lg font-medium mb-4">Add New Link</h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Link Title"
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      type="text"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="URL (https://...)"
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <Button 
                      onClick={addLink} 
                      disabled={saving || !newTitle || !newUrl}
                      className="whitespace-nowrap bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Link
                    </Button>
                  </div>
                </div>
                
                <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
                  <h3 className="text-lg font-medium mb-4">Your Links</h3>
                  {links.length === 0 ? (
                    <div className="text-center py-8 text-zinc-500">
                      <LinkIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p>You haven't added any links yet.</p>
                      <p className="text-sm">Add your first link above to get started!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {links.map(link => (
                        <div key={link._id} className="flex items-center justify-between p-3 bg-zinc-800 rounded-md">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-md bg-purple-900/30 flex items-center justify-center mr-3">
                              <LinkIcon className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium">{link.title}</div>
                              <div className="text-xs text-zinc-400">{link.url}</div>
                            </div>
                          </div>
                          <Button 
                            onClick={() => removeLink(link._id)}
                            variant="outline" 
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
            
            {activeTab === 'profile' && (
              <>
                <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
                
                <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 mb-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Display Name</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Your Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Bio</label>
                      <textarea 
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Tell visitors about yourself"
                        rows={4}
                      ></textarea>
                    </div>
                    <Button 
                      onClick={saveProfile} 
                      disabled={saving}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {saving ? 'Saving...' : 'Save Profile'}
                    </Button>
                  </div>
                </div>
                
                <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
                  <h3 className="text-lg font-medium mb-4">Your Branch Link</h3>
                  <div className="bg-zinc-800 p-3 rounded-md flex items-center justify-between">
                    <code className="text-sm">
                      {typeof window !== 'undefined' && window.location.origin}/{user?.username}
                    </code>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(`${typeof window !== 'undefined' ? window.location.origin : ''}/${user?.username}`);
                        alert('URL copied to clipboard!');
                      }}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>
              </>
            )}
            
            {activeTab === 'settings' && (
              <>
                <h2 className="text-2xl font-bold mb-6">Settings</h2>
                
                <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 mb-6">
                  <h3 className="text-lg font-medium mb-4">Theme Settings</h3>
                  <p className="text-zinc-400 mb-6">
                    These settings will change how your public profile page looks to visitors.
                  </p>
                  
                  {/* Add theme preview */}
                  <ThemePreview />
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Page Background</label>
                      <div className="grid grid-cols-5 gap-2">
                        {[
                          { value: 'bg-black', label: 'Black' },
                          { value: 'bg-zinc-900', label: 'Dark Gray' }, 
                          { value: 'bg-purple-900', label: 'Purple' }, 
                          { value: 'bg-blue-900', label: 'Blue' },
                          { value: 'bg-gradient-to-br from-purple-900 to-blue-900', label: 'Gradient' }
                        ].map((bg) => (
                          <button 
                            key={bg.value}
                            onClick={() => setPageBackground(bg.value)}
                            className={`h-10 w-full rounded-md ${bg.value} border ${pageBackground === bg.value ? 'border-white' : 'border-zinc-700'} hover:border-white focus:outline-none focus:ring-2 focus:ring-white transition`}
                            title={bg.label}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Button Style</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button 
                          onClick={() => setButtonStyle('solid')}
                          className={`px-4 py-2 rounded-md bg-purple-600 text-white text-sm font-medium ${buttonStyle === 'solid' ? 'ring-2 ring-white' : ''}`}
                        >
                          Solid
                        </button>
                        <button 
                          onClick={() => setButtonStyle('outline')}
                          className={`px-4 py-2 rounded-md bg-transparent border border-purple-600 text-purple-600 text-sm font-medium ${buttonStyle === 'outline' ? 'ring-2 ring-white' : ''}`}
                        >
                          Outline
                        </button>
                        <button 
                          onClick={() => setButtonStyle('gradient')}
                          className={`px-4 py-2 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium ${buttonStyle === 'gradient' ? 'ring-2 ring-white' : ''}`}
                        >
                          Gradient
                        </button>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={saveThemeSettings} 
                      disabled={saving}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {saving ? 'Saving...' : 'Save Theme Settings'}
                    </Button>
                  </div>
                </div>
                
                <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
                  <h3 className="text-lg font-medium mb-4">Account Settings</h3>
                  <div className="space-y-4">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-yellow-600/30 text-yellow-500 hover:bg-yellow-600/10"
                    >
                      Change Password
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-red-600/30 text-red-500 hover:bg-red-600/10"
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
