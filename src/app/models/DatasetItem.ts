import { Injector } from "@angular/core";
import { AUDIO_RECORDING, DATASET } from "@baw-api/ServiceTokens";
import { DateTimeTimezone, Id } from "@interfaces/apiInterfaces";
import { Observable } from "rxjs";
import {
  AbstractModel,
  BawDateTime,
  BawPersistAttr,
  Creator,
  HasOne,
} from "./AbstractModel";
import type { AudioRecording } from "./AudioRecording";
import type { Dataset } from "./Dataset";
import type { User } from "./User";

export interface IDatasetItem {
  id?: Id;
  datasetId?: Id;
  audioRecordingId?: Id;
  creatorId?: Id;
  createdAt?: DateTimeTimezone | string;
  startTimeSeconds?: number;
  endTimeSeconds?: number;
  order?: number;
}

export class DatasetItem extends AbstractModel implements IDatasetItem {
  public readonly kind: "DatasetItem" = "DatasetItem";
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly datasetId?: Id;
  @BawPersistAttr
  public readonly audioRecordingId?: Id;
  public readonly creatorId?: Id;
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @BawPersistAttr
  public readonly startTimeSeconds?: number;
  @BawPersistAttr
  public readonly endTimeSeconds?: number;
  @BawPersistAttr
  public readonly order?: number;

  // Associations
  @Creator<DatasetItem>()
  public creator?: Observable<User>;
  @HasOne(DATASET, (m: DatasetItem) => m.datasetId)
  public dataset?: Observable<Dataset>;
  @HasOne(AUDIO_RECORDING, (m: DatasetItem) => m.audioRecordingId)
  public audioRecording?: Observable<AudioRecording>;

  constructor(datasetItem: IDatasetItem, injector?: Injector) {
    super(datasetItem, injector);
  }

  public get viewUrl(): string {
    throw new Error("DatasetItem viewUrl not implemented.");
  }
}
