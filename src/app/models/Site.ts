import { Injector } from "@angular/core";
import { IdOr } from "@baw-api/api-common";
import { PROJECT } from "@baw-api/ServiceTokens";
import { siteMenuItem } from "../component/sites/sites.menus";
import {
  DateTimeTimezone,
  Description,
  Id,
  Ids,
  ImageUrl,
  Param,
  TimezoneInformation,
} from "../interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { Creator, HasMany, Updater } from "./AssociationDecorators";
import {
  BawCollection,
  BawDateTime,
  BawImage,
  BawPersistAttr,
} from "./AttributeDecorators";
import type { Project } from "./Project";
import type { User } from "./User";

/**
 * A site model.
 */
export interface ISite {
  id?: Id;
  name?: Param;
  imageUrl?: string;
  description?: Description;
  locationObfuscated?: boolean;
  creatorId?: Id;
  updaterId?: Id;
  createdAt?: DateTimeTimezone | string;
  updatedAt?: DateTimeTimezone | string;
  projectIds?: Ids | Id[];
  latitude?: number;
  customLatitude?: number;
  longitude?: number;
  customLongitude?: number;
  tzinfoTz?: string;
  timezoneInformation?: TimezoneInformation;
}

/**
 * A site model.
 */
export class Site extends AbstractModel implements ISite {
  public readonly kind = "Site";
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly name?: Param;
  @BawPersistAttr
  public readonly imageUrl?: string;
  @BawImage<Site>("/assets/images/site/site_span4.png", {
    key: "imageUrl",
  })
  public readonly image?: ImageUrl[];
  @BawPersistAttr
  public readonly description?: Description;
  public readonly locationObfuscated?: boolean;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly updatedAt?: DateTimeTimezone;
  @BawCollection({ persist: true })
  public readonly projectIds?: Ids;
  @BawPersistAttr
  public readonly latitude?: number;
  public readonly customLatitude?: number;
  @BawPersistAttr
  public readonly longitude?: number;
  public readonly customLongitude?: number;
  @BawPersistAttr
  public readonly tzinfoTz?: string;
  public readonly timezoneInformation?: TimezoneInformation;

  // Associations
  @Creator<Site>()
  public creator?: User;
  @Updater<Site>()
  public updater?: User;
  @HasMany<Site>(PROJECT, "projectIds")
  public projects?: Project[];

  constructor(site: ISite, injector?: Injector) {
    super(site, injector);

    this.tzinfoTz = this.tzinfoTz ?? this.timezoneInformation?.identifier;

    // This only affects admins, owners, and if not coordinate is set
    if (!this.locationObfuscated) {
      this.latitude = this.latitude ?? this.customLatitude;
      this.longitude = this.longitude ?? this.customLongitude;
    }
  }

  public get viewUrl(): string {
    if (this.projectIds.size === 0) {
      console.error("Site model has no project id, cannot find url.");
      return "";
    }

    return siteMenuItem.route.format({
      projectId: this.projectIds.values().next().value,
      siteId: this.id,
    });
  }

  public getViewUrl(project: IdOr<Project>): string {
    return siteMenuItem.route.format({
      projectId: typeof project === "number" ? project : project.id,
      siteId: this.id,
    });
  }
}
