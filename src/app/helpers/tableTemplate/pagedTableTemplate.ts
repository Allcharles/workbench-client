import { ViewChild } from "@angular/core";
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
  SortType,
  TableColumn
} from "@swimlane/ngx-datatable";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import { AbstractModel } from "src/app/models/AbstractModel";
import { ApiFilter } from "src/app/services/baw-api/api-common";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { Filters } from "src/app/services/baw-api/baw-api.service";
import { PageComponent } from "../page/pageComponent";

/**
 * Paged Template Class.
 * Handles creating all the generic logic required for a datatable containing component
 * which requires the use of external sorting and paging.
 */
export abstract class PagedTableTemplate<
  T,
  M extends AbstractModel
> extends PageComponent {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Table variables
  public ColumnMode = ColumnMode;
  public SortType = SortType;
  public SelectionType = SelectionType;
  public columns: TableColumn[] = [];
  public rows: T[];
  public selected: T[] = [];
  public sortKeys: { [key: string]: string };
  public filterKey: string;
  public totalModels: number;

  // State variables
  public error: ApiErrorDetails;
  public loadingData: boolean;
  public pageNumber: number;
  public filterEvent$ = new Subject<string>();
  protected filters: Filters;

  constructor(
    private api: ApiFilter<any, any>,
    private rowsCallback: (models: M[]) => T[]
  ) {
    super();
    this.pageNumber = 0;
    this.filters = {};
    this.filterEvent$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        () => {
          this.getModels();
        },
        // Filter event doesn't have an error output
        err => {}
      );
  }

  public setPage(pageInfo: TablePage) {
    this.pageNumber = pageInfo.offset;
    this.filters.paging = {
      page: pageInfo.offset + 1
    };

    this.getModels();
  }

  public onFilter(filter: KeyboardEvent) {
    const filterText = (filter.target as HTMLInputElement).value;

    if (!filterText) {
      this.filters.filter = undefined;
    } else {
      this.filters.filter = {
        [this.filterKey]: {
          contains: filterText
        }
      };
    }

    this.filterEvent$.next(filterText);
  }

  public onSort(event: SortEvent) {
    if (!event.newValue) {
      this.filters.sorting = undefined;
    } else {
      this.filters.sorting = {
        orderBy: this.sortKeys[event.column.prop],
        direction: event.newValue
      };
    }

    this.getModels();
  }

  public getModels() {
    this.loadingData = true;
    this.rows = [];

    this.api
      .filter(this.filters)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        models => {
          this.rows = this.rowsCallback(models);
          this.loadingData = false;

          if (models.length > 0) {
            const meta = models[0].getMetadata();
            this.totalModels = meta.paging.total;
          } else {
            this.totalModels = 0;
          }
        },
        (err: ApiErrorDetails) => {
          this.error = err;
          this.rows = undefined;
          this.loadingData = false;
        }
      );
  }
}

export interface TablePage {
  count: number;
  pageSize: number;
  limit: number;
  offset: number;
}

export interface SortEvent {
  newValue: "asc" | "desc";
  prevValue: "asc" | "desc";
  column: {
    sortable: boolean;
    prop: string;
    name: string;
  };
}
