import {
  DateTimeTimezone,
  dateTimeTimezone,
  Id,
  Param,
} from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";

export interface IStudies {
  id?: Id;
  name?: Param;
  creatorId?: Id;
  updaterId?: Id;
  datasetId?: Id;
  createdAt?: DateTimeTimezone | string;
  updatedAt?: DateTimeTimezone | string;
}

export class Studies extends AbstractModel implements IStudies {
  public readonly kind: "Studies" = "Studies";
  public readonly id?: Id;
  public readonly name?: Param;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  public readonly datasetId?: Id;
  public readonly createdAt?: DateTimeTimezone;
  public readonly updatedAt?: DateTimeTimezone;

  constructor(studies: IStudies) {
    super(studies);

    this.createdAt = dateTimeTimezone(studies.createdAt as string);
    this.updatedAt = dateTimeTimezone(studies.updatedAt as string);
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      datasetId: this.datasetId,
    };
  }

  public navigationPath(): string {
    return "/BROKEN_LINK";
  }
}
