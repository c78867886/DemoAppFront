import { Component, OnInit } from '@angular/core';
import {StudyService} from '../study.service';

@Component({
  selector: 'app-user-mode',
  templateUrl: './user-mode.component.html',
  styleUrls: ['./user-mode.component.scss']
})
export class UserModeComponent implements OnInit {
  guided: boolean;

  constructor(private study_service: StudyService) {}

  selectGuided() {
    this.guided = true;
    this.study_service.selectMode(this.guided);
  }

  selectFlex() {
    this.guided = false;
    this.study_service.selectMode(this.guided);
  }

  ngOnInit() {
    this.selectGuided();
  }

}
