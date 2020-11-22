import { Injector } from "@angular/core";
import { DateTimeTimezone, Id } from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { Creator, Updater } from "./AssociationDecorators";
import { BawDateTime, BawPersistAttr } from "./AttributeDecorators";
import type { User } from "./User";

export interface IQuestion {
  id?: Id;
  text?: string;
  data?: Blob | any;
  creatorId?: Id;
  updaterId?: Id;
  createdAt?: DateTimeTimezone | string;
  updatedAt?: DateTimeTimezone | string;
}

export class Question extends AbstractModel implements IQuestion {
  public readonly kind = "Question";
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly text?: string;
  @BawPersistAttr
  public readonly data?: Blob;
  public creatorId?: Id;
  public updaterId?: Id;
  @BawDateTime()
  public createdAt?: DateTimeTimezone;
  @BawDateTime()
  public updatedAt?: DateTimeTimezone;

  // Associations
  @Creator<Question>()
  public creator?: User;
  @Updater<Question>()
  public updater?: User;

  public constructor(question: IQuestion, injector?: Injector) {
    super(question, injector);
  }

  public get viewUrl(): string {
    throw new Error("Question viewUrl not implemented.");
  }
}
