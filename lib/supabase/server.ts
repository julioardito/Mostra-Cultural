import { createClient } from "@supabase/supabase-js";

// Este client usa a service role key e só deve ser importado
// em rotas de API (server-side). NUNCA importe em componentes client.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);
