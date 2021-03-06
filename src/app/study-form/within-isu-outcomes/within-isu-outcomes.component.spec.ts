import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithinIsuOutcomesComponent } from './within-isu-outcomes.component';
import {ReactiveFormsModule} from '@angular/forms';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {NavigationService} from '../../shared/navigation.service';
import {StudyService} from '../study.service';
import {MockBackend} from '@angular/http/testing';
import {HttpClient} from '@angular/common/http';
import {Outcome} from "../../shared/Outcome";

describe('WithinIsuOutcomesComponent', () => {
  let component: WithinIsuOutcomesComponent;
  let fixture: ComponentFixture<WithinIsuOutcomesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ WithinIsuOutcomesComponent ],
      providers: [StudyService, {provide: HttpClient, useClass: MockBackend}, NavigationService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithinIsuOutcomesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should add the current value of the form to the list of outcomes.', () => {
    const val = 'ABC';
    component.outcomesForm.value.outcomes = val;
    component.addOutcome();
    expect(component.outcomes.length).toEqual(1);
    expect(component.outcomes[0].name).toEqual(val);
  });

  it('should remove the selected value of the form to the list of outcomes.', () => {
    const val = 'ABC';
    const outcome = new Outcome(val);
    component.outcomes.push(outcome);
    component.removeOutcome(outcome);
    expect(component.outcomes.length).toEqual(0);
  });

  it('should not add an empty outcome', () => {
    const val = '  ';
    component.outcomesForm.value.outcomes = val;
    component.addOutcome();
    expect(component.outcomes.length).toEqual(0);
  });

  it('should show the appropriate message if we have no outcomes stored', () => {
    fixture.detectChanges();
    const desc: DebugElement = fixture.debugElement.query(By.css('#firstoutcome'));
    const el = desc.nativeElement;
    expect(el).toBeTruthy()
  });

  it('should show the appropriate message if we have outcomes stored and can still add more', () => {
    component.outcomes.push(new Outcome('ABC'));
    fixture.detectChanges();
    const desc: DebugElement = fixture.debugElement.query(By.css('#nextoutcome'));
    const el = desc.nativeElement;
    expect(el).toBeTruthy()
  });

  it('should show the appropriate message if we have reached the outcome limit', () => {
    for (let i = 0; i < component.max; i++) {
      component.outcomes.push(new Outcome('A'))
    }
    fixture.detectChanges();
    const desc: DebugElement = fixture.debugElement.query(By.css('#outcomesfull'));
    const el = desc.nativeElement;
    expect(el).toBeTruthy()
  });

  it('should not allow the user to move on without naming at least one outcome', () => {});
});
