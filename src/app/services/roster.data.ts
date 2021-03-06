import {TableModel, TableColumn, CellData} from '../fe-core/components/custom-table/table-data.component';
import {CircleImageData} from '../fe-core/components/images/image-data';
import {RosterTabData} from '../fe-core/components/roster/roster.component';
import {SliderCarousel,SliderCarouselInput} from '../fe-core/components/carousels/slider-carousel/slider-carousel.component';
import {Conference, Division} from '../global/global-interface';
import {GlobalFunctions} from '../global/global-functions';
import {VerticalGlobalFunctions} from '../global/vertical-global-functions';
import {GlobalSettings} from '../global/global-settings';
import {RosterService} from './roster.service';

export interface TeamRosterData {
  playerHeadshotUrl: string,
  teamId: string,
  teamName: string,
  playerName: string,
  playerFirstName:string,
  playerLastName: string,
  playerId: string,
  roleStatus: string,
  active: string,
  playerJerseyNumber: string,
  backgroundUrl: string;
  teamLogo: string,
  playerPosition:string,
  depth: string,
  playerWeight: string,
  playerHeight: string,
  birthDate: string,
  city: string,
  area: string,
  country: string,
  heightInInches: string,
  playerAge: string,
  playerSalary: number,
  lastUpdated: string,
  type?: string,
  /**
   * - Formatted from league and division values that generated the associated table
   */
  groupName?: string
  /**
   * - Formatted from the lastUpdatedDate
   */
  displayDate?: string;
  class: string;
}

export class NFLRosterTabData implements RosterTabData<TeamRosterData> {
  type: string;
  teamId: string;
  maxRows: number;
  title: string;
  isLoaded: boolean = false;
  hasError: boolean = false;
  errorMessage: string;
  tableData: RosterTableModel;
  isTeamProfilePage: boolean;
  scope:string;
  subscriptions:any = [];

  constructor(private _service: RosterService, scope, teamId: string, type: string, conference: Conference, maxRows: number, isTeamProfilePage: boolean) {
    this.resetSubscription();
    this.type = type;
    this.teamId = teamId;
    this.maxRows = maxRows;
    this.errorMessage = "Sorry, there is no roster data available.";
    this.isTeamProfilePage = isTeamProfilePage;
    this.scope = scope;
    this.type = type;

    switch ( type ) {
      case "full":      this.title = "Full Roster"; break;
      case "offense":  this.title = "Offense";    break;
      case "defense":  this.title = "Defense";    break;
      case "special":  this.title = "Special Teams";    break;
    }
  }

  private resetSubscription(){
    if(this.subscriptions){
      var numOfSubs = this.subscriptions.length;

      for( var i = 0; i < numOfSubs; i++ ){
        if(this.subscriptions[i]){
          this.subscriptions[i].unsubscribe();
        }
      }
    }
  }

  loadData() {
    if ( !this.tableData ) {
      if ( !this._service.fullRoster ) {
        this.subscriptions.push(this._service.getRosterTabData(this).subscribe(data => {
          //Limit to maxRows, if necessary
          var rows = this.filterRows(data);
          this.tableData = new RosterTableModel(this.scope, rows, this.type);
          this.isLoaded = true;
          this.hasError = false;
        },
        err => {
          this.isLoaded = true;
          this.hasError = true;
          console.log("Error getting roster data", err);
        }));
      }
      else {
        var rows = this.filterRows(this._service.fullRoster);
        this.tableData = new RosterTableModel(this.scope, rows, this.type);
        this.isLoaded = true;
        this.hasError = false;
      }
    }
  }

  filterRows(data: any): Array<TeamRosterData> {
    var rows: Array<TeamRosterData>;
    if ( this.type != "full" ) {
      rows = data[this.type];
    }
    else {
      rows = [];
      for ( var type in data ) {
        data[type].forEach(player => {
          if ( rows.filter(row => row.playerId == player.playerId).length == 0 ) {
            rows.push(player);
          }
        });
      }
    }


    rows = rows.sort((a, b) => {
      return Number(b.playerSalary) - Number(a.playerSalary);
    });
    if ( this.maxRows !== undefined ) {
      rows = rows.slice(0, this.maxRows);
    }
    return rows;
  }

  convertToCarouselItem(val:TeamRosterData, index:number):SliderCarouselInput {
    var playerRoute = VerticalGlobalFunctions.formatPlayerRoute(this.scope, val.teamName,val.playerFirstName + " " + val.playerLastName,val.playerId);
    var teamRoute = this.isTeamProfilePage ? null : VerticalGlobalFunctions.formatTeamRoute(this.scope, val.teamName,val.teamId);
    var curYear = new Date().getFullYear();

    // var formattedHeight = VerticalGlobalFunctions.formatHeightWithFoot(val.height);
    var formattedSalary = "N/A";
    if ( val.playerSalary != null ) {
      formattedSalary = "$" + GlobalFunctions.nFormatter(Number(val.playerSalary));
    }

    var playerNum = val.playerJerseyNumber != null ? "<span class='text-heavy'>No. " + val.playerJerseyNumber + "</span>" : "";
    var playerHeight = val.playerHeight != null ? "<span class='text-heavy'>" + VerticalGlobalFunctions.formatHeightInches(val.playerHeight) + "</span> " : "";
    var playerWeight = val.playerWeight != null ? "<span class='text-heavy'>" + val.playerWeight + "</span> " : "N/A";
    var playerSalary = "<span class='text-heavy'>" + formattedSalary + "</span> per year.";

    var playerLinkText = {
      route: playerRoute,
      text: val.playerFirstName + " " + val.playerLastName,
      class: 'text-heavy'
    }
    var teamLinkText = {
      route: teamRoute,
      text: val.teamName + ",",
      class: 'text-heavy'

    }
    var classyear = val.class;
    var a = 'a';
    switch(classyear) {
    case 'FR':
        classyear = 'Freshman '
        break;
    case 'SO':
        classyear = 'Sophomore '
        break;
    case 'JR':
        classyear = 'Junior '
        break;
    case 'SR':
        classyear = 'Senior '
        break;
    case null:
        classyear = '';
        a = '';
}
var salary; // if college => do not show salary
  if ( val.class ) {
    salary = '';
  }
  else {
    salary = "<span class='nfl-only'> and is making a salary of "+ playerSalary + "</span>";
  }


    return SliderCarousel.convertToCarouselItemType1(index, {
      backgroundImage: VerticalGlobalFunctions.getBackgroundImageUrlWithStockFallback(val.backgroundUrl, VerticalGlobalFunctions._imgProfileMod),
      copyrightInfo: GlobalSettings.getCopyrightInfo(),
      subheader: [curYear + ' TEAM ROSTER'],
      profileNameLink: playerLinkText,
      description: [
          playerLinkText,
          ", ",a,"<span class='text-heavy'>"+ classyear + val.playerPosition, "</span>",'for the ',
          teamLinkText,
          'is <span class="text-heavy">'+ playerNum + '</span> and stands at ' + playerHeight + "tall, weighing " + playerWeight +" lbs. " + salary
      ],
      lastUpdatedDate: GlobalFunctions.formatUpdatedDate(val.lastUpdated),
      circleImageUrl: GlobalSettings.getImageUrl(val.playerHeadshotUrl, GlobalSettings._imgLgLogo),
      circleImageRoute: playerRoute,
      // subImageUrl: GlobalSettings.getImageUrl(val.teamLogo),
      // subImageRoute: teamRoute,
      //rank: val.uniformNumber
    });
  }
}

export class RosterTableModel implements TableModel<TeamRosterData> {
  columns: Array<TableColumn> = [{
      headerValue: "Player",
      columnClass: "image-column",
      key: "name",
      sortDirection: 1 //ascending
    },{
      headerValue: "Pos.",
      columnClass: "data-column",
      isNumericType: false,
      key: "pos"
    },{
      headerValue: "Height",
      columnClass: "data-column",
      isNumericType: true,
      key: "ht"
    },{
      headerValue: "Weight",
      columnClass: "data-column",
      isNumericType: true,
      key: "wt"
    }
  ];

  rows: Array<TeamRosterData>;

  selectedKey: string = "";

  scope: string;
  constructor(scope:string, rows: Array<TeamRosterData>, key?: string) {
    this.scope = scope;
    if(scope == 'nfl'){
      this.columns.push({
        headerValue: "Age",
        columnClass: "data-column age",
        isNumericType: true,
        key: "age"
      },{
        headerValue: "Salary",
        columnClass: "data-column salary",
        isNumericType: true,
        key: "sal"
      });
    }else{
      this.columns.push({

        headerValue: "Class",
        columnClass: "data-column classes",
        isNumericType: false,
        key: "class"
      }/*,{
        headerValue: "Jersey#",
        columnClass: "data-column age",
        isNumericType: true,
        key: "jer"
      }*/);
    }
    this.rows = rows;
    this.selectedKey = key;
    if ( this.rows === undefined || this.rows === null ) {
      this.rows = [];
    }
  }

  setSelectedKey(key: string) {
    this.selectedKey = key;
  }

  getSelectedKey(): string {
    return this.selectedKey;
  }

  setRowSelected(rowIndex:number) {
    if ( rowIndex >= 0 && rowIndex < this.rows.length ) {
      this.selectedKey = this.rows[rowIndex].playerId;
    }
    else {
      this.selectedKey = null;
    }
  }

  isRowSelected(item:TeamRosterData, rowIndex:number): boolean {
    return this.selectedKey == item.playerId;
  }

  getCellData(item:TeamRosterData, column:TableColumn): CellData {
    var display = null;
    var sort = null;
    var link: Array<any> = null;
    var imageUrl: string = null;
    var displayAsRawText = false;
    var pColumn;
    var scope = this.scope;
      function getFullClassName(classyear){
          switch(classyear) {
           case 'FR':
           classyear = 'Freshman '
           break;
           case 'SO':
           classyear = 'Sophomore '
           break;
           case 'JR':
           classyear = 'Junior '
           break;
           case 'SR':
           classyear = 'Senior '
           break;
           case null:
           classyear = '';
           }
           return classyear;

      }
      function tabCellDataroster(columnType) {
          return{
              "name":{
                  display : item.playerFirstName + " " + item.playerLastName,
                  sort : item.playerLastName + ', ' + item.playerFirstName,
                  link : VerticalGlobalFunctions.formatPlayerRoute(scope, item.teamName, item.playerFirstName + " " + item.playerLastName, item.playerId),
                  imageUrl : GlobalSettings.getImageUrl(item.playerHeadshotUrl, GlobalSettings._imgSmLogo),
                  bottomStat: "Jersey No.",
                  bottomStat2:item.playerJerseyNumber != null ? item.playerJerseyNumber: 'N/A',

              },
              "pos":{
                  display:typeof item.playerPosition[0] != null ? item.playerPosition : null,
                  sort : item.playerPosition != null ? item.playerPosition.toString() : null,
              },
              "ht":{
                  display: item.playerHeight != null ? VerticalGlobalFunctions.formatHeight(VerticalGlobalFunctions.formatHeightInches(item.playerHeight)) : null,
                  sort: item.playerHeight != null ? Number(item.playerHeight) : null,
              },

              "wt":{

                  display:item.playerWeight != null ? item.playerWeight + " lbs." : null,
                  sort : item.playerWeight != null ? Number(item.playerWeight) : null,

              },
              "age":{
                  display:item.playerAge != null ? item.playerAge.toString() : 'N/A',
                  sort : item.playerAge != null ? Number(item.playerAge) : null,
              },

              "sal":{
                  display:item.playerSalary != null ? "$" + GlobalFunctions.nFormatter(Number(item.playerSalary)) : 'N/A',
                  sort: item.playerSalary != null ? Number(item.playerSalary) : null,
              },
              "class":{
                  display:item.class != null ? getFullClassName(item.class) : null,
                  sort : item.class != null ? item.class : null,
              }



          }[columnType];
      }
      pColumn = tabCellDataroster(column.key);



      return new CellData(pColumn.display,pColumn.sort,pColumn.link,pColumn.imageUrl, pColumn.bottomStat, pColumn.bottomStat2);
  }


}
