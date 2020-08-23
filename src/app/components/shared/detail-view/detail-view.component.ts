import { Component, Input } from "@angular/core";
import { AbstractModel } from "@models/AbstractModel";
import { FormlyFieldConfig } from "@ngx-formly/core";

@Component({
  selector: "baw-detail-view",
  template: `
    <div *ngFor="let field of fields" class="row">
      <dt class="col-sm-3 text-left text-sm-right font-weight-bold">
        {{ field.templateOptions.label }}
      </dt>
      <baw-render-field
        class="col-sm-9"
        [value]="model[field.key]"
      ></baw-render-field>
    </div>
  `,
  styles: [
    `
      dt {
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class DetailViewComponent {
  @Input() public fields: FormlyFieldConfig[];
  @Input() public model: AbstractModel;

  constructor() {}
}