import { Id } from "@interfaces/apiInterfaces";
import { ITagGroup } from "@models/TagGroup";
import { modelData } from "@test/helpers/faker";

export function generateTagGroup(id?: Id): ITagGroup {
  return {
    id: modelData.id(id),
    groupIdentifier: modelData.param(),
    tagId: modelData.id(),
    creatorId: modelData.id(),
    createdAt: modelData.timestamp(),
  };
}
