import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Public client — safe for use in browser and server components
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper: upload a file to a Supabase Storage bucket
export async function uploadFile(
    bucket: string,
    path: string,
    file: File | Blob,
    contentType?: string
): Promise<{ url: string; storagePath: string }> {
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
            contentType,
            upsert: false,
        });

    if (error) throw new Error(error.message);

    const {
        data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return { url: publicUrl, storagePath: data.path };
}

// Helper: delete a file from a Supabase Storage bucket
export async function deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) throw new Error(error.message);
}
