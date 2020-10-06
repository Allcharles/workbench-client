import { Component, OnInit } from "@angular/core";
import { PageComponent } from "@helpers/page/pageComponent";
import { AppConfigService } from "@services/app-config/app-config.service";
import { List } from "immutable";
import { siteHarvestMenuItem, sitesCategory } from "../../sites.menus";
import { siteMenuItemActions } from "../details/site.component";

/**
 * Site Harvest Component
 */
@Component({
  selector: "app-sites-harvest",
  template: `
    <baw-wip>
      <baw-cms [page]="page"></baw-cms>
    </baw-wip>
  `,
})
class HarvestComponent extends PageComponent implements OnInit {
  public page: string;

  constructor(private env: AppConfigService) {
    super();
  }

  public ngOnInit() {
    this.page = this.env.getCms("harvest");
  }
}

HarvestComponent.LinkComponentToPageInfo({
  category: sitesCategory,
  menus: { actions: List(siteMenuItemActions) },
}).AndMenuRoute(siteHarvestMenuItem);

export { HarvestComponent };
