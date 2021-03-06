import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

//globals
import { GlobalSettings } from "../../global/global-settings";
import { GlobalFunctions } from "../../global/global-functions";
import { VerticalGlobalFunctions } from "../../global/vertical-global-functions";
import { isBrowser, isNode } from "angular2-universal";

//services
import { ProfileHeaderService} from '../../services/profile-header.service';
import { VideoService } from "../../services/video.service";
import { BoxScoresService } from "../../services/box-scores.service";
import { SchedulesService } from "../../services/schedules.service";
import { StandingsService } from "../../services/standings.service";
import { TransactionsService } from "../../services/transactions.service";
import { ArticleDataService } from "../../services/article-page-service";
import { ListPageService, positionMVPTabData } from '../../services/list-page.service';
import { ComparisonStatsService } from '../../services/comparison-stats.service';
import { ImagesService } from "../../services/carousel.service";
import { DykService } from '../../services/dyk.service';
import { FaqService } from '../../services/faq.service';
import { ListOfListsService } from "../../services/list-of-lists.service";
import { NewsService } from "../../services/news.service";
import { TwitterService } from "../../services/twitter.service";
import { SeoService } from "../../seo.service";
import { DraftHistoryService } from '../../services/draft-history.service';

//interfaces
import { IProfileData, ProfileHeaderData, PlayerProfileHeaderData } from "../../fe-core/modules/profile-header/profile-header.module";
import { SportPageParameters } from "../../fe-core/interfaces/global-interface";
import { ComparisonModuleData } from '../../fe-core/modules/comparison/comparison.module';
import { StandingsModuleData } from '../../fe-core/modules/standings/standings.module';
import { TransactionModuleData } from "../../fe-core/modules/transactions/transactions.module";
import { dykModuleData } from "../../fe-core/modules/dyk/dyk.module";
import { faqModuleData } from "../../fe-core/modules/faq/faq.module";
import { HeadlineData } from "../../global/global-interface";
import { twitterModuleData } from "../../fe-core/modules/twitter/twitter.module";
import { SliderCarouselInput } from '../../fe-core/components/carousels/slider-carousel/slider-carousel.component';



// Libraries
declare var moment;

@Component({
    selector: 'League-page',
    templateUrl: './league.page.html'
})

export class LeaguePage{
    public widgetPlace: string = "widgetForModule";
    public type: string = 'module';

    public partnerID: string;
    public scope: string;
    public storedPartnerParam: string;
    public routeSubscriptions: any;
    public storeSubscriptions: any = [];
    public sportLeagueAbbrv: string = GlobalSettings.getSportLeagueAbbrv();
    public collegeDivisionAbbrv: string = GlobalSettings.getCollegeDivisionAbbrv();
    public collegeDivisionFullAbbrv: string = GlobalSettings.getCollegeDivisionFullAbbrv();

    private headlineData:any;
    private pageParams:SportPageParameters = {};
    public seasonBase: string;

    private profileHeaderData:ProfileHeaderData;
    private profileData:IProfileData;
    public isProfilePage:boolean = true;
    public profileType:string = "league";
    public profileName:string = "TDL";

    private eventStatus: string;

    private firstVideo:string;
    private videoData:any = null;

    private boxScoresData:any;
    private currentBoxScores:any;
    private dateParam:any;

    private schedulesData:any;
    private scheduleTabsData: any;
    private scheduleParams:any;
    private scheduleFilter1:Array<any>;
    private scheduleFilter2:Array<any>;
    private selectedFilter1:string
    private selectedFilter2:string;
    private selectedScheduleTabDisplay: string;
    private schedulesModuleFooterUrl: Array<any>;
    private isFirstNum:number = 0;

    private standingsData:StandingsModuleData;

    private transactionsData: TransactionModuleData;
    private transactionsActiveTab: any;
    private transactionFilter1: Array<any>;
    private transactionModuleFooterParams: Array<any>;
    private dropdownKey1: string;

    private draftHistoryData: any;
    private draftHistoryActiveTab: string;
    private draftHistoryFilter1: any = 1;
    private draftHistoryModuleFooterParams: any;
    private draftHistorySortOptions: Array<any> = [{key: '1', value: 'Ascending'}, {key: '2', value: 'Descending'}];
    private draftHistoryCarouselData: Array<Array<SliderCarouselInput>>;
    private draftHistoryDetailedDataArray: any;
    private draftHistoryIsError: boolean = false;
    private draftHistoryModuleInfo: Object;
    private draftHistortyModuleFooterUrl: Array<any>;

    private mvpTabs: any;
    private mvpData: any;
    private mvpActiveTab: positionMVPTabData;
    private mvpActiveTabTitle: string;
    private mvpActivePosition:any;
    private mvpActivePositionTitle: string;
    private mvpSortOptions:any;
    private mvpDataError: boolean;
    private mvpListMax:number = 10;
    private mvpModuleFooterParams: Array<any>;

    private comparisonModuleData: ComparisonModuleData;

    private imageData:Array<any>;
    private copyright:any;
    private imageTitle:any;

    private dykData: Array<dykModuleData>;

    private faqData: Array<faqModuleData>;

    private listOfListsData:Object; // paginated data to be displayed

    /*private newsDataArray: Array<Object>;*/

    private twitterData: Array<twitterModuleData>;

    private batchLoadIndex: number = 1;

    constructor(
      private activatedRoute: ActivatedRoute,
      private _profileService: ProfileHeaderService,
      private _videoBatchService: VideoService,
      private _boxScores: BoxScoresService,
      private _schedulesService: SchedulesService,
      private _standingsService:StandingsService,
      private _transactionsService: TransactionsService,
      private _draftHistoryService: DraftHistoryService,
      private _listService: ListPageService,
      private _comparisonService: ComparisonStatsService,
      private _imagesService: ImagesService,
      private _dykService: DykService,
      private _faqService: FaqService,
      private _lolService: ListOfListsService,
      private _articleDataService:ArticleDataService,
      private _newsService: NewsService,
      private _twitterService: TwitterService,
      private _seoService: SeoService,
      private _cdRef: ChangeDetectorRef,
      private router: Router
    ) {
      this.routeSubscriptions = this.activatedRoute.params.subscribe(
            (param :any)=> {
              this.resetSubscription();
              this.routeChangeResets();

              this.pageParams = param;
              this.partnerID = param['partnerID'];
              this.scope = param['scope'] != null ? param['scope'].toLowerCase() : 'nfl';

              var currentUnixDate = new Date().getTime();
              this.dateParam ={
                scope:'league',//current profile page
                teamId: this.scope == 'ncaaf' ? 'fbs' : this.scope,
                date: moment.tz( currentUnixDate , 'America/New_York' ).format('YYYY-MM-DD')// date: '2016-09-11
              };

              this.setupProfileData(this.partnerID, this.scope);
              this.storedPartnerParam = VerticalGlobalFunctions.getWhiteLabel();
            }
      );
    }



    // This function contains values that need to be manually reset when navigatiing from league page to league page
    routeChangeResets() {
      this.batchLoadIndex = 1;
    } //routeChangeResets


    ngOnDestroy(){
      this.resetSubscription();
      if(this.routeSubscriptions){
        this.routeSubscriptions.unsubscribe();
      }
    } //ngOnDestroy

    private resetSubscription(){
      if(this.storeSubscriptions){
        var numOfSubs = this.storeSubscriptions.length;

        for( var i = 0; i < numOfSubs; i++ ){
          if(this.storeSubscriptions[i]){
            this.storeSubscriptions[i].unsubscribe();
          }
        }
      }
    }

    private setupProfileData(partnerID, scope) {
      this.storeSubscriptions.push(this._profileService.getLeagueProfile(scope).subscribe(
        data => {
          //---Batch 1 Load---//
          this.metaTags(data);
          this.profileData = data;
          this.seasonBase = data.headerData['seasonBase'];
          this.profileHeaderData = this._profileService.convertToLeagueProfileHeader(data.headerData);
          this.profileName = this.scope == 'fbs'? 'NCAAF':this.scope.toUpperCase(); //leagueShortName
          this.getLeagueHeadlines();
          this.eventStatus = 'pregame';
          this.getBoxScores(this.dateParam);
          this.getSchedulesData(this.eventStatus);//grab pre event data for upcoming games

          //---Batch 2 Load---//
          this.standingsData = this._standingsService.loadAllTabsForModule(this.pageParams, this.profileType);
          this.transactionsActiveTab = "Transactions";
          this.transactionsData = this._transactionsService.loadAllTabsForModule(this.scope.toUpperCase(), this.transactionsActiveTab);

          //---Batch 3 Load---//
          this.draftHistoryData = this._draftHistoryService.getDraftHistoryTabs(this.profileData);
          this.getDraftHistoryData();
          this.mvpActivePosition = 'cb'; //Initial position to display in MVP
          this.mvpActivePositionTitle = VerticalGlobalFunctions.convertPositionAbbrvToPlural(this.mvpActivePosition);
          this.mvpSortOptions = VerticalGlobalFunctions.getMVPdropdown(this.scope);
          this.mvpTabs = this._listService.getMVPTabs(this.mvpActivePosition, 'module');
          this.mvpActiveTab = this.mvpActiveTab ? this.mvpActiveTab : this.mvpTabs[0];
          this.mvpData = this.getMvpData(this.mvpActiveTab, this.mvpActivePosition);

          //---Batch 4 Load---//
          //   if ( this.mvpData && this.mvpData.length > 0 ) {
          //     //default params
          //     this.positionDropdown({
          //         tab: this.mvpData[0],
          //         position: this.globalMVPPosition
          //     });
          //   };
          this.setupComparisonData();
          this.getImages(this.imageData);

          //---Batch 5 Load---//
          this.getDykService(this.profileType);
          this.getFaqService(this.profileType);
          this.setupListOfListsModule();

          //---Batch 6 Load---//
          //this.getNewsService();
          this.getTwitterService(this.profileType, partnerID, scope);
        }
      ))
    } //setupProfileData



    private metaTags(data){
      //This call will remove all meta tags from the head.
      this._seoService.removeMetaTags();
      //create meta description that is below 160 characters otherwise will be truncated
      let header = data.headerData;
      let title = header.leagueFullName;
      let metaDesc =  header.leagueFullName + ' loyal to ' + header.totalTeams + ' teams ' + 'and ' + header.totalPlayers + ' players.';
      let image = header.leagueLogo ? GlobalSettings.getImageUrl(header.leagueLogo, GlobalSettings._imgPageLogo) : GlobalSettings.mainIcon;
      let color = '#2d3e50';
      let link =  this._seoService.getPageUrl();

      this._seoService.setTitle(title);
      this._seoService.setMetaDescription(metaDesc);
      this._seoService.setCanonicalLink();
      this._seoService.setMetaRobots('Index, Follow');
      this._seoService.setMetaTags([
        {
          'og:title': title,
        },
        {
          'og:description': metaDesc,
        },
        {
          'og:type':'website',
        },
        {
          'og:url':link,
        },
        {
          'og:image': image,
        },
        {
          'es_page_title': title,
        },
        {
          'es_page_url': link
        },
        {
          'es_description': metaDesc,
        },
        {
          'es_page_type': 'League page',
        },
        {
          'es_keywords': 'football, Touchdown loyal, League Page'
        },
        {
          'es_image_url':image
        }
      ])

    } // metaTags

    private getBoxScores(dateParams) {
        let newDate;
        if ( dateParams != null && (newDate == null || dateParams.date != newDate.date) ) {
            newDate = dateParams;
            this.dateParam = dateParams;
            this.storeSubscriptions.push(this._boxScores.getBoxScores(this.boxScoresData, this.profileName, this.dateParam, (boxScoresData, currentBoxScores) => {
              this.boxScoresData = boxScoresData;
              this.currentBoxScores = currentBoxScores;
              this.dateParam = newDate;
              this._cdRef.detectChanges();
            }))
        }
    }
    //getBoxScores



    //api for League Headline Module
    private getLeagueHeadlines() {
        var scope = this.scope;
        if (scope == "ncaa") {
            scope = "ncaaf";
        }
        this.storeSubscriptions.push(this._articleDataService.getAiHeadlineDataLeague(null, scope, true)
          .finally(() => GlobalSettings.setPreboot() ) // call preboot after last piece of data is returned on page (of first batch)
          .subscribe(
              HeadlineData => {
                  this.headlineData = HeadlineData;
              }
          ))
    } //getLeagueHeadlines



    //grab tab to make api calls for post of pregame table
    private scheduleTab(tab) {
        this.eventStatus = tab == "Previous Games" ? 'postgame' : 'pregame';
        this.selectedFilter1 = null;
        this.selectedFilter2 = null;
        this.getSchedulesData(this.eventStatus, this.selectedFilter1, this.selectedFilter2);
    } //scheduleTab
    private getSelectedScheduleTab(tabsData, status) {
        let matchingTabs = tabsData.filter(value => value.data == status);
        matchingTabs[0]['tabData'].sections = this.schedulesData.data;
        matchingTabs[0]['tabData'].isActive = true;
        this.selectedScheduleTabDisplay = matchingTabs[0].display;
        return tabsData;
    } //getSelectedScheduleTab
    private scheduleFilterDropdown(filter) {
        if ( filter.value == "filter1" ) {
            this.selectedFilter1 = filter.key;
        }
        if ( filter.value == "filter2" ) {
            this.selectedFilter2 = filter.key;
        }
        this.getSchedulesData(this.eventStatus, this.selectedFilter1, this.selectedFilter2);
    } //filterDropdown
    private getSchedulesData(status, year?, week?) {
      let scopeLink = this.scope.toLowerCase() == this.collegeDivisionAbbrv.toLowerCase() ?
                      this.collegeDivisionFullAbbrv.toLowerCase() :
                      this.scope.toLowerCase();
      var limit = status == 'postgame' ? 3 : 5;
      var pageNum = 1;
      year = year ? year : this.seasonBase;
      this.storeSubscriptions.push(this._schedulesService.getScheduleTable(this.schedulesData, scopeLink, 'league', status, limit, 1, this.pageParams.teamId, (schedulesData) => {
        if (status == 'pregame' || status == 'created') {
          this.scheduleFilter1 = null;
          year = 'all';
        } else {
          if (this.scheduleFilter1 == null) {// only replaces if the current filter is not empty
            this.scheduleFilter1 = schedulesData.seasons;
          }
        }
        if(schedulesData.carData.length > 0){
          this.scheduleFilter2 = schedulesData.weeks;
        } else {}
        this.schedulesData = schedulesData ? schedulesData : null;
        this.scheduleTabsData = this.schedulesData.tabs ? this.getSelectedScheduleTab(this.schedulesData.tabs, status) : null;
        this.schedulesModuleFooterUrl = [this.storedPartnerParam, this.scope, 'schedules', 'league', year, status, pageNum];
      }, year, week)) // isTeamProfilePage = true
    } //getSchedulesData



    private standingsTabSelected(tabData: Array<any>) {
      //only show 5 rows in the module
      this.storeSubscriptions.push(this._standingsService.getStandingsTabData(tabData, this.pageParams, this.seasonBase, (data) => {}, 5,this.dateParam.profile));
    } //standingsTabSelected
    private standingsFilterSelected(tabData: Array<any>) {
      this.scope = this.scope;
      this.storeSubscriptions.push(this._standingsService.getStandingsTabData(tabData, this.pageParams, this.seasonBase, data => {
      }, 5 , this.dateParam.profile));
    } //standingsFilterSelected



    private transactionsTab(tab) {
        this.transactionsActiveTab = tab;
        this.getTransactionsData();
    } //transactionsTab
    private transactionsFilterDropdown(filter) {
      if ( this.transactionsActiveTab == null ) {
        this.transactionsActiveTab = this.transactionsData[0];
      }
      this.dropdownKey1 = filter;
      this.getTransactionsData();
    } //transactionsFilterDropdown
    private getTransactionsData() {
      if(this.dropdownKey1 == null){
        this.dropdownKey1 = this.seasonBase;
      }
      this.storeSubscriptions.push(this._transactionsService.getTransactionsService(this.transactionsActiveTab, this.pageParams.teamId, 'page', this.dropdownKey1)
      .subscribe(
          transactionsData => {
            //create footer call to action (CTA) link
            if ( this.transactionFilter1 == undefined ) {
              this.transactionFilter1 = transactionsData.yearArray;
              if(this.dropdownKey1 == null){
                this.dropdownKey1 = this.transactionFilter1[0].key;
              }
            }
            this.transactionModuleFooterParams = [this.storedPartnerParam, this.scope, transactionsData.tabDataKey, this.dropdownKey1, 'league', 20];
            this.transactionsData.tabs.filter(tab => tab.tabDataKey == this.transactionsActiveTab.tabDataKey)[0] = transactionsData;
          },
          err => {
          console.log('Error: transactionsData API: ', err);
          }
      )); // pass transaction page route params to module filter, so set module footer route
    } //getTransactionsData



    private draftHistoryTab(tab) {
        this.draftHistoryActiveTab = tab;
        this.getDraftHistoryData();
    }
    private draftHistoryFilterDropdown(filter) {
        this.draftHistoryFilter1 = filter;
        this.getDraftHistoryData();
    }
    private getDraftHistoryData() {
        this.draftHistoryActiveTab = this.draftHistoryActiveTab ? this.draftHistoryActiveTab : this.seasonBase;
        var matchingTabs =  this.draftHistoryActiveTab ?
                            this.draftHistoryData.filter(tab => tab.tabKey == this.draftHistoryActiveTab) :
                            null;
        if ( matchingTabs ) {
            var activeTab = matchingTabs[0];
            var activeFilter = this.draftHistoryFilter1 ? this.draftHistoryFilter1 : 1;
            this.storeSubscriptions.push(
                this._draftHistoryService.getDraftHistoryService(this.profileData, activeTab, 0, 'page', activeFilter, 2)
                    .subscribe(
                        draftHistoryData => {
                            activeTab.isLoaded = true;
                            activeTab.detailedDataArray = draftHistoryData.detailedDataArray;
                            activeTab.carouselDataArray = draftHistoryData.carouselDataArray;
                            this.draftHistoryCarouselData = draftHistoryData.carouselDataArray
                        },
                        err => {
                          activeTab.isLoaded = true;
                          this.draftHistoryIsError = true;
                          console.log('Error: draftData API: ', err);
                        }
                    )
            )
            this.draftHistortyModuleFooterUrl = [this.storedPartnerParam, this.scope, 'draft-history', activeTab.tabKey, 'league', activeFilter == 1 ? 'asc' : 'desc'];
        } //if
    } //getDraftHistoryData



    private mvpFilterDropdown(event) {
        if ( event.position != this.mvpActivePosition ) {
            this.mvpTabs = this.checkToResetTabs(event);
            this.mvpActiveTab = this.mvpTabs[0];
            this.mvpActivePosition = event.position;
            this.mvpActivePositionTitle = VerticalGlobalFunctions.convertPositionAbbrvToPlural(this.mvpActivePosition);
            this.getMvpData(this.mvpActiveTab, this.mvpActivePosition);
        }
    } //positionDropdown
    private mvpTabSelected(event) {
        if ( event.tabDataKey != this.mvpActiveTab.tabDataKey ) {
            this.mvpActiveTab = this.mvpTabs.filter(tab => tab.tabDataKey == event.tabDataKey)[0];
            this.getMvpData(this.mvpActiveTab, this.mvpActivePosition);
        }
    } //mvpTabSelected
    private checkToResetTabs(event) { //function to check if selected position in dropdown is currently active
        let localPosition = event.position;
        if ( localPosition != this.mvpActivePosition ) {
            return this._listService.getMVPTabs(event.position, 'module');
        } else {
            return this.mvpData;
        }
    } //checkToResetTabs
    private getMvpData(activeTab, activePosition) {
        this.mvpActiveTabTitle = activeTab.tabDisplayTitle;
        var mvpPositionParams = {
            scope:  this.scope.toLowerCase() == this.collegeDivisionFullAbbrv.toLowerCase() ?
                    this.collegeDivisionAbbrv.toLowerCase() :
                    this.scope.toLowerCase(),
            target: 'player',
            position: activePosition,
            statName: activeTab.tabDataKey,
            ordering: 'asc',
            perPageCount: this.mvpListMax,
            pageNumber: 1,
            season: this.seasonBase
        }
        this.storeSubscriptions.push(this._listService.getListModuleService(activeTab, mvpPositionParams)
            .subscribe(
                tab => {
                    this.mvpData = tab;
                    return tab;
                },
                err => {
                    this.mvpDataError = true;
                    console.log('Error: List MVP API: ', err);
                }
            )
        );
        this.mvpModuleFooterParams = [this.storedPartnerParam, this.scope, 'mvp-list', activePosition, activeTab.tabDataKey, '1'];
    } //getMvpData



    private setupComparisonData() {
      this.storeSubscriptions.push(this._comparisonService.getInitialPlayerStats(this.scope, this.pageParams).subscribe(
        data => {
          this.comparisonModuleData = data;
        },
        err => {
          console.log("Error getting comparison data", err);
        }));
    } //setupComparisonData



    private getImages(imageData) {
      this.storeSubscriptions.push(this._imagesService.getImages(this.profileType, this.scope)
        .subscribe(data => {
          return this.imageData = data.imageArray, this.copyright = data.copyArray, this.imageTitle = data.titleArray;
        },
        err => {
          console.log("Error getting image data" + err);
        }));
    } //getImages



    private getDykService(profileType) {
      this.storeSubscriptions.push(this._dykService.getDykService(this.profileType, this.scope)
        .subscribe(data => {
          this.dykData = data;
        },
        err => {
          console.log("Error getting did you know data");
        }));
    } //getDykService



    private getFaqService(profileType) {
      this.storeSubscriptions.push(this._faqService.getFaqService(this.profileType, this.scope)
        .subscribe(data => {
            this.faqData = data;
        },
        err => {
            console.log("Error getting faq data for mlb", err);
        }));
   } //getFaqService



    private setupListOfListsModule() {
      let params = {
        //  targetId : 11621,
        limit : 4,
        pageNum : 1,
        scope: this.scope
      }
      this.storeSubscriptions.push(this._lolService.getListOfListsService(params, "league", "module", 1)
        .subscribe(
          listOfListsData => {
            if(listOfListsData){
              this.listOfListsData = listOfListsData.listData;
            }
          },
          err => {
            console.log('Error: listOfListsData API: ', err);
          }
      ));
    } //setupListOfListsModule


/*
 This service call is disabled for MPC server

    private getNewsService() {
      let params = {
        limit : 10,
        pageNum : 1,
        id: ''
      }
      let scope = GlobalSettings.getScope(this.scope);
      this.storeSubscriptions.push(this._newsService.getNewsService(scope, params, "league", "module")
        .subscribe(data => {
          this.newsDataArray = data.news;
        },
        err => {
          console.log("Error getting news data");
      }));
    }*/ //getNewsService



    private getTwitterService(profileType, partnerID, scope) {
      this.scope = scope;
      this.partnerID = partnerID;
      this.isProfilePage = true;
      this.profileType = 'league';

      this.storeSubscriptions.push(this._twitterService.getTwitterService(this.profileType, this.partnerID, this.scope)
        .subscribe(data => {
          this.twitterData = data;
        },
        err => {
          console.log("Error getting twitter data");
        }));
    } //getTwitterService



    // function to lazy load page sections
    private onScroll(event) {
      this.batchLoadIndex = GlobalFunctions.lazyLoadOnScroll(event, this.batchLoadIndex);
      return;
    } //onScroll

  }
