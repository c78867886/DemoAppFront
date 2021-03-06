import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GaussianCovariateComponent } from './gaussian-covariate.component';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {ReactiveFormsModule} from '@angular/forms';
import {StudyService} from '../study.service';
import {HttpClient} from '@angular/common/http';
import {MockBackend} from '@angular/http/testing';

describe('GaussianCovariateComponent', () => {
  let component: GaussianCovariateComponent;
  let fixture: ComponentFixture<GaussianCovariateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ GaussianCovariateComponent ],
      providers: [StudyService, {provide: HttpClient, useClass: MockBackend}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GaussianCovariateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it( 'should show ask the user if they want to define a gaussian covatiate,' +
    'if there is not one added and they are not currently editing one.', () => {
    const desc: DebugElement = fixture.debugElement.query(By.css('#firstgaussiancovariate'));
    const el = desc.nativeElement;
    expect(el).toBeTruthy();
  });

  it( 'should ask the user to define a variance for their gaussian covariate when the click the' +
    'define a gaussian covariate button.', () => {
    component.includeGaussianCovariate();
    fixture.detectChanges();
    const desc: DebugElement = fixture.debugElement.query(By.css('#variance'));
    const el = desc.nativeElement;
    expect(el).toBeTruthy();
  });

  it('should add a gaussian covariate object to the study design when the user clicks define button and adds' +
    'a valid value for variance', () => {
    component.includeGaussianCovariate();
    fixture.detectChanges();
    component.gaussianCovariateForm.get('variance').setValue(1);
    component.ngDoCheck();
    fixture.detectChanges();
    expect(component.gaussianCovariate.variance).toEqual(1);
  });
});
