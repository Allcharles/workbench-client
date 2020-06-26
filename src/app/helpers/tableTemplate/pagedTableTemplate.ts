import { OnInit, ViewChild, Directive } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ResolvedModelList, retrieveResolvers } from "@baw-api/resolver-common";
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
  SortType,
  TableColumn,
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
@Directive()
export abstract class PagedTableTemplate<T, M extends AbstractModel>
  extends PageComponent
  implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Table variables
  public ColumnMode = ColumnMode;
  public SortType = SortType;
  public SelectionType = SelectionType;
  public columns: TableColumn[] = [];
  public rows: T[];
  public selected: T[] = [];
  public sortKeys: { [key: string]: string };
  public filterKey: keyof M;
  public totalModels: number;

  /**
   * API Error Response for Table Data
   */
  public error: ApiErrorDetails;
  /**
   * API Error Response from Resolvers
   */
  public failure: boolean;
  public loadingData: boolean;
  public models: ResolvedModelList = {};
  public pageNumber: number;
  public filterEvent$ = new Subject<string>();
  private filters: Filters<M>;

  constructor(
    protected api: ApiFilter<any, any>,
    private rowsCallback: (models: M[]) => T[],
    private route?: ActivatedRoute,
    private getUrlParameters: (component: any) => AbstractModel[] = () => []
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
          this.getPageData();
        },
        // Filter event doesn't have an error output
        (err) => {}
      );
  }

  ngOnInit() {
    if (this.route) {
      // Retrieve models
      const resolvedModels = retrieveResolvers(this.route.snapshot.data);
      if (!resolvedModels) {
        this.failure = true;
        return;
      }
      this.models = resolvedModels;
    }

    this.getPageData();
  }

  public setPage(pageInfo: TablePage) {
    this.pageNumber = pageInfo.offset;
    this.filters.paging = {
      page: pageInfo.offset + 1,
    };

    this.getPageData();
  }

  public onFilter(filter: KeyboardEvent) {
    const filterText = (filter.target as HTMLInputElement).value;

    if (!filterText) {
      this.filters.filter = undefined;
    } else {
      this.filters.filter = {
        // TODO Figure out how to get this typing working
        [this.filterKey as any]: {
          contains: filterText,
        },
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
        direction: event.newValue,
      };
    }

    this.getPageData();
  }

  public getPageData() {
    this.loadingData = true;
    this.rows = [];

    this.apiAction(this.filters, this.getUrlParameters(this))
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (models) => {
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

  protected apiAction(filters: Filters<M>, args: AbstractModel[]) {
    return this.api.filter(filters, ...args);
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
