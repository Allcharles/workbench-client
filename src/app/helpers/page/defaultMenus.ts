import { List } from "immutable";
import { dataRequestMenuItem } from "src/app/component/data-request/data-request.menus";
import { homeCategory, homeMenuItem } from "src/app/component/home/home.menus";
import { myAccountMenuItem } from "src/app/component/profile/profile.menus";
import { projectsMenuItem } from "src/app/component/projects/projects.menus";
import { reportProblemMenuItem } from "src/app/component/report-problem/report-problem.menus";
import {
  loginMenuItem,
  registerMenuItem
} from "src/app/component/security/security.menus";
import { statisticsMenuItem } from "src/app/component/statistics/statistics.menus";
import {
  MenuLink,
  NavigableMenuItem
} from "src/app/interfaces/menusInterfaces";

export const DefaultMenu = {
  contextLinks: List<NavigableMenuItem>([
    homeMenuItem,
    loginMenuItem,
    registerMenuItem,
    myAccountMenuItem,
    MenuLink({
      icon: ["fas", "border-all"],
      label: "My Annotations",
      tooltip: () => "View my recent annotations",
      predicate: user => !!user,
      order: 3,
      uri: () => "REPLACE_ME"
    }),
    projectsMenuItem,
    MenuLink({
      icon: ["fas", "server"],
      label: "Audio Analysis",
      tooltip: () => "View audio analysis jobs",
      order: 5,
      uri: (bawUrl, _) => bawUrl + "/audio_analysis"
    }),
    MenuLink({
      icon: ["fas", "book"],
      label: "Library",
      tooltip: () => "Annotation library",
      order: 6,
      uri: (bawUrl, _) => bawUrl + "/library"
    }),
    dataRequestMenuItem,
    MenuLink({
      icon: ["fas", "envelope"],
      label: "Send Audio",
      tooltip: () => "Send us audio recordings to upload",
      order: 8,
      uri: () => "REPLACE_ME"
    }),
    reportProblemMenuItem,
    statisticsMenuItem
  ]),
  defaultCategory: homeCategory
};
