import {TableModel, TableColumn, CellData} from '../fe-core/components/custom-table/table-data.component';
import {CircleImageData} from '../fe-core/components/images/image-data';
import {StandingsTableTabData, TableComponentData} from '../fe-core/components/standings/standings.component';
import {SliderCarousel, SliderCarouselInput} from '../fe-core/components/carousels/slider-carousel/slider-carousel.component';
import {Conference, Division} from '../global/global-interface';
import {VerticalGlobalFunctions} from '../global/vertical-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';

export interface TeamStandingsData {
  teamName: string;
  imageUrl: string;
  backgroundImage: string;
  backgroundUrl: string;
  teamLogo: string;
  teamId: string;
  teamMarket: string;
  conferenceName: string;
  divisionName: string;
  lastUpdated: string;
  divisionRank: string;
  conferenceRank: string;
  leagueRank: string;
  streak: string;
  teamConferenceRecord: string;
  teamWinPercent: string;
  teamDivisionRecord: string;
  teamPointsAllowed: string;
  teamOverallRecord: string;
  seasonBase: string;
  totalLosses: string;
  totalWins: string;
  teamPointsFor: string;
  leagueAbbreviation: string;
  roadRecord: string;
  homeRecord: string;
  /**
   * - Formatted from league and division values that generated the associated table
   */
  groupName?: string;

  /**
   * - Formatted from the lastUpdatedDate
   */
  displayDate?: string;

  /**
   * Formatted full path to image
   */
  fullImageUrl?: string;

  /**
   * Formatted full path to image
   */
  fullBackgroundImageUrl?: string;
}

export class VerticalStandingsTableData implements TableComponentData<TeamStandingsData> {
  groupName: string;

  tableData: VerticalStandingsTableModel;

  conference: Conference;

  division: Division;

  constructor(title: string, conference: Conference, division: Division, table: VerticalStandingsTableModel) {
    this.groupName = title;
    this.conference = conference;
    this.division = division;
    this.tableData = table;
  }

}

export class TDLStandingsTabdata implements StandingsTableTabData<TeamStandingsData> {

  title: string;

  isActive: boolean;

  isLoaded: boolean;

  hasError: boolean;

  sections: Array<VerticalStandingsTableData>;

  conference: Conference;

  division: Division;

  season: any;

  selectedKey: string;

  currentTeamId: string;

  conferences: Array<any>;

  divisions: Array<any>;

  seasons: Array<any>;

  constructor(title: string, conference: Conference, division: Division, isActive: boolean, teamId: string) {
    this.title = title;
    this.conference = conference;
    this.division = division;
    this.isActive = isActive;
    this.currentTeamId = teamId;
  }

  getSelectedKey(): string {
    if ( !this.sections ) return "";

    var key = "";
    this.sections.forEach(section => {
      var table = section.tableData;
      if ( table.selectedKey != null && table.selectedKey != "") {
        key = table.selectedKey;
      }
    });
    return key;
  }

  setSelectedKey(key:string) {
    this.selectedKey = key;
    if ( !this.sections ) return;

    this.sections.forEach(section => {
      var table = section.tableData;
      if ( table.rows.filter(row => row.teamId == key).length > 0 ) {
        table.selectedKey = key;
      }
      else {
        table.selectedKey = "";
      }
    });
  }

  convertToCarouselItem(item: TeamStandingsData, index:number): SliderCarouselInput {
    var yearEnd = Number(item.seasonBase)+1;
    var teamFullName = item.teamMarket + ' ' + item.teamName;
    var teamRoute = VerticalGlobalFunctions.formatTeamRoute(teamFullName, item.teamId);
    var teamNameLink = {
        route: teamRoute,
        text: teamFullName
    };
    var division = item.divisionName;
    if(item.leagueAbbreviation.toLowerCase() == 'fbs'){
      var division = item.conferenceName + ": " + GlobalFunctions.toTitleCase(item.divisionName.replace(item.conferenceName, '').toLowerCase());
    }//fbs divison sends back all uppercase and needs to be camel case
    var rank = item.divisionRank != null ? Number(item.divisionRank) : 'N/A';
    return SliderCarousel.convertToCarouselItemType1(index, {
      backgroundImage: item.backgroundUrl != null ? GlobalSettings.getImageUrl(item.backgroundUrl) : VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(item.backgroundUrl),
      copyrightInfo: GlobalSettings.getCopyrightInfo(),
      subheader: [item.seasonBase + "-" + yearEnd + " Season " + division + " Standings"],
      profileNameLink: teamNameLink,
      description:[
          "The ", teamNameLink,
          " are currently <span class='text-heavy'>ranked #" + rank + "</span>" + " in the <span class='text-heavy'>" + division + "</span>, with a record of " + "<span class='text-heavy'>" + item.teamOverallRecord + "</span>."
      ],
      lastUpdatedDate: item.displayDate,
      circleImageUrl: GlobalSettings.getImageUrl(item.teamLogo),
      circleImageRoute: teamRoute
    });
  }
}

export class VerticalStandingsTableModel implements TableModel<TeamStandingsData> {
  columns: Array<TableColumn>;
  rows: Array<TeamStandingsData>;

  selectedKey: string = "";
  scope: string;
  /**
   * The team id of the profile page displaying the Standings module. (Optional)
   */
  currentTeamId: string;
  constructor(rows: Array<TeamStandingsData>, scope:string, teamId: string) {
    this.rows = rows;
    if ( this.rows === undefined || this.rows === null ) {
      this.rows = [];
    }
    this.currentTeamId = teamId;
    this.scope = scope;
    this.setColumnDP();
  }
  setColumnDP() : Array<TableColumn> {
    if(this.scope == 'fbs'){
      this.columns = [{
          headerValue: "Team Name",
          columnClass: "image-column",
          key: "name"
        },{
          headerValue: "W/L/T",
          columnClass: "data-column",
          key: "wlt"
        },{
          headerValue: "CONF",
          columnClass: "data-column",
          sortDirection: -1, //descending
          key: "conf"
        },{
          headerValue: "STRK",
          columnClass: "data-column",
          key: "strk"
        },{
          headerValue: "HM",
          columnClass: "data-column",
          key: "hm"
        },{
          headerValue: "RD",
          columnClass: "data-column",
          key: "rd"
        },{
          headerValue: "PF",
          columnClass: "data-column",
          key: "pf"
        },{
          headerValue: "PA",
          columnClass: "data-column",
          key: "pa"
        }];
      } else {
        this.columns = [{
            headerValue: "Team Name",
            columnClass: "image-column",
            key: "name"
          },{
            headerValue: "W/L/T",
            columnClass: "data-column",
            key: "wlt"
          },{
            headerValue: "PCT",
            columnClass: "data-column",
            sortDirection: -1, //descending
            key: "pct"
          },{
            headerValue: "DIV",
            columnClass: "data-column",
            key: "div"
          },{
            headerValue: "CONF",
            columnClass: "data-column",
            key: "conf"
          },{
            headerValue: "STRK",
            columnClass: "data-column",
            key: "strk"
          },{
            headerValue: "PF",
            columnClass: "data-column",
            key: "pf"
          },{
            headerValue: "PA",
            columnClass: "data-column",
            key: "pa"
          }];
      }
      return this.columns;
  }
  setSelectedKey(key: string) {
    this.selectedKey = key ? key : null;
  }

  getSelectedKey(): string {
    return this.selectedKey;
  }

  setRowSelected(rowIndex:number) {
    if ( rowIndex >= 0 && rowIndex < this.rows.length ) {
      this.selectedKey = this.rows[rowIndex].teamId;
    }
    else {
      this.selectedKey = null;
    }
  }

  isRowSelected(item:TeamStandingsData, rowIndex:number): boolean {
    return this.selectedKey == item.teamId;
  }

  calcWLT(str: string){
    let win = Number(str.split("-")[0]);
    let lose = Number(str.split("-")[1]);
    let tight = Number(str.split("-")[2]);
    let wlt = Math.pow(win, 2) - lose + tight;
    return wlt;
  }

  getCellData(item:TeamStandingsData, column:TableColumn):CellData {
    var display = null;
    var sort: any = null;
    var link: Array<any> = null;
    var imageUrl: string = null;
    var teamFullName = item.teamMarket + ' ' + item.teamName;
    switch (column.key) {
      case "name":
        display = item.teamName;
        sort = item.teamName;
        if ( item.teamId != this.currentTeamId ) {
          link = VerticalGlobalFunctions.formatTeamRoute(teamFullName,item.teamId);
        }
        imageUrl = GlobalSettings.getImageUrl(item.teamLogo);
        break;

      case "wlt":
        display = item.teamOverallRecord != null ? item.teamOverallRecord : null;
        sort = this.calcWLT(item.teamOverallRecord);
        break;

      case "conf":
        display = item.teamConferenceRecord != null ? item.teamConferenceRecord : null;
        sort = this.calcWLT(item.teamConferenceRecord);
        break;

      case "strk":
        display = item.streak != null ? item.streak : null;
        var compareValue = Number(item.streak.slice(1, item.streak.length));
        if(item.streak.charAt(0) == "L"){
          compareValue *= -1;
        }
        sort = compareValue;
        break;

      case "hm":
        display = item.homeRecord != null ? item.homeRecord : null;
        sort = this.calcWLT(item.homeRecord);
        break;

      case "rd":
        display = item.roadRecord != null ? item.roadRecord : null;
        sort = this.calcWLT(item.roadRecord);
        break;

      case "pa":
        display = item.teamPointsAllowed != null ? item.teamPointsAllowed : null;
        sort = Number(item.teamPointsAllowed);
        break;

      case "pct":
        display = item.teamWinPercent != null ? item.teamWinPercent : null;
        sort = Number(item.teamWinPercent);
        break;

      case "div":
        display = item.teamDivisionRecord != null ? item.teamDivisionRecord : null;
        sort = this.calcWLT(item.teamDivisionRecord);
        break;

      case "pf":
        display = item.teamPointsFor != null ? item.teamPointsFor : null;
        sort = item.teamPointsFor;
        break;
    }
    if ( display == null ) {
      display = "N/A";
    }
    return new CellData(display, sort, link, imageUrl);
  }
}
