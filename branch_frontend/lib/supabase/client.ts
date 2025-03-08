import { StorageClient } from '@supabase/storage-js';

export const createStorageClient = () => {
  
  const STORAGE_URL = 'https://vpvedoahpxlmlxybinju.supabase.co/storage/v1'
  const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwdmVkb2FocHhsbWx4eWJpbmp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTQwMjc0NSwiZXhwIjoyMDU2OTc4NzQ1fQ.hyjY7p3UkcvKeGbpiqIlHEguHvqIh5PFoDvYaFpTI2A' //! service key, not anon key  

  // Create and return the storage client
  return new StorageClient(STORAGE_URL, {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
  });
};