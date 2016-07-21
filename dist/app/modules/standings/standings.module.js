System.register(['@angular/core', '../../components/module-header/module-header.component', '../../components/module-footer/module-footer.component', '../../components/standings/standings.component'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, module_header_component_1, module_footer_component_1, standings_component_1;
    var StandingsModule;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (module_header_component_1_1) {
                module_header_component_1 = module_header_component_1_1;
            },
            function (module_footer_component_1_1) {
                module_footer_component_1 = module_footer_component_1_1;
            },
            function (standings_component_1_1) {
                standings_component_1 = standings_component_1_1;
            }],
        execute: function() {
            StandingsModule = (function () {
                function StandingsModule() {
                    this.tabSelectedListener = new core_1.EventEmitter();
                    this.headerInfo = {
                        moduleTitle: "Standings",
                        hasIcon: false,
                        iconClass: ""
                    };
                    this.footerInfo = {
                        infoDesc: "Want to see the full standings page?",
                        text: "VIEW FULL STANDINGS",
                        url: ['Standings-page']
                    };
                }
                StandingsModule.prototype.ngOnChanges = function () {
                    if (!this.data) {
                        this.headerInfo.moduleTitle = "Standings";
                    }
                    else {
                        this.headerInfo.moduleTitle = this.data.moduleTitle;
                        this.footerInfo.url = this.data.pageRouterLink;
                    }
                };
                StandingsModule.prototype.tabSelected = function (tabData) {
                    this.tabSelectedListener.next(tabData);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], StandingsModule.prototype, "data", void 0);
                __decorate([
                    core_1.Output("tabSelected"), 
                    __metadata('design:type', Object)
                ], StandingsModule.prototype, "tabSelectedListener", void 0);
                StandingsModule = __decorate([
                    core_1.Component({
                        selector: "standings-module",
                        templateUrl: "./app/modules/standings/standings.module.html",
                        directives: [module_header_component_1.ModuleHeader, module_footer_component_1.ModuleFooter, standings_component_1.StandingsComponent],
                    }), 
                    __metadata('design:paramtypes', [])
                ], StandingsModule);
                return StandingsModule;
            }());
            exports_1("StandingsModule", StandingsModule);
        }
    }
});
