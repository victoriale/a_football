import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { routing } from '../router/app.routing';
//Root Component
import { AppDomain }  from '../app-domain/app.domain';

//NgModules
import {GlobalModule} from "./global.ngmodule";
import { DeepDiveNgModule } from "./deep-dive.ngmodule";
// import { SyndicatedArticleNgModule } from "./syndicated-article.ngmodule";
import {HttpModule, Headers, Http} from "@angular/http";
// import {SearchPageNgModule} from "./search-page.ngmodule";
// import {SearchService} from "../services/search.service";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    GlobalModule,
    DeepDiveNgModule,
    // SyndicatedArticleNgModule,
    // SearchPageNgModule
  ],
  declarations: [
    AppDomain
  ],
  // providers: [HttpModule, SearchService],
  providers: [HttpModule],
  bootstrap: [ AppDomain ]
})
export class AppModule { }
