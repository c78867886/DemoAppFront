import {ChangeDetectorRef, Component, Input, OnChanges, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {CorrelationMatrixService} from '../shared/correlationMatrix.service';
import {DifferentMeasures} from '../shared/DifferentMeasures';
import {constants} from '../shared/constants';
import {DiffMeasure} from '../shared/DiffMeasure';
import {DifferentMeasuresService} from '../shared/differentMeasures.service';
import {promise} from 'selenium-webdriver';
import setDefaultFlow = promise.setDefaultFlow;

@Component({
  selector: 'app-different-measures',
  templateUrl: './different-measures.component.html',
  styleUrls: ['./different-measures.component.scss'],
  providers: [CorrelationMatrixService]
})
export class DifferentMeasuresComponent implements OnInit {

  private _differentMeasuresForm: FormGroup;
  private _correlationMatrixSubscription: Subscription;
  private _correlationMatrixValidSubscription: Subscription;
  private _min: number;
  private _max: number;
  private _matrixValid: boolean;

  constructor(
    private _fb: FormBuilder,
    private _differentMeasuresService: DifferentMeasuresService,
    private _correlationMatrixService: CorrelationMatrixService,
    private _differentMeasures: DifferentMeasures,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.min = constants.CORRELATION_MIN;
    this.max = constants.CORRELATION_MAX;
  }

  ngOnInit() {
    this.buildForm();
    this.createMeasuresArray()
    if( this.differentMeasures.differentMeasures.length > 2 ) {
      this.correlationMatrixService.updateSize(this.differentMeasures.differentMeasures.length);
    }
  }

  createMeasuresArray() {
    const controlDefs = [];
    for (const measure of this.differentMeasures.differentMeasures) {
      controlDefs.push(this.fb.group(measure));
    }
    this.differentMeasuresForm.reset({
      diffMeasures: this.fb.array(controlDefs)
    }
    );
    this._changeDetectorRef.detectChanges();
  }

  buildForm(): void {
    this.differentMeasuresForm = this.fb.group({
      diffMeasures: this.fb.array([]),
      correlationType: [this.differentMeasures.correlationType],
      correlationMatrix: this.differentMeasures.correlationMatrix,
      variance: [this.differentMeasures.variance]
    });
  }

  get diffMeasures(): FormArray {
    return this.differentMeasuresForm.get('diffMeasures') as FormArray;
  };

  setDiffMeasures(measures: DiffMeasure[]) {
    const measureFGs = measures.map(measure => this.fb.group(measure));
    const measureFormArray = this.fb.array(measureFGs);
    this.differentMeasuresForm.setControl('diffMeasures', measureFormArray);
  }

  addDiffMeasure() {
    this.differentMeasures.differentMeasures.push(new DiffMeasure);
    this.setDiffMeasures(this.differentMeasures.differentMeasures);
    if( this.differentMeasures.differentMeasures.length >= 2 ) {
      this.correlationMatrixService.updateSize(this.differentMeasures.differentMeasures.length);
    }
    this._changeDetectorRef.detectChanges();
    this.updateCorrelationMatrix();
    if (this.differentMeasures.correlationMatrix && this.differentMeasures.correlationMatrix.values) {
      this._correlationMatrixService.updateCorrelationMatrix(this.differentMeasures.correlationMatrix);
    }
    this.updateMatrixValid();
  }


  updateCorrelationMatrix() {
    this.correlationMatrixSubscription = this.correlationMatrixService.correlationMatrix$.subscribe(
      correlationMatrix => {
        this.differentMeasuresForm.get('correlationMatrix').setValue(correlationMatrix);
        if (correlationMatrix && correlationMatrix.values.size()[0] > 0 ) {
          this.differentMeasures.correlationMatrix = correlationMatrix;
        }
      }
    );
  }

  updateMatrixValid() {
    this.correlationMatrixValidSubscription = this._correlationMatrixService.valid$.subscribe(
      valid => {
        this.matrixValid = valid;
      });
  }

  enableAddMeasureButton(): boolean {
    if (this.differentMeasuresForm.status === 'VALID' && this.matrixValid) {
      return false;
    }
    return true;
  }

  addMeasure() {
    this.differentMeasuresService.updateDifferentMeasures( this.differentMeasures );
  }

  get differentMeasuresForm(): FormGroup {
    return this._differentMeasuresForm;
  }

  set differentMeasuresForm(value: FormGroup) {
    this._differentMeasuresForm = value;
  }

  get correlationMatrixSubscription(): Subscription {
    return this._correlationMatrixSubscription;
  }

  set correlationMatrixSubscription(value: Subscription) {
    this._correlationMatrixSubscription = value;
  }

  get correlationMatrixValidSubscription(): Subscription {
    return this._correlationMatrixValidSubscription;
  }

  set correlationMatrixValidSubscription(value: Subscription) {
    this._correlationMatrixValidSubscription = value;
  }

  get min(): number {
    return this._min;
  }

  set min(value: number) {
    this._min = value;
  }

  get max(): number {
    return this._max;
  }

  set max(value: number) {
    this._max = value;
  }

  get matrixValid(): boolean {
    return this._matrixValid;
  }

  set matrixValid(value: boolean) {
    this._matrixValid = value;
  }

  get fb(): FormBuilder {
    return this._fb;
  }

  set fb(value: FormBuilder) {
    this._fb = value;
  }

  get differentMeasuresService(): DifferentMeasuresService {
    return this._differentMeasuresService;
  }

  set differentMeasuresService(value: DifferentMeasuresService) {
    this._differentMeasuresService = value;
  }

  get correlationMatrixService(): CorrelationMatrixService {
    return this._correlationMatrixService;
  }

  set correlationMatrixService(value: CorrelationMatrixService) {
    this._correlationMatrixService = value;
  }

  get differentMeasures(): DifferentMeasures {
    return this._differentMeasures;
  }

  @Input()
  set differentMeasures(value: DifferentMeasures) {
    this._differentMeasures = value;
  }
}
