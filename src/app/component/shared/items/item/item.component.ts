import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Href } from "src/app/interfaces/menusInterfaces";
import { StrongRoute } from "src/app/interfaces/strongRoute";

@Component({
  selector: "app-items-item",
  template: `
    <div class="clearfix" style="font-size: 0.925rem;">
      <fa-icon id="icon" [icon]="icon"></fa-icon>
      <span id="name">
        {{ name }}
      </span>
      <span id="value" class="badge badge-pill badge-secondary float-right">
        {{ value }}
      </span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponent {
  @Input() icon: IconProp;
  @Input() name: string;
  @Input() value: string | number;
  @Input() uri: Href | StrongRoute;

  constructor() {}
}

export interface ItemInterface {
  icon: IconProp;
  name: string;
  value: string | number;
  uri?: Href | StrongRoute;
}
