import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionalSpecsCiLowerTailComponent } from './optional-specs-ci-lower-tail.component';
import {ReactiveFormsModule} from '@angular/forms';
import {LoggerModule, NGXLogger, NGXLoggerMock} from 'ngx-logger';
import {StudyService} from '../study.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivatedRouteStub, RouterStub} from '../../../testing/router-stubs';
import {HttpClient} from '@angular/common/http';
import {MockBackend} from '@angular/http/testing';

describe('OptionalSpecsCiLowerTailComponent', () => {
  let component: OptionalSpecsCiLowerTailComponent;
  let fixture: ComponentFixture<OptionalSpecsCiLowerTailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        LoggerModule.forRoot({serverLoggingUrl: 'fake/api/clientsidelog', level: 'DEBUG', serverLogLevel: 'WARN'})
      ],
      declarations: [ OptionalSpecsCiLowerTailComponent ],
      providers: [
        StudyService,
        {provide: Router, useClass: RouterStub},
        {provide: HttpClient, useClass: MockBackend},
        {provide: NGXLogger, useClass: NGXLoggerMock},
        {provide: ActivatedRoute, useClass: ActivatedRouteStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionalSpecsCiLowerTailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});