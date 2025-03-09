'use client'

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { getCurrentUser, createLink, deleteLink, updateProfile } from '@/lib/api';
import { createStorageClient } from '@/lib/supabase/client';
import { 
  Link as LinkIcon, 
  Settings, 
  User, 
  LogOut, 
  PlusCircle, 
  ExternalLink, 
  Trash2, 
  Copy, 
  ChevronRight,
  Upload
} from 'lucide-react';

export default function Dashboard() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [links, setLinks] = useState<{_id?: string; id?: string; title: string; url: string}[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('links');
  
  // Avatar upload states
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Theme settings (for preview and configuration only)
  const [pageBackground, setPageBackground] = useState('bg-black');
  const [buttonStyle, setButtonStyle] = useState('solid');
  const [fontFamily, setFontFamily] = useState('font-inter');
  const [customBackground, setCustomBackground] = useState<string | null>(null);
  
  // Background upload states
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);
  const [uploadingBackground, setUploadingBackground] = useState(false);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  
  const router = useRouter();
  
  // Fetch links directly from database
  const fetchLinksFromDatabase = async () => {
    try {
      const response = await getCurrentUser();
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
      setAvatarUrl(user.avatar || null);
      
      // Set theme settings from user object if they exist
      if (user.theme) {
        setPageBackground(user.theme.pageBackground || 'bg-black');
        setButtonStyle(user.theme.buttonStyle || 'solid');
        setFontFamily(user.theme.fontFamily || 'font-inter');
        setCustomBackground(user.theme.customBackground || null);
      }
      
      // Directly fetch links from the database instead of using user object
      fetchLinksFromDatabase();
    }
  }, [isLoading, isAuthenticated, user, router]);
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Basic validation for image file types
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Check file size (limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB');
        return;
      }
      
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };
  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !user) return null;
    
    setUploadingAvatar(true);
    try {
      // Create storage client
      const storage = createStorageClient();
      
      // Delete all old avatars for the user
      if (user?.id) {
        try {
          // List all files in the user's avatar directory
          const { data: existingFiles, error: listError } = await storage
        .from('user-content')
        .list(`avatars/${user.id}`);
        
          if (listError) {
        console.error("Error listing existing avatars:", listError);
          } else if (existingFiles && existingFiles.length > 0) {
        // Create an array of file paths to delete
        const filesToDelete = existingFiles.map(file => `avatars/${user.id}/${file.name}`);
        
        // Delete all existing avatar files for this user
        const { error: deleteError } = await storage
          .from('user-content')
          .remove(filesToDelete);
          
        if (deleteError) {
          console.error("Error deleting old avatars:", deleteError);
        } else {
          console.log(`Successfully deleted ${filesToDelete.length} old avatar(s)`);
        }
          }
        } catch (deleteError) {
          console.error("Error handling old avatars:", deleteError);
          // Continue with upload even if delete fails
        }
      }
      
      // Generate a unique filename
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${user.id}/${fileName}`;
      
      // Upload the file to bucket 'user-content'
      const { data, error } = await storage
        .from('user-content')
        .upload(filePath, avatarFile, {
          cacheControl: '3600',
          upsert: true // Replace if exists
        });
        
      if (error) {
        throw error;
      }
      
      if (!data?.path) {
        throw new Error('Upload succeeded but no path was returned');
      }
      
      // Get the public URL using the getPublicUrl method from the reference
      const { data: publicUrlData } = storage
        .from('user-content')
        .getPublicUrl(data.path);
      
      return publicUrlData.publicUrl;
    } catch (error: unknown) {
      console.error("Error uploading avatar:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Upload failed: ${errorMessage}`);
      return null;
    } finally {
      setUploadingAvatar(false);
    }
  };
  
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
    console.log('Attempting to delete link with ID:', id);
    if (!id) {
      console.error("Invalid link ID: undefined");
      return;
    }
    
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

      // Upload avatar if a file is selected
      let uploadedAvatarUrl = avatarUrl;
      if (avatarFile) {
        const url = await uploadAvatar();
        if (url) {
          console.log('New avatar URL:', url);
          uploadedAvatarUrl = url;
          setAvatarUrl(url);
        }
      }
      
      // Create profile data to send to backend
      const profileData = { 
        name, 
        bio, 
        avatar: uploadedAvatarUrl, // Send this to be saved in the backend
        theme: {
          pageBackground,
          buttonStyle,
          fontFamily
        }
      };
      
      console.log('Updating profile with data:', profileData);
      
      // Send updated profile to backend - use void to explicitly ignore return value
      void await updateProfile(profileData);
      
      // Refresh user data from backend to ensure state is current
      const updatedUserData = await getCurrentUser();
      
      // Update local user state with data from backend
      if (updatedUserData?.data) {

        if (typeof user === 'object' && user !== null) {
          const savedAvatarUrl = updatedUserData.data.avatar;
          // Update local state (if the URL from backend is different)
          if (savedAvatarUrl && savedAvatarUrl !== avatarUrl) {
            setAvatarUrl(savedAvatarUrl);
          }
        }
      }
      // Clear the file input and preview
      if (fileInputRef.current) fileInputRef.current.value = '';
      setAvatarFile(null);
      setAvatarPreview(null);
      
      alert("Profile updated successfully!");
    } catch (error: Error | unknown) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const saveThemeSettings = async () => {
    setSaving(true);
    try {
      // Upload background if a file is selected
      let uploadedBackgroundUrl = customBackground;
      if (backgroundFile) {
        const url = await uploadBackground();
        if (url) {
          console.log('New wallpaper URL:', url);
          uploadedBackgroundUrl = url;
          setCustomBackground(url);
        }
      }
      
      // Create the theme data object with all required fields
      const themeData: {
        pageBackground: string;
        buttonStyle: string;
        fontFamily: string;
        customBackground?: string | null;
      } = {
        pageBackground,
        buttonStyle,
        fontFamily
      };
      
      // When using a custom background, make sure to include the URL
      if (pageBackground === 'custom') {
        if (!uploadedBackgroundUrl) {
          // If switching to custom without a background, alert the user
          alert("Please upload a background image first");
          setPageBackground('bg-black'); // Default fallback
          setSaving(false);
          return;
        }
        themeData.customBackground = uploadedBackgroundUrl;
      } else {
        // If not using custom background, explicitly set to null
        themeData.customBackground = null;
      }
      
      // Send the update to backend - use void to explicitly ignore return value
      void await updateProfile({ theme: themeData });
      
      
      
      // Clear the file input and preview if we've switched away from custom
      if (pageBackground !== 'custom') {
        if (backgroundInputRef.current) backgroundInputRef.current.value = '';
        setBackgroundFile(null);
        setBackgroundPreview(null);
      }
      
      alert("Theme settings saved successfully!");
    } catch (error: Error | unknown) {
      console.error("Error saving theme settings:", error);
      alert("Error saving theme settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Background image upload handler
  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Basic validation for image file types
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      setBackgroundFile(file);
      setBackgroundPreview(URL.createObjectURL(file));
      
      // When a custom background is selected, set a special value for pageBackground
      setPageBackground('custom');
    }
  };
  
  // Background upload function
  const uploadBackground = async (): Promise<string | null> => {
    if (!backgroundFile || !user) return null;
    
    setUploadingBackground(true);
    try {
      const storage = createStorageClient();
      
      // Delete all old backgrounds for the user
      if (user?.id) {
        try {
          const { data: existingFiles, error: listError } = await storage
            .from('user-content')
            .list(`wallpapers/${user.id}`);
          
          if (listError) {
            console.error("Error listing existing wallpapers:", listError);
          } else if (existingFiles && existingFiles.length > 0) {
            const filesToDelete = existingFiles.map(file => `wallpapers/${user.id}/${file.name}`);
            
            const { error: deleteError } = await storage
              .from('user-content')
              .remove(filesToDelete);
              
            if (deleteError) {
              console.error("Error deleting old wallpapers:", deleteError);
            } else {
              console.log(`Successfully deleted ${filesToDelete.length} old wallpaper(s)`);
            }
          }
        } catch (deleteError) {
          console.error("Error handling old wallpapers:", deleteError);
        }
      }
      
      // Generate a unique filename for wallpaper
      const fileExt = backgroundFile.name.split('.').pop();
      const fileName = `wallpaper-${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `wallpapers/${user.id}/${fileName}`;
      
      // Upload the wallpaper
      const { data, error } = await storage
        .from('user-content')
        .upload(filePath, backgroundFile, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (error) {
        throw error;
      }
      
      if (!data?.path) {
        throw new Error('Upload succeeded but no path was returned');
      }
      
      // Get the public URL
      const { data: publicUrlData } = storage
        .from('user-content')
        .getPublicUrl(data.path);
      
      return publicUrlData.publicUrl;
    } catch (error: unknown) {
      console.error("Error uploading wallpaper:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Wallpaper upload failed: ${errorMessage}`);
      return null;
    } finally {
      setUploadingBackground(false);
    }
  };

  // Preview component for the theme settings 
  const ThemePreview = () => (
    <div 
      className={`w-full h-40 rounded-xl ${pageBackground !== 'custom' ? pageBackground : ''} flex items-center justify-center overflow-hidden border border-zinc-700 mb-6 shadow-lg shadow-black/30 relative`}
      style={pageBackground === 'custom' && (backgroundPreview || customBackground) ? {
        backgroundImage: `url(${backgroundPreview || customBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      } : {}}
    >
      <div className="absolute inset-0 w-full h-full opacity-40 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent)]"></div>
      <div className={`text-center p-4 relative z-10 ${fontFamily}`}>
        <div className="text-lg font-bold mb-3 text-shadow">Theme Preview</div>
        <button 
          className={`px-6 py-2.5 rounded-md ${
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
        {/* Sidebar - Keep existing sidebar code */}
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
                <div className="w-10 h-10 rounded-full overflow-hidden relative">
                  {avatarUrl ? (
                    <Image 
                      src={avatarUrl} 
                      alt={user.name || user.username}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                  )}
                </div>
                <div className="ml-3">
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
        
        {/* Redesigned Main content area */}
        <div className="flex-1 overflow-y-auto">
          <div className="py-8 px-6 max-w-4xl mx-auto">
            {/* Common header with gradient underline */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight mb-2">
                {activeTab === 'links' ? 'Manage Links' : 
                 activeTab === 'profile' ? 'Edit Profile' : 'Settings'}
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
            </div>
            
            {activeTab === 'links' && (
              <div className="space-y-6">
                {/* Add New Link Card */}
                <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800/50 shadow-lg shadow-purple-900/5 p-6 transition-all">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <PlusCircle className="h-5 w-5 mr-2 text-purple-400" />
                    Add New Link
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Link Title"
                      className="flex-1 bg-zinc-800/70 border border-zinc-700/50 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    />
                    <input
                      type="text"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="URL (https://...)"
                      className="flex-1 bg-zinc-800/70 border border-zinc-700/50 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    />
                    <Button 
                      onClick={addLink} 
                      disabled={saving || !newTitle || !newUrl}
                      className="whitespace-nowrap bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:shadow-md hover:shadow-purple-500/20 transition-all"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Link
                    </Button>
                  </div>
                </div>
                
                {/* Your Links Card */}
                <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800/50 shadow-lg shadow-purple-900/5 p-6 transition-all">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <LinkIcon className="h-5 w-5 mr-2 text-purple-400" />
                    Your Links
                  </h3>
                  
                  {links.length === 0 ? (
                    <div className="bg-zinc-800/50 rounded-lg p-10 text-center">
                      <div className="bg-zinc-800/70 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner shadow-black/30">
                        <LinkIcon className="h-8 w-8 text-zinc-500" />
                      </div>
                      <p className="text-zinc-300 font-medium">You haven&apos;t added any links yet.</p>
                      <p className="text-sm text-zinc-500 mt-1">Add your first link above to get started!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {links.map(link => (
                        <div key={link._id || link.id} className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/30 hover:bg-zinc-800/80 transition-all group">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-md bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center mr-3 group-hover:from-purple-600/30 group-hover:to-blue-600/30 transition-all">
                              <LinkIcon className="h-5 w-5 text-purple-400" />
                            </div>
                            <div>
                              <div className="font-medium">{link.title}</div>
                              <div className="text-xs text-zinc-400 truncate max-w-xs">{link.url}</div>
                            </div>
                          </div>
                          <Button 
                            onClick={() => {
                              // Log the link object to debug
                              console.log('Link object structure:', link);
                              // Try both common ID properties
                              const linkId = link._id || link.id;
                              if (linkId) {
                                removeLink(linkId);
                              } else {
                                console.error("Cannot remove link: No valid ID found");
                              }
                            }}
                            variant="outline" 
                            size="sm"
                            className="ml-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 border-red-800/30"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Profile Edit Card */}
                <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800/50 shadow-lg shadow-purple-900/5 p-6 transition-all">
                  <div className="mb-8 flex flex-col sm:flex-row sm:items-start gap-8">
                    <div className="flex flex-col items-center">
                      <div className="w-32 h-32 rounded-full overflow-hidden relative mb-4 border-2 border-purple-500/30 shadow-lg shadow-purple-900/20 group">
                        {avatarPreview ? (
                          <Image 
                            src={avatarPreview} 
                            alt="Avatar Preview"
                            fill
                            className="object-cover" 
                          />
                        ) : avatarUrl ? (
                          <Image 
                            src={avatarUrl} 
                            alt="Current Avatar"
                            fill
                            className="object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-2xl font-bold">
                            {user?.name ? user.name[0].toUpperCase() : 'U'}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-black/50 border-white/30 text-white hover:bg-black/70"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Change
                          </Button>
                        </div>
                      </div>
                      
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                        ref={fileInputRef}
                      />
                      
                      <p className="text-sm text-zinc-500 mt-2 text-center">
                        Recommended: Square image<br />Less than 2MB
                      </p>
                    </div>
                    
                    <div className="space-y-5 flex-1">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-zinc-300">Display Name</label>
                        <input 
                          type="text" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full p-3 rounded-lg bg-zinc-800/70 border border-zinc-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                          placeholder="Your Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-zinc-300">Bio</label>
                        <textarea 
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="w-full p-3 rounded-lg bg-zinc-800/70 border border-zinc-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                          placeholder="Tell visitors about yourself"
                          rows={4}
                        ></textarea>
                        <p className="text-xs text-zinc-500 mt-1">
                          Brief description that appears on your profile page
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end border-t border-zinc-800/50 pt-4 mt-4">
                    <Button 
                      onClick={saveProfile} 
                      disabled={saving || uploadingAvatar}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:shadow-md hover:shadow-purple-500/20 px-8 transition-all"
                    >
                      {saving || uploadingAvatar ? 'Saving...' : 'Save Profile'}
                    </Button>
                  </div>
                </div>
                
                {/* Branch Link Card */}
                <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800/50 shadow-lg shadow-purple-900/5 p-6 transition-all">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <ExternalLink className="h-5 w-5 mr-2 text-purple-400" />
                    Your Branch Link
                  </h3>
                  <div className="bg-zinc-800/70 p-4 rounded-lg flex items-center justify-between border border-zinc-700/30">
                    <code className="text-sm bg-black/30 p-2 rounded">
                      {typeof window !== 'undefined' && window.location.origin}/{user?.username}
                    </code>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(`${typeof window !== 'undefined' ? window.location.origin : ''}/${user?.username}`);
                        alert('URL copied to clipboard!');
                      }}
                      className="ml-3 border-zinc-700/50 hover:bg-zinc-800"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">
                    Share this link with your audience to show them all your important links
                  </p>
                </div>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Theme Settings Card */}
                <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800/50 shadow-lg shadow-purple-900/5 p-6 transition-all">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-purple-400" />
                    Theme Settings
                  </h3>
                  <p className="text-zinc-400 mb-6 text-sm">
                    Customize how your public profile page looks to visitors
                  </p>
                  
                  {/* Enhanced theme preview */}
                  <ThemePreview />
                  
                  <div className="space-y-6">
                    {/* Font Family Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-3 text-zinc-300">Font Style</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          { value: 'font-inter', label: 'Inter', sample: 'Modern & Clean' },
                          { value: 'font-poppins', label: 'Poppins', sample: 'Friendly & Rounded' },
                          { value: 'font-montserrat', label: 'Montserrat', sample: 'Classic & Elegant' },
                          { value: 'font-roboto', label: 'Roboto', sample: 'Neutral & Balanced' },
                          { value: 'font-oswald', label: 'Oswald', sample: 'Bold & Distinctive' },
                          { value: 'font-playfair', label: 'Playfair', sample: 'Stylish & Refined' }
                        ].map((font) => (
                          <button 
                            key={font.value}
                            onClick={() => setFontFamily(font.value)}
                            className={`flex flex-col items-center justify-center p-4 rounded-lg bg-zinc-800/50 border ${fontFamily === font.value ? 'border-purple-500' : 'border-zinc-700/50'} hover:border-purple-500/50 transition-all`}
                          >
                            <span className={`text-lg font-medium ${font.value}`}>{font.label}</span>
                            <span className={`text-xs text-zinc-400 mt-1 ${font.value}`}>{font.sample}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Existing Page Background Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-3 text-zinc-300">Page Background</label>
                      <div className="grid grid-cols-6 gap-3">
                        {[
                          { value: 'bg-black', label: 'Black' },
                          { value: 'bg-zinc-900', label: 'Dark Gray' }, 
                          { value: 'bg-purple-900', label: 'Purple' }, 
                          { value: 'bg-blue-900', label: 'Blue' },
                          { value: 'bg-gradient-to-br from-purple-900 to-blue-900', label: 'Gradient' },
                          { value: 'custom', label: 'Custom' }
                        ].map((bg) => (
                          <button 
                            key={bg.value}
                            onClick={() => setPageBackground(bg.value)}
                            className={`h-12 w-full rounded-md ${bg.value !== 'custom' ? bg.value : 'bg-zinc-800 flex items-center justify-center'} border-2 ${pageBackground === bg.value ? 'border-white' : 'border-zinc-700'} hover:border-white focus:outline-none focus:ring-2 focus:ring-white transition-all shadow-sm hover:shadow-md hover:shadow-purple-500/10`}
                            title={bg.label}
                          >
                            {bg.value === 'custom' && (
                              <div className={`text-xs ${pageBackground === 'custom' ? 'text-white' : 'text-zinc-400'}`}>Custom</div>
                            )}
                          </button>
                        ))}
                      </div>
                      
                      {/* Custom background uploader (only visible when 'custom' is selected) */}
                      {pageBackground === 'custom' && (
                        <div className="mt-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/30">
                          <div className="flex flex-col sm:flex-row gap-4 items-start">
                            <div className="w-24 h-24 rounded-md overflow-hidden relative border border-zinc-700/70">
                              {backgroundPreview || customBackground ? (
                                <Image 
                                  src={backgroundPreview || customBackground || ''}
                                  alt="Background Preview"
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                  <Upload className="h-6 w-6 text-zinc-500" />
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1 space-y-3">
                              <div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleBackgroundChange}
                                  className="hidden"
                                  ref={backgroundInputRef}
                                />
                                
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => backgroundInputRef.current?.click()}
                                  className="flex items-center mb-2"
                                >
                                  <Upload className="h-4 w-4 mr-2" />
                                  {customBackground ? 'Change Wallpaper' : 'Upload Wallpaper'}
                                </Button>
                                
                                <p className="text-xs text-zinc-400">
                                  Upload an image to use as your profile background.
                                  <br />Max size: 5MB. Recommended: 1920×1080px or larger.
                                  {uploadingBackground ? "Uploading background..." : ""}
                                </p>
                              </div>
                              
                              {(backgroundPreview || customBackground) && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    if (backgroundInputRef.current) backgroundInputRef.current.value = '';
                                    setBackgroundFile(null);
                                    setBackgroundPreview(null);
                                    setCustomBackground(null);
                                  }}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20 border-red-800/30"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remove Wallpaper
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Existing Button Style Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-3 text-zinc-300">Button Style</label>
                      <div className="grid grid-cols-3 gap-3">
                        <button 
                          onClick={() => setButtonStyle('solid')}
                          className={`px-4 py-3 rounded-lg bg-purple-600 text-white text-sm font-medium ${buttonStyle === 'solid' ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-900' : ''}`}
                        >
                          Solid
                        </button>
                        <button 
                          onClick={() => setButtonStyle('outline')}
                          className={`px-4 py-3 rounded-lg bg-transparent border border-purple-600 text-purple-600 text-sm font-medium ${buttonStyle === 'outline' ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-900' : ''}`}
                        >
                          Outline
                        </button>
                        <button 
                          onClick={() => setButtonStyle('gradient')}
                          className={`px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium ${buttonStyle === 'gradient' ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-900' : ''}`}
                        >
                          Gradient
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-end border-t border-zinc-800/50 pt-4 mt-4">
                      <Button 
                        onClick={saveThemeSettings} 
                        disabled={saving}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:shadow-md hover:shadow-purple-500/20 px-8 transition-all"
                      >
                        {saving ? 'Saving...' : 'Save Theme Settings'}
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Account Settings Card */}
                <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800/50 shadow-lg shadow-purple-900/5 p-6 transition-all">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-purple-400" />
                    Account Settings
                  </h3>
                  <div className="space-y-4">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-yellow-600/30 text-yellow-500 hover:bg-yellow-600/10 py-6 px-4"
                    >
                      Change Password
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-red-600/30 text-red-500 hover:bg-red-600/10 py-6 px-4"
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
