import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { PageComponent } from "@helpers/page/pageComponent";
import { AppConfigService } from "@services/app-config/app-config.service";
import { sendAudioCategory, sendAudioMenuItem } from "./send-audio.menus";

@Component({
  selector: "baw-send-audio",
  template: `
    <baw-wip>
      <baw-cms [page]="page"></baw-cms>
    </baw-wip>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class SendAudioComponent extends PageComponent implements OnInit {
  public page: string;

  constructor(private env: AppConfigService) {
    super();
  }

  public ngOnInit() {
    this.page = this.env.getCms("sendAudio");
  }
}

SendAudioComponent.LinkComponentToPageInfo({
  category: sendAudioCategory,
}).AndMenuRoute(sendAudioMenuItem);

export { SendAudioComponent };
