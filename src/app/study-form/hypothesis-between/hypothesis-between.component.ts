import {Component, OnDestroy, OnInit} from '@angular/core';
import {constants} from 'app/shared/constants';
import {StudyService} from '../study.service';
import {Subscription} from 'rxjs/Subscription';
import {ISUFactors} from '../../shared/ISUFactors';
import {isNullOrUndefined} from 'util';
import * as math from 'mathjs';
import {CMatrix} from '../../shared/CMatrix';
import {Router} from '@angular/router';
import {Predictor} from '../../shared/Predictor';
import {Observable} from 'rxjs/Observable';

import {ActivatedRoute, ParamMap} from '@angular/router';

@Component({
  selector: 'app-hypothesis-between',
  templateUrl: './hypothesis-between.component.html',
  styleUrls: ['./hypothesis-between.component.css']
})
export class HypothesisBetweenComponent implements OnInit, OnDestroy {
  private _showAdvancedOptions: boolean;
  private _betweenHypothesisNature: string;
  private _HYPOTHESIS_NATURE = constants.HYPOTHESIS_BETWEEN_NATURE;
  private _isuFactors: ISUFactors;
  private _marginalsIn: Array<CMatrix>;
  private _marginalsOut: Array<CMatrix>;
  private _predictor$: Observable<Predictor>


  private _isuFactorsSubscription: Subscription;
  texString = '';

  constructor(private study_service: StudyService, private router: Router, private route: ActivatedRoute) {
    this.marginalsIn = [];
    this.marginalsOut = [];
    this.showAdvancedOptions = false;

    this.isuFactorsSubscription = this.study_service.isuFactors$.subscribe( isuFactors => {
      this.isuFactors = isuFactors;
    } );
  }

  ngOnInit() {
    // this.predictor$ = this.route.paramMap.switchMap(
    //   (params: ParamMap) => this.getPredictor(params.get('predictor'))
    // );
    this.calculateCMatrix();
  }

  ngOnDestroy() {
    this.isuFactorsSubscription.unsubscribe();
  }

  getPredictors() { return Observable.of(this.isuFactors.predictors); }

  private getPredictor(name: string | any) {
    return this.getPredictors().map(
      predictors => predictors.find(
        predictor => predictor.name === name
      ));
  }

  isSelected(hypothesis: string): boolean {
    return this.betweenHypothesisNature === hypothesis;
  }

  selectHypothesisNature(type: string) {
    this.betweenHypothesisNature = type;
    this.study_service.updateBetweenHypothesisNature(this.betweenHypothesisNature);
    this.calculateCMatrix();
  }

  toggleAdvancedOptions() {
    this.showAdvancedOptions = !this.showAdvancedOptions;
  }

  calculateCMatrix() {
    if (!isNullOrUndefined( this._isuFactors )) {
      this.marginalsIn = [];
      this.marginalsOut = [];
      // work out which between factors are in the hypothesis
      const marginalMatrices = [];
      const betweenFactorsInHypothesis = [];
      const betweenFactorsNotInHypothesis = [];
      this.determineBetweenFactorsinHypothesis(betweenFactorsInHypothesis, betweenFactorsNotInHypothesis);
      this.populateMarginalMatrices(betweenFactorsInHypothesis, marginalMatrices);
      this.populateAverageMatrices(betweenFactorsNotInHypothesis, marginalMatrices);

      const cMatrix = new CMatrix(constants.C_MATRIX_TYPE.CMATRIX);
      let first = marginalMatrices.pop();
      if (isNullOrUndefined(first) || isNullOrUndefined(first.values)) {
        first = new CMatrix(constants.C_MATRIX_TYPE.AVERAGE);
        first.values = math.matrix([[1]]);
      }
      cMatrix.values = first.values;
      if (!isNullOrUndefined(marginalMatrices) && marginalMatrices.length > 0) {
        marginalMatrices.forEach( matrix => {
          cMatrix.values = cMatrix.kronecker(matrix);
        });
      }
      this.texString = cMatrix.toTeX();
    };
  }

  private populateAverageMatrices(betweenFactorsNotInHypothesis: Array<string>, marginalMatrices: Array<CMatrix>) {
    betweenFactorsNotInHypothesis.forEach(name => {
      this._isuFactors.predictors.forEach(value => {
        if (value.name === name) {
          const marginalMatrix = new CMatrix(constants.C_MATRIX_TYPE.AVERAGE);
          marginalMatrix.poopulateAverageMatrix(value.valueNames.length);
          marginalMatrices.push(marginalMatrix);
          marginalMatrix.name = name;
          this.marginalsOut.push(marginalMatrix);
        }
      });
    });
  }

  private populateMarginalMatrices(betweenFactorsInHypothesis: Array<string>, marginalMatrices: Array<CMatrix>) {
    betweenFactorsInHypothesis.forEach(name => {
      this._isuFactors.predictors.forEach(value => {
        if (value.name === name) {
          const marginalMatrix = this.getMarginalCMatrix(value.valueNames.length);
          marginalMatrices.push(marginalMatrix);
          marginalMatrix.name = name;
          this.marginalsIn.push(marginalMatrix);
        }
      });
    });
  }

  private determineBetweenFactorsinHypothesis( inHypothesis: Array<string>, outOfHypothesis: Array<string> ) {
    this._isuFactors.predictors.forEach(predictor => {
      let inEffect = false;
      this._isuFactors.hypothesis.forEach(variable => {
        if ( predictor.compare(variable) ) {
          inHypothesis.push(predictor.name);
          inEffect = true;
        }
      });
      if (inEffect === false) {
        outOfHypothesis.push(predictor.name);
      }
    });
  }

  advancedOptions(name: string) {
    this.router.navigate(['design', constants.STAGES[13], name])
  }

  getMarginalCMatrix (noGroups: number): CMatrix {
    const marginalMatrix = new CMatrix();
    if (isNullOrUndefined(this.betweenHypothesisNature)) {
      this.betweenHypothesisNature = constants.HYPOTHESIS_BETWEEN_NATURE.GLOBAL_TRENDS;
    }
    if (this.betweenHypothesisNature === constants.HYPOTHESIS_BETWEEN_NATURE.GLOBAL_TRENDS) {
        marginalMatrix.type = constants.C_MATRIX_TYPE.MAIN_EFFECT;
        marginalMatrix.populateMainEffect(noGroups);
      } else if (this.betweenHypothesisNature === constants.HYPOTHESIS_BETWEEN_NATURE.POLYNOMIAL) {
        marginalMatrix.type = constants.C_MATRIX_TYPE.POLYNOMIAL;
        marginalMatrix.populatePolynomialEvenSpacing(noGroups);
      } else if (this.betweenHypothesisNature === constants.HYPOTHESIS_BETWEEN_NATURE.IDENTITY) {
        marginalMatrix.type = constants.C_MATRIX_TYPE.IDENTITY;
        marginalMatrix.populateIdentityMatrix(noGroups);
      }
    return marginalMatrix;
  }

  get showAdvancedOptions(): boolean {
    return this._showAdvancedOptions;
  }

  set showAdvancedOptions(value: boolean) {
    this._showAdvancedOptions = value;
  }

  get betweenHypothesisNature(): string {
    return this._betweenHypothesisNature;
  }

  set betweenHypothesisNature(value: string) {
    this._betweenHypothesisNature = value;
  }

  get HYPOTHESIS_NATURE() {
    return this._HYPOTHESIS_NATURE;
  }

  set HYPOTHESIS_NATURE(value) {
    this._HYPOTHESIS_NATURE = value;
  }

  set isuFactorsSubscription(value: Subscription) {
    this._isuFactorsSubscription = value;
  }

  get isuFactorsSubscription(): Subscription {
    return this._isuFactorsSubscription;
  }

  get marginalsIn(): Array<CMatrix> {
    return this._marginalsIn;
  }

  set marginalsIn(value: Array<CMatrix>) {
    this._marginalsIn = value;
  }

  get marginalsOut(): Array<CMatrix> {
    return this._marginalsOut;
  }

  set marginalsOut(value: Array<CMatrix>) {
    this._marginalsOut = value;
  }

  get isuFactors(): ISUFactors {
    return this._isuFactors;
  }

  set isuFactors(value: ISUFactors) {
    this._isuFactors = value;
  }

  get predictor$(): Observable<Predictor> {
    return this._predictor$;
  }

  set predictor$(value: Observable<Predictor>) {
    this._predictor$ = value;
  }
}
