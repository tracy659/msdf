export interface StepModelItem {
  step: string;
  stepEn: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  icon: string;
  color: string;
}

export class StepModel {
  private _step: StepModelItem;

  constructor(step: StepModelItem) {
    this._step = step;
  }

  toJSON(): StepModelItem {
    return { ...this._step };
  }
}
