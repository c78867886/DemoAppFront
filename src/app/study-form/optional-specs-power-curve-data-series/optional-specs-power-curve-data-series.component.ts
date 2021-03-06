import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {isNullOrUndefined} from 'util';
import {StudyService} from '../study.service';
import {constants} from '../../shared/constants';
import {PowerCurveDataSeries} from '../../shared/PowerCurveDataSeries';
import {PowerCurve} from '../../shared/PowerCurve';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-optional-specs-power-data-series',
  templateUrl: './optional-specs-power-curve-data-series.component.html',
  styleUrls: ['./optional-specs-power-curve-data-series.component.scss']
})
export class OptionalSpecsPowerCurveDataSeriesComponent implements OnInit, OnDestroy {
  private _solveForSubscription: Subscription;
  private _powerSubscription: Subscription;
  private _typeOneErrorRateSubscription: Subscription;
  private _meanScaleFactorSubscription: Subscription;
  private _varianceScaleFactorsSubscription: Subscription;
  private _powerCurveSubscription: Subscription;

  private _powerCurve: PowerCurve;
  private _solveFor: string;
  private _power: number;
  private _typeOneErrorRate: number;
  private _meanScaleFactor: number;
  private _varianceScaleFactors: number[];

  private _selectedPower: number;
  private _selectedTypeOneErrorRate: number;
  private _selectedMeanScaleFactor: number;
  private _selectedVarianceScaleFactor: number;

  private hasPower: boolean;
  private hasMeanScaleFactors: boolean;
  private hasVarianceScaleFactors: boolean;

  constructor(private study_service: StudyService, private log: NGXLogger) {
    this._powerCurveSubscription = this.study_service.powerCurve$.subscribe(powerCurve => {
      this._powerCurve = powerCurve;
    });
    this.powerSubscription = this.study_service.power$.subscribe(
      power => {
        this.power = power;
      }
    );
    this.solveForSubscription = this.study_service.solveForSelected$.subscribe(
      solveFor => {
        this.solveFor = solveFor;
        if (this.solveFor === constants.SOLVE_FOR_SAMPLESIZE) {
          this.hasPower = true;
          this.selectedPower = this.power;
        } else {
          this.hasPower = false;
        }
      }
    );
    this.typeOneErrorRateSubscription = this.study_service.typeOneErrorRate$.subscribe(
      typeOneErrorRate => {
        this.typeOneErrorRate = typeOneErrorRate
        this.selectedTypeOneErrorRate = this.typeOneErrorRate;
      });
    this.meanScaleFactorSubscription = this.study_service.scaleFactor$.subscribe(
      scaleFactor => {
        this.meanScaleFactor = scaleFactor
        if (!isNullOrUndefined(this.meanScaleFactor)) {
          this.hasMeanScaleFactors = true;
          this.selectedMeanScaleFactor = this.meanScaleFactor;
        } else {
          this.hasMeanScaleFactors = false;
        }
      }
    );
    this.varianceScaleFactorsSubscription = this.study_service.varianceScaleFactors$.subscribe(
      factors => {
        this.varianceScaleFactors = factors;
        if (!isNullOrUndefined(this.varianceScaleFactors) && this.varianceScaleFactors.length > 0) {
          this.hasVarianceScaleFactors = true;
          this.selectedVarianceScaleFactor = this.varianceScaleFactors[0];
        } else {
          this.hasVarianceScaleFactors = false;
        }
      }
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.solveForSubscription.unsubscribe();
    this.powerSubscription.unsubscribe();
    this.typeOneErrorRateSubscription.unsubscribe();
    this.meanScaleFactorSubscription.unsubscribe();
    this.varianceScaleFactorsSubscription.unsubscribe();
  }

  selectPower(power: number) {
    this.selectedPower = power;
  }

  selectTypeOneErrorRate(rate: number) {
    this.selectedTypeOneErrorRate = rate;
  }

  selectMeanScaleFactor(factor: number) {
    this.selectedMeanScaleFactor = factor;
  }

  selectVarianceScaleFactor(factor: number) {
    this.selectedVarianceScaleFactor = factor;
  }

  addDataSeries() {
    this.log.debug( 'add data series' )
    if (!isNullOrUndefined(this.powerCurve)) {
      const series = new PowerCurveDataSeries(
        this.selectedPower,
        this.selectedTypeOneErrorRate,
        this.selectedMeanScaleFactor,
        this.selectedVarianceScaleFactor
      );
      // do not add duplicate data series.
      let newSeries = true;
      this.powerCurve.dataSeries.forEach( existingSeries => {
        if (series.equals(existingSeries)) {
          newSeries = false;
        }
      });
      if (newSeries) {
        this.powerCurve.dataSeries.push(series);
      }
    }
  }

  removeDataSeries(seriesToRemove: PowerCurveDataSeries) {
    if (!isNullOrUndefined(this.powerCurve)) {
      const index = this.powerCurve.dataSeries.indexOf(seriesToRemove);
      if ( index > -1) {
        this.powerCurve.dataSeries.splice(index, 1);
      }
    }
  }

  get dataSeries(): PowerCurveDataSeries[] {
    if (!isNullOrUndefined(this.powerCurve)) {
      return this.powerCurve.dataSeries;
    } else {
      return [];
    }
  }

  get solveForSubscription(): Subscription {
    return this._solveForSubscription;
  }

  set solveForSubscription(value: Subscription) {
    this._solveForSubscription = value;
  }

  get powerSubscription(): Subscription {
    return this._powerSubscription;
  }

  set powerSubscription(value: Subscription) {
    this._powerSubscription = value;
  }

  get typeOneErrorRateSubscription(): Subscription {
    return this._typeOneErrorRateSubscription;
  }

  set typeOneErrorRateSubscription(value: Subscription) {
    this._typeOneErrorRateSubscription = value;
  }

  get varianceScaleFactorsSubscription(): Subscription {
    return this._varianceScaleFactorsSubscription;
  }

  set varianceScaleFactorsSubscription(value: Subscription) {
    this._varianceScaleFactorsSubscription = value;
  }

  get meanScaleFactorSubscription(): Subscription {
    return this._meanScaleFactorSubscription;
  }

  set meanScaleFactorSubscription(value: Subscription) {
    this._meanScaleFactorSubscription = value;
  }

  get solveFor(): string {
    return this._solveFor;
  }

  set solveFor(value: string) {
    this._solveFor = value;
  }

  get power(): number {
    return this._power;
  }

  set power(value: number) {
    this._power = value;
  }

  get typeOneErrorRate(): number {
    return this._typeOneErrorRate;
  }

  set typeOneErrorRate(value: number) {
    this._typeOneErrorRate = value;
  }

  get meanScaleFactor(): number {
    return this._meanScaleFactor;
  }

  set meanScaleFactor(value: number) {
    this._meanScaleFactor = value;
  }

  get varianceScaleFactors(): number[] {
    return this._varianceScaleFactors;
  }

  set varianceScaleFactors(value: number[]) {
    this._varianceScaleFactors = value;
  }

  get selectedPower(): number {
    return this._selectedPower;
  }

  set selectedPower(value: number) {
    this._selectedPower = value;
  }

  get selectedTypeOneErrorRate(): number {
    return this._selectedTypeOneErrorRate;
  }

  set selectedTypeOneErrorRate(value: number) {
    this._selectedTypeOneErrorRate = value;
  }

  get selectedMeanScaleFactor(): number {
    return this._selectedMeanScaleFactor;
  }

  set selectedMeanScaleFactor(value: number) {
    this._selectedMeanScaleFactor = value;
  }

  get selectedVarianceScaleFactor(): number {
    return this._selectedVarianceScaleFactor;
  }

  set selectedVarianceScaleFactor(value: number) {
    this._selectedVarianceScaleFactor = value;
  }

  get powerCurveSubscription(): Subscription {
    return this._powerCurveSubscription;
  }

  set powerCurveSubscription(value: Subscription) {
    this._powerCurveSubscription = value;
  }

  get powerCurve(): PowerCurve {
    return this._powerCurve;
  }

  set powerCurve(value: PowerCurve) {
    this._powerCurve = value;
  }
}
