console.log('DEBUG URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('DEBUG KEY start:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 8))

import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)