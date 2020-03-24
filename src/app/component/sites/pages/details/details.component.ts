import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { PermissionsShieldComponent } from "src/app/component/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "src/app/component/shared/widget/widgetItem";
import { exploreAudioMenuItem } from "src/app/helpers/page/externalMenus";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { DateTimeTimezone } from "src/app/interfaces/apiInterfaces";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { AudioRecording } from "src/app/models/AudioRecording";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { projectResolvers } from "src/app/services/baw-api/projects.service";
import { ResolvedModel } from "src/app/services/baw-api/resolver-common";
import { siteResolvers } from "src/app/services/baw-api/sites.service";
import {
  annotationsMenuItem,
  deleteSiteMenuItem,
  editSiteMenuItem,
  harvestMenuItem,
  siteMenuItem,
  sitesCategory
} from "../../sites.menus";

export const siteMenuItemActions = [
  exploreAudioMenuItem,
  annotationsMenuItem,
  editSiteMenuItem,
  harvestMenuItem,
  deleteSiteMenuItem
];

/**
 * Site Details Component
 */
@Page({
  category: sitesCategory,
  menus: {
    actions: List<AnyMenuItem>(siteMenuItemActions),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
    links: List()
  },
  resolvers: {
    project: projectResolvers.show,
    site: siteResolvers.show
  },
  self: siteMenuItem
})
@Component({
  selector: "app-sites-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"]
})
export class DetailsComponent extends PageComponent implements OnInit {
  public project: Project;
  public recordings: AudioRecording[];
  public recordingsEnd: DateTimeTimezone;
  public recordingsStart: DateTimeTimezone;
  public site: Site;

  constructor(private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    const projectModel: ResolvedModel<Project> = this.route.snapshot.data
      .project;
    const siteModel: ResolvedModel<Site> = this.route.snapshot.data.site;

    if (projectModel.error || siteModel.error) {
      return;
    }

    this.project = projectModel.model;
    this.site = siteModel.model;
    this.recordings = [];

    // Retrieve audio recording details
    // this.route.params
    //   .pipe(
    //     flatMap(params => {
    //       return this.audioRecordingApi.getAudioRecordings(params.siteId, {
    //         items: 100
    //       });
    //     }),
    //     takeUntil(this.unsubscribe)
    //   )
    //   .subscribe(
    //     recordings => {
    //       this.recordings = recordings;
    //       this.extremityDates(recordings);
    //     },
    //     () => {
    //       // Doesn't break things if audio recordings don't load
    //       this.recordings = [];
    //     }
    //   );
  }

  extremityDates(recordings: AudioRecording[]) {
    let startDate: DateTimeTimezone = null;
    let endDate: DateTimeTimezone = null;

    recordings.map(recording => {
      if (!startDate || recording.recordedDate < startDate) {
        startDate = recording.recordedDate;
      }
      if (!endDate || recording.recordedDate > endDate) {
        endDate = recording.recordedDate;
      }
    });

    this.recordingsStart = startDate;
    this.recordingsEnd = endDate;
  }
}
