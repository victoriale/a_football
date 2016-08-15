import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {GlobalSettings} from '../global/global-settings';
import {Link} from '../global/global-interface';

@Injectable()
export class FooterService {
  private _apiUrl: string = GlobalSettings.getApiUrl();
  constructor(public http: Http){}
  setToken(){
    var headers = new Headers();
    return headers;
  }
  // getDykService(profile, id){
  getFooterService(scope: string, profile: string){
    var headers = this.setToken();
    var fullUrl = 'http://dev-touchdownloyal-api.synapsys.us';//TODO
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
      var text = i.toUpperCase();
      if(data[i] == true){
        navigationArray.push({
          text: text,
          active: true,
          route: ['Directory-page-starts-with',
          {
            type: profile,
            page: 1,
            startsWith: text
          }]
        });
      }
    }
    return navigationArray;
    }
}