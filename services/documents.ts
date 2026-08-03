import { createClient } from '@/lib/supabase/client';

const BUCKET = 'documents';

export interface DocumentRow {
  id: string;
  user_id: string;
  client_id: string | null;
  job_id: string | null;
  name: string;
  storage_path: string;
  url: string;
  size: number | null;
  mime: string | null;
  tags: string[] | null;
  created_at: string;
  clients?: { name: string } | null;
  jobs?: { title: string } | null;
}

export async function getDocuments(clientId?: string): Promise<DocumentRow[]> {
  const supabase = createClient();
  let query = supabase
    .from('documents')
    .select('*, clients(name), jobs(title)')
    .order('created_at', { ascending: false });

  if (clientId && clientId !== 'all') {
    query = query.eq('client_id', clientId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as DocumentRow[];
}

export async function uploadDocument(
  file: File,
  meta: { client_id?: string; job_id?: string; tags?: string[] }
): Promise<DocumentRow> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const storagePath = `${user.id}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, { contentType: file.type, upsert: false });
  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

  const { data: doc, error: dbError } = await supabase
    .from('documents')
    .insert({
      user_id: user.id,
      client_id: meta.client_id ?? null,
      job_id: meta.job_id ?? null,
      name: file.name,
      storage_path: storagePath,
      url: urlData.publicUrl,
      size: file.size,
      mime: file.type,
      tags: meta.tags ?? [],
    })
    .select('*, clients(name), jobs(title)')
    .single();
  if (dbError) throw dbError;

  return doc as DocumentRow;
}

export async function updateDocument(
  id: string,
  data: { client_id?: string | null; job_id?: string | null; name?: string; tags?: string[] | null }
): Promise<DocumentRow> {
  const supabase = createClient();
  const { data: updated, error } = await supabase
    .from('documents')
    .update(data)
    .eq('id', id)
    .select('*, clients(name)')
    .single();
  if (error) throw error;
  return updated as DocumentRow;
}

export async function deleteDocument(id: string): Promise<void> {
  const supabase = createClient();

  const { data: doc } = await supabase
    .from('documents')
    .select('storage_path')
    .eq('id', id)
    .single();

  const docRow = doc as { storage_path: string } | null;
  if (docRow?.storage_path) {
    await supabase.storage.from(BUCKET).remove([docRow.storage_path]);
  }

  const { error } = await supabase.from('documents').delete().eq('id', id);
  if (error) throw error;
}

export async function getDocumentCount(): Promise<number> {
  const supabase = createClient();
  const { count, error } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: true });
  if (error) throw error;
  return count ?? 0;
}
