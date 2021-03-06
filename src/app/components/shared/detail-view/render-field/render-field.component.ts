import { ChangeDetectorRef, Component, Input, OnChanges } from "@angular/core";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import {
  ImageSizes,
  ImageUrl,
  isImageUrl,
  toRelative,
} from "@interfaces/apiInterfaces";
import {
  AbstractModel,
  unknownViewUrl,
  UnresolvedModel,
} from "@models/AbstractModel";
import { DateTime, Duration } from "luxon";
import { Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "baw-render-field",
  template: `
    <!-- Display plain text -->
    <dl *ngIf="styling === fieldStyling.plain">
      <p id="plain" class="m-0">{{ display }}</p>
    </dl>

    <!-- Display code/objects -->
    <dl *ngIf="styling === fieldStyling.code">
      <pre id="code" class="m-0">{{ display }}</pre>
    </dl>

    <!-- Display checkbox -->
    <dl *ngIf="styling === fieldStyling.checkbox">
      <baw-checkbox
        id="checkbox"
        class="m-0"
        [checked]="isChecked()"
        [disabled]="true"
        [isCentered]="false"
      ></baw-checkbox>
    </dl>

    <!-- Display AbstractModel -->
    <dl *ngIf="styling === fieldStyling.model">
      <a
        *ngIf="hasViewUrl(); else noViewUrl"
        id="model"
        [bawUrl]="model.viewUrl"
      >
        {{ model }}
      </a>
      <ng-template #noViewUrl>
        <span id="model">{{ model }}</span>
      </ng-template>
    </dl>

    <!-- Display Image -->
    <dl *ngIf="styling === fieldStyling.image">
      <img id="image" alt="model image alt" [src]="getSource()" />
    </dl>

    <!-- Display nested fields -->
    <ng-container *ngIf="styling === fieldStyling.children">
      <baw-render-field
        *ngFor="let child of children"
        id="children"
        [value]="child"
      ></baw-render-field>
    </ng-container>
  `,
  styles: [
    `
      img {
        display: block;
        max-width: 400px;
        max-height: 400px;
        margin-left: auto;
        margin-right: auto;
      }
    `,
  ],
})
export class RenderFieldComponent
  extends withUnsubscribe()
  implements OnChanges {
  @Input() public value: ModelView;
  public children: ModelView[];
  public display: string | number | boolean | ImageUrl[];
  public fieldStyling = FieldStyling;
  public model: AbstractModel;
  public styling: FieldStyling = FieldStyling.plain;
  private errorText = "(error)";
  private loadingText = "(loading)";
  private noValueText = "(no value)";

  public constructor(private ref: ChangeDetectorRef) {
    super();
  }
  public ngOnChanges(): void {
    this.humanize(this.value);
  }

  public isChecked(): boolean {
    return this.display as boolean;
  }

  public getSource(): ImageUrl[] {
    return this.display as ImageUrl[];
  }

  public hasViewUrl() {
    try {
      return (
        isInstantiated(this.model.viewUrl) &&
        this.model.viewUrl !== unknownViewUrl
      );
    } catch (err) {
      return false;
    }
  }

  private humanize(value: ModelView) {
    if (!isInstantiated(value)) {
      this.display = this.noValueText;
    } else if (value instanceof DateTime) {
      this.display = humanizeDateTime(value);
    } else if (value instanceof Duration) {
      this.display = `${value.toISO()} (${toRelative(value)})`;
    } else if (value instanceof Array) {
      this.humanizeArray(value);
    } else if (value instanceof Blob) {
      this.humanizeBlob(value);
    } else if (value instanceof Observable) {
      this.humanizeObservable(value);
    } else if (value instanceof AbstractModel) {
      this.humanizeAbstractModel(value);
    } else if (typeof value === "object") {
      // TODO Implement optional treeview
      this.humanizeObject(value);
    } else if (typeof value === "boolean") {
      this.styling = FieldStyling.checkbox;
      this.display = value;
    } else if (typeof value === "string") {
      this.humanizeString(value);
    } else {
      this.display = value.toString();
    }
  }

  /**
   * Convert abstract model to human readable output
   *
   * @param value Display input
   */
  private humanizeAbstractModel(value: AbstractModel) {
    if (value instanceof UnresolvedModel) {
      this.setLoading();
    } else {
      this.styling = FieldStyling.model;
      this.display = "";
      this.model = value;
    }
  }

  /**
   * Convert string to human readable output. Currently this only checks if the
   * string is an image url.
   *
   * @param value Display input
   */
  private humanizeString(value: string) {
    this.display = value;

    this.isImage(
      value,
      () => {
        // String is image URL, display image
        this.styling = FieldStyling.image;
        this.display = [{ url: value, size: ImageSizes.unknown }];
        this.ref.detectChanges();
      },
      () => {}
    );
  }

  /**
   * Convert object to human readable output
   *
   * @param value Display input
   */
  private humanizeObject(value: Record<string, any>) {
    this.setLoading();

    try {
      this.styling = FieldStyling.code;
      this.display = JSON.stringify(value);
    } catch (err) {
      this.display = this.errorText;
    }
  }

  /**
   * Convert blob to human readable output
   *
   * @param value Display input
   */
  private humanizeBlob(value: Blob) {
    this.setLoading();
    // TODO Implement new method (https://developer.mozilla.org/en-US/docs/Web/API/Blob/text)
    const reader = new FileReader();
    reader.addEventListener("loadend", (e) => {
      this.styling = FieldStyling.code;
      this.display = e.target.result.toString();
    });
    reader.onerror = () => {
      this.display = this.errorText;
      reader.abort();
    };
    reader.readAsText(value);
  }

  /**
   * Convert observable to human readable output
   *
   * @param value Display input
   */
  private humanizeObservable(
    value: Observable<AbstractModel | AbstractModel[]>
  ) {
    this.setLoading();
    value.pipe(takeUntil(this.unsubscribe)).subscribe(
      (models) => {
        this.humanize(models);
        this.ref.detectChanges();
      },
      () => {
        this.display = this.errorText;
        this.ref.detectChanges();
      }
    );
  }

  /**
   * Convert array to human readable output. This also handles
   * an array of image urls.
   *
   * @param value Display input
   */
  private humanizeArray(value: ModelView[] | ImageUrl[]) {
    if (value.length > 0) {
      if (isImageUrl(value[0])) {
        this.styling = FieldStyling.image;
        this.display = value as ImageUrl[];
      } else {
        this.styling = FieldStyling.children;
        this.children = value;
      }
    } else {
      this.display = this.noValueText;
    }
  }

  /**
   * Indicate view is still loading
   */
  private setLoading() {
    this.styling = FieldStyling.plain;
    this.display = this.loadingText;
  }

  /**
   * Determine if image is valid
   * ! This function is untested, edit carefully
   *
   * @param src Source URL
   * @param validCallback Valid image callback
   * @param invalidCallback Invalid image callback
   */
  private isImage(
    src: string,
    validCallback: () => void,
    invalidCallback: () => void
  ) {
    // Url from https://urlregex.com/
    // eslint-disable-next-line max-len, no-useless-escape
    const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
    if (!urlRegex.test(src)) {
      invalidCallback();
      return;
    }

    const img = new Image();
    img.onload = validCallback;
    img.onerror = invalidCallback;
    img.src = src;
  }
}

/**
 * Create a human readable datetime string
 *
 * @param value DateTime value
 */
export function humanizeDateTime(value: DateTime): string {
  return `${value.toISO()} (${value.toRelative()})`;
}

export type ModelView =
  | undefined
  | string
  | number
  | boolean
  | DateTime
  | Duration
  | AbstractModel
  | Blob
  | Record<string, any>
  | ImageUrl[]
  | ModelView[];

enum FieldStyling {
  checkbox,
  code,
  plain,
  route,
  model,
  image,
  children,
}
