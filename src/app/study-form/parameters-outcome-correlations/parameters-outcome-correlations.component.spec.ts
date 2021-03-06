import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametersOutcomeCorrelationsComponent } from './parameters-outcome-correlations.component';
import {CorrelationMatrixComponent} from '../correlation-matrix/correlation-matrix.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MockBackend} from '@angular/http/testing';
import {HttpClient} from '@angular/common/http';
import {LoggerModule, NGXLogger, NGXLoggerMock} from 'ngx-logger';
import {StudyService} from '../study.service';
import {testEnvironment} from '../../../environments/environment.test';

describe('ParametersOutcomeCorrelationsComponent', () => {
  let component: ParametersOutcomeCorrelationsComponent;
  let fixture: ComponentFixture<ParametersOutcomeCorrelationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        LoggerModule.forRoot({
          serverLoggingUrl: testEnvironment.serverLoggingUrl,
          level: testEnvironment.loglevel,
          serverLogLevel: testEnvironment.loglevel
        })
      ],
      declarations: [
        ParametersOutcomeCorrelationsComponent,
        CorrelationMatrixComponent
      ],
      providers: [
        StudyService,
        {provide: HttpClient, useClass: MockBackend},
        {provide: NGXLogger, useClass: NGXLoggerMock}
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametersOutcomeCorrelationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
