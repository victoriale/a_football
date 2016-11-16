import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {GlobalSettings} from '../global/global-settings';
import {GlobalFunctions} from '../global/global-functions';
import {Link} from '../global/global-interface';
import {Router} from '@angular/router';

@Injectable()
export class FooterService {
  private _apiUrl: string = GlobalSettings.getApiUrl();
  constructor(public http: Http, private _router:Router){}
  setToken(){
    var headers = new Headers();
    return headers;
  }
  // getDykService(profile, id){
  getFooterService(scope: string, profile: string){
    var headers = this.setToken();
    var fullUrl = GlobalSettings.getApiUrl();//TODO
    //example url = 'http://dev-touchdownloyal-api.synapsys.us/footer/nfl/player';
    fullUrl += "/footer";
    if(scope !== undefined){
      fullUrl += "/" + scope;
      if(profile !== undefined){
        fullUrl += "/" + profile;
      }
    }
    return this.http.get(fullUrl, {
        headers: headers
      })
      .map(
        res => res.json()
      )
      .map(
        data => {
          return this.footerData(data.data, scope, profile);
        },
        err => {
          console.log('INVALID DATA');
        }
      )
  }
  footerData(data, scope: string, profile: string): Array<Link>{
    var navigationArray: Array<Link> = [];
    //Build alphabet array for navigation links
    for ( var i in data ) {
      var relPath = GlobalFunctions.routerRelPath(this._router);
      let domainHostName;
      let urlRouteArray;
      let domainParams = {}

      domainHostName = GlobalSettings.getRouteFullParams().domainHostName;
      if(GlobalSettings.getRouteFullParams().domainParams.partner_id != null){
        domainParams['partner_id'] = GlobalSettings.getRouteFullParams().domainParams.partner_id;
      }
      domainParams['scope'] = GlobalSettings.getRouteFullParams().domainParams.scope == 'home' ? 'nfl' : GlobalSettings.getRouteFullParams().domainParams.scope;

      var text = i.toUpperCase();
      navigationArray.push({
        text: text,
        active: data[i],
        route: [relPath+domainHostName, domainParams,'Directory-page-starts-with',
        {
          type: profile+'s',
          page: 1,
          startsWith: text
        }]
      });
    }
    return navigationArray;
    }
}
