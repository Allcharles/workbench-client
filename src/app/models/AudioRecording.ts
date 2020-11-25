import { Injector } from "@angular/core";
import { ACCOUNT, SHALLOW_SITE } from "@baw-api/ServiceTokens";
import { listenMenuItem } from "@helpers/page/externalMenus";
import { Duration } from "luxon";
import {
  DateTimeTimezone,
  HasAllUsers,
  Id,
  Uuid,
} from "../interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { Creator, Deleter, HasOne, Updater } from "./AssociationDecorators";
import { BawDateTime, BawDuration } from "./AttributeDecorators";
import type { Site } from "./Site";
import type { User } from "./User";

/**
 * An audio recording model
 */
export interface IAudioRecording extends HasAllUsers {
  id?: Id;
  uuid?: Uuid;
  uploaderId?: Id;
  recordedDate?: DateTimeTimezone | string;
  siteId?: Id;
  durationSeconds?: number;
  sampleRateHertz?: number;
  channels?: number;
  bitRateBps?: number;
  mediaType?: string;
  dataLengthBytes?: number;
  fileHash?: string;
  status?: AudioRecordingStatus;
  notes?: Blob | any;
  originalFileName?: string;
  recordedUtcOffset?: string;
}

/**
 * An audio recording model
 */
export class AudioRecording extends AbstractModel implements IAudioRecording {
  public readonly kind = "AudioRecording";
  public readonly id?: Id;
  public readonly uuid?: Uuid;
  public readonly uploaderId?: Id;
  @BawDateTime()
  public readonly recordedDate?: DateTimeTimezone;
  public readonly siteId?: Id;
  @BawDuration<AudioRecording>({ key: "durationSeconds" })
  public readonly duration: Duration;
  public readonly durationSeconds?: number;
  public readonly sampleRateHertz?: number;
  public readonly channels?: number;
  public readonly bitRateBps?: number;
  public readonly mediaType?: string;
  public readonly dataLengthBytes?: number;
  public readonly fileHash?: string;
  public readonly status?: AudioRecordingStatus;
  public readonly notes?: Blob;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  public readonly deleterId?: Id;
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly updatedAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly deletedAt?: DateTimeTimezone;
  public readonly originalFileName?: string;
  public readonly recordedUtcOffset?: string;

  // Associations
  @Creator<AudioRecording>()
  public creator?: User;
  @Updater<AudioRecording>()
  public updater?: User;
  @Deleter<AudioRecording>()
  public deleter?: User;
  @HasOne<AudioRecording, User>(ACCOUNT, "uploaderId")
  public uploader?: User;
  @HasOne<AudioRecording, Site>(SHALLOW_SITE, "siteId")
  public site?: Site;

  constructor(audioRecording: IAudioRecording, injector?: Injector) {
    super(audioRecording, injector);
  }

  public get viewUrl(): string {
    console.warn("AudioRecording viewUrl not implement.");
    return listenMenuItem.uri();
  }
}

export type AudioRecordingStatus =
  | "new"
  | "uploading"
  | "to_check"
  | "ready"
  | "corrupt"
  | "aborted";
