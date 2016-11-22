import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AppComponent }  from '../app-component/app.component';

import { DeepDiveNgModule } from "../ngModules/deep-dive.ngmodule";
import { DeepDivePage } from "../webpages/deep-dive-page/deep-dive.page";
import { LeaguePage } from "../webpages/league-page/league.page";
import { TeamPage } from "../webpages/team-page/team.page";
import { PlayerPage } from "../webpages/player-page/player.page";
import { SchedulesPage } from "../webpages/schedules-page/schedules.page";

import { ArticlePages } from "../webpages/article-pages/article-pages.page";
import { AboutUsPage } from "../webpages/about-us-page/about-us.page";
import { ContactUsPage } from "../webpages/contactus-page/contactus.page";
import { DisclaimerPage } from "../webpages/disclaimer-page/disclaimer.page";
// import {SyndicatedArticlePage} from "./webpages/syndicated-article-page/syndicated-article-page";
// import {SearchPage} from "./webpages/search-page/search-page";

const relativeChildRoutes = [
  {
      path: 'about-us',
      component: AboutUsPage,
  },
  {
      path: 'contact-us',
      component: ContactUsPage,
  },
  {
      path: 'disclaimer',
      component: DisclaimerPage,
  },
  // {
  //     path: ':scope/pick-a-team',
  //     name: 'Pick-team-page',
  //     component: PickTeamPage,
  // },
  {
      path: ':scope/team/:teamName/:teamID',
      component: TeamPage,
  },
  {
      path: ':scope/player/:teamName/:fullName/:playerID',
      component: PlayerPage,
  },
  // //Misc. Pages
  // {
  //     path: ':scope/directory/:type/:startsWith/page/:page',
  //     name: 'Directory-page-starts-with',
  //     component: DirectoryPage,
  // },
  // {
  //     path: ':scope/search/:query',
  //     name: 'Search-page',
  //     component: SearchPage
  // },
  // //Module Pages
  // {
  //     path: ':scope/mvp-list/:type/:pageNum',
  //     name: 'MVP-list-page',
  //     component: MVPListPage
  // },
  // {
  //     path: ':scope/mvp-list/:type/:tab/:pageNum',
  //     name: 'MVP-list-tab-page',
  //     component: MVPListPage
  // },
  {
      path: ':scope/schedules/:teamName/:year/:tab/:pageNum',
      component: SchedulesPage
  },
  {
      path: ':scope/schedules/:teamName/:teamID/:year/:tab/:pageNum',
      component: SchedulesPage
  },
  // {
  //     path: ':scope/standings',
  //     name: 'Standings-page',
  //     component: StandingsPage
  // },
  // {
  //     path: ':scope/standings/:type',
  //     name: 'Standings-page-league',
  //     component: StandingsPage
  // },
  // {
  //     path: ':scope/standings/:type/:teamName/:teamID',
  //     name: 'Standings-page-team',
  //     component: StandingsPage
  // },
  // {
  //     path: ':scope/list/:query',
  //     name: 'Dynamic-list-page',
  //     component: ListPage
  // },
  // {
  //     path: ':scope/list/:target/:statName/:season/:ordering/:perPageCount/:pageNumber',
  //     name: 'List-page',
  //     component: ListPage
  // },
  // {
  //     path: ':scope/draft-history',
  //     name: 'Draft-history-mlb-page',
  //     component: DraftHistoryPage
  // },
  // {
  //     path: ':scope/draft-history/:teamName/:teamID',
  //     name: 'Draft-history-page',
  //     component: DraftHistoryPage
  // },
  // {
  //     path: ':scope/:type/:teamName/:teamId/:limit/:pageNum',
  //     name: 'Transactions-page',
  //     component: TransactionsPage
  // },
  // {
  //     path: ':scope/:type/league/:limit/:pageNum',
  //     name: 'Transactions-tdl-page',
  //     component: TransactionsPage
  // },
  // {
  //     path: ':scope/team-roster/:teamName/:teamID',
  //     name: 'Team-roster-page',
  //     component: TeamRosterPage
  // },
  // {
  //     path: ':scope/season-stats/:fullName/:playerID',
  //     name: 'Season-stats-page',
  //     component: SeasonStatsPage
  // },
  // {
  //     path: ':scope/player-stats/:teamName/:teamID',
  //     name: 'Player-stats-page',
  //     component: PlayerStatsPage
  // },
   {
       path: ':scope/articles/:eventType/:eventID',
       component: ArticlePages
   },
  // {
  //     path: ':scope/list-of-lists/:target/:targetId/:perPageCount/:pageNumber',
  //     name: 'List-of-lists-page-scoped',
  //     component: ListOfListsPage
  // },
  // //Error pages and error handling
  // {
  //     path: '/error',
  //     name: 'Error-page',
  //     component: ErrorPage
  // },
  // {
  //     path: '/not-found',
  //     component: ErrorPage,
  // },
  {
    path: ':scope/league',
    component: LeaguePage,
  },
  {
    path: ':scope',
    component: DeepDivePage,
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  // {
  //     path: '/*path',
  //     redirectTo: ['NotFound-page']
  // },
];

const appRoutes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: relativeChildRoutes
  },
  {
    path: ':partnerID',
    component: AppComponent,
    children: relativeChildRoutes
  },

];

export const routing = RouterModule.forRoot(appRoutes);
