import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { aboutCategory, ethicsMenuItem } from "@component/about/about.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { Page } from "@helpers/page/pageDecorator";
import { AppConfigService } from "@services/app-config/app-config.service";
import { List } from "immutable";

@Page({
  category: aboutCategory,
  menus: {
    actions: List(),
    links: List(),
  },
  self: ethicsMenuItem,
})
@Component({
  selector: "app-about-ethics",
  template: ` <baw-cms [page]="page"></baw-cms> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EthicsComponent extends PageComponent implements OnInit {
  public page: string;

  constructor(private env: AppConfigService) {
    super();
  }

  ngOnInit() {
    this.page = this.env.values.cms.ethics;
  }
}
