import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AnalysisJob } from '@models/AnalysisJob';
import { MockAppConfigModule } from '@services/app-config/app-configMock.module';
import { generateAnalysisJob } from '@test/fakes/AnalysisJob';
import {
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from '@test/helpers/api-common';
import { AnalysisJobsService } from './analysis-jobs.service';

describe('AnalysisJobsService', function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MockAppConfigModule,
      ],
      providers: [AnalysisJobsService],
    });

    this.service = TestBed.inject(AnalysisJobsService);
  });

  validateApiList<AnalysisJob, AnalysisJobsService>('/analysis_jobs/');
  validateApiFilter<AnalysisJob, AnalysisJobsService>('/analysis_jobs/filter');
  validateApiShow<AnalysisJob, AnalysisJobsService>(
    '/analysis_jobs/5',
    5,
    new AnalysisJob(generateAnalysisJob(5))
  );
  validateApiUpdate<AnalysisJob, AnalysisJobsService>(
    '/analysis_jobs/5',
    new AnalysisJob(generateAnalysisJob(5))
  );
});
