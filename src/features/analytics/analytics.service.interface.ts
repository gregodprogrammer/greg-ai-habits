import { AnalyticsSummary, UUID } from '@/shared/types';

export interface IAnalyticsService {
  getSummary(userId: UUID, from?: string, to?: string): Promise<AnalyticsSummary>;
}
