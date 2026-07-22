import { createClient } from '@supabase/supabase-js';
import { IStorageProvider, UploadResult } from './storage.provider.interface';
import { ILogger } from '@/infrastructure/logger/logger.interface';
import { AppError } from '@/shared/utils/errors';

export class SupabaseStorageProvider implements IStorageProvider {
  private readonly client;

  constructor(
    supabaseUrl: string,
    supabaseServiceKey: string,
    private readonly logger: ILogger,
  ) {
    this.client = createClient(supabaseUrl, supabaseServiceKey);
  }

  async upload(bucket: string, path: string, file: Buffer, mimeType: string): Promise<UploadResult> {
    const { data, error } = await this.client.storage
      .from(bucket)
      .upload(path, file, { contentType: mimeType, upsert: true });

    if (error || !data) {
      this.logger.error('Storage upload failed', error);
      throw new AppError('STORAGE_ERROR', 'File upload failed', 500);
    }

    return { path: data.path, url: this.getPublicUrl(bucket, data.path) };
  }

  async delete(bucket: string, path: string): Promise<void> {
    const { error } = await this.client.storage.from(bucket).remove([path]);
    if (error) {
      this.logger.warn('Storage delete error', { error: error.message, path });
    }
  }

  getPublicUrl(bucket: string, path: string): string {
    const { data } = this.client.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }
}
