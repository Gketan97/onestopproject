// ============================================================
// QUERY RUNNER
// Orchestrates table loading + query execution per milestone.
// ============================================================

import type { AggregatedMetrics, CaseConfig } from '@/types';
import { MILESTONE_TABLE_MAP, ALWAYS_LOADED_TABLES } from './datasetLoader';
import { getDuckDBEngine } from './DuckDBEngine';
import type { QueryParams } from './types';

export class QueryRunner {
  private caseConfig: CaseConfig;
  private loadedMilestones: Set<string> = new Set();

  constructor(caseConfig: CaseConfig) {
    this.caseConfig = caseConfig;
  }

  async ensureTablesLoaded(milestoneId: string): Promise<void> {
    if (this.loadedMilestones.has(milestoneId)) return;

    const engine = getDuckDBEngine();
    const state = engine.getState();

    const alwaysNeeded = ALWAYS_LOADED_TABLES
      .filter(t => !state.tablesLoaded.includes(t))
      .map(name => this.caseConfig.datasetManifest.tables.find(t => t.name === name))
      .filter((t): t is CaseConfig['datasetManifest']['tables'][number] => t !== undefined);

    const milestoneTableNames = MILESTONE_TABLE_MAP[milestoneId] ?? [];
    const milestoneNeeded = milestoneTableNames
      .filter(t => !state.tablesLoaded.includes(t))
      .map(name => this.caseConfig.datasetManifest.tables.find(t => t.name === name))
      .filter((t): t is CaseConfig['datasetManifest']['tables'][number] => t !== undefined);

    const toLoad = [...alwaysNeeded, ...milestoneNeeded];

    if (toLoad.length > 0) {
      await engine.loadCase(this.caseConfig.caseId, toLoad);
    }

    this.loadedMilestones.add(milestoneId);
  }

  async run(
    queryId: string,
    milestoneId: string,
    params?: QueryParams
  ): Promise<AggregatedMetrics> {
    const engine = getDuckDBEngine();

    if (!engine.getState().initialized) {
      await engine.initialize();
    }

    await this.ensureTablesLoaded(milestoneId);
    return engine.runQuery(queryId, params);
  }

  isQueryAvailable(queryId: string, milestoneId: string): boolean {
    const milestone = this.caseConfig.milestones.find(m => m.id === milestoneId);
    return milestone?.availableQueries.includes(queryId) ?? false;
  }
}
