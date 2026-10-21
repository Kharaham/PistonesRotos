import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nhvvvhpbspogqqwpbtrz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5odnZ2aHBic3BvZ3Fxd3BidHJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2MDgzNTIsImV4cCI6MjEwODE4NDM1Mn0.x75NMmHhLepgnfhffNIi9RVPOi-BEUBmoCVAUUZBbPg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log('Testing Supabase connection...');
  
  // 1. Test cms_content select
  const { data: readData, error: readError } = await supabase
    .from('cms_content')
    .select('*');
  console.log('cms_content read result:', { readData, readError });

  // 2. Test cms_content upsert
  const { data: insertData, error: insertError } = await supabase
    .from('cms_content')
    .upsert({ id: 1, content: { test: true }, updated_at: new Date().toISOString() }, { onConflict: 'id' });
  console.log('cms_content upsert result:', { insertData, insertError });

  // 3. Test storage bucket
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  console.log('buckets result:', { buckets, bucketError });
}

test();
