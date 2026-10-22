import { createClient } from "@supabase/supabase-js";

// The shared test project. Both values are public by design (they ship in every browser bundle);
// row level security decides what they may do. A host's VITE_* variables win when set.
const url = import.meta.env.VITE_SUPABASE_URL || "https://hszqtfynyogshhltamep.supabase.co";
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_aCtosSr17ISoXGsoTazAbA_MiMNv78_";

export const supabase = createClient(url, key);
