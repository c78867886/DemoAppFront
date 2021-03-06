import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametersGaussianCovariateCorrelationComponent } from './parameters-gaussian-covariate-correlation.component';
import {MockBackend} from "@angular/http/testing";
import {HttpClient} from '@angular/common/http';
import {StudyService} from "../study.service";

describe('ParametersGaussianCovariateCorrelationComponent', () => {
  let component: ParametersGaussianCovariateCorrelationComponent;
  let fixture: ComponentFixture<ParametersGaussianCovariateCorrelationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametersGaussianCovariateCorrelationComponent ],
      providers: [
        StudyService,
        {provide: HttpClient, useClass: MockBackend}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametersGaussianCovariateCorrelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
