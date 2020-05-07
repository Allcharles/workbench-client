import { Component, OnInit } from "@angular/core";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { adminDashboardMenuItem } from "@component/admin/admin.menus";
import { adminMenuItemActions } from "@component/admin/dashboard/dashboard.component";
import { Page } from "@helpers/page/pageDecorator";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { Id, toRelative } from "@interfaces/apiInterfaces";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { AudioRecording } from "@models/AudioRecording";
import { List } from "immutable";
import {
  adminAudioRecordingMenuItem,
  adminAudioRecordingsCategory,
  adminAudioRecordingsMenuItem,
} from "../audio-recordings.menus";

@Page({
  category: adminAudioRecordingsCategory,
  menus: {
    links: List(),
    actions: List<AnyMenuItem>([
      adminDashboardMenuItem,
      ...adminMenuItemActions,
    ]),
  },
  self: adminAudioRecordingsMenuItem,
})
@Component({
  selector: "app-admin-audio-recordings",
  templateUrl: "./list.component.html",
})
export class AdminAudioRecordingsComponent
  extends PagedTableTemplate<TableRow, AudioRecording>
  implements OnInit {
  constructor(api: AudioRecordingsService) {
    super(api, (audioRecordings) =>
      audioRecordings.map((audioRecording) => ({
        id: audioRecording.id,
        site: audioRecording.siteId,
        duration: toRelative(audioRecording.duration, {
          largest: 2,
          maxDecimalPoint: 0,
        }),
        recorded: audioRecording.recordedDate.toRelative(),
        model: audioRecording,
      }))
    );
  }

  ngOnInit(): void {
    this.columns = [
      { name: "Id" },
      { name: "Site" },
      { name: "Duration" },
      { name: "Recorded" },
      { name: "Model" },
    ];
    this.sortKeys = {
      id: "id",
      site: "siteId",
      duration: "durationSeconds",
      recorded: "recordedDate",
    };
    this.getPageData();
  }

  /**
   * Path to view audio recording details
   * @param model Audio Recording
   */
  public detailsPath(model: AudioRecording) {
    return adminAudioRecordingMenuItem.route.format({
      audioRecordingId: model.id,
    });
  }
}

interface TableRow {
  id: Id;
  site: Id;
  duration: string;
  recorded: string;
  model: AudioRecording;
}
