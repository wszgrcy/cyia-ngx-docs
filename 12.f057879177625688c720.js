(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{sWhO:function(e,t,a){"use strict";a.r(t),a.d(t,"BaseTableModule",(function(){return w}));var s=a("ofXK"),i=a("Zg31"),n=a("5Lli"),r=a("C8u/"),c=a("fXoL"),d=a("ckw7"),o=a("+0xr");function h(e,t){if(1&e&&(c.Sb(0,"th",7),c.yc(1),c.Rb()),2&e){const e=c.ec().index,t=c.ec();c.Bb(1),c.Ac(" ",t._headers[e]," ")}}function l(e,t){if(1&e&&(c.Sb(0,"td",8),c.yc(1),c.Rb()),2&e){const e=t.$implicit,a=c.ec().index;c.Bb(1),c.Ac(" ",e[a]," ")}}function f(e,t){if(1&e&&(c.Qb(0),c.Qb(1,4),c.wc(2,h,2,1,"th",5),c.wc(3,l,2,1,"td",6),c.Pb(),c.Pb()),2&e){const e=t.index,a=c.ec();c.Bb(1),c.jc("matColumnDef",a.fileds[e])}}function b(e,t){1&e&&c.Nb(0,"tr",9)}function u(e,t){1&e&&c.Nb(0,"tr",10)}let m=(()=>{class e{constructor(e,t){this.storeService=e,this.elementRef=t,this.headers=void 0,this.aligns="",this.data="",this._headers=[],this._aligns=[],this._data=[],this.fileds=[]}ngOnInit(){}ngOnChanges(e){Object(i.a)(e.index,this.index)&&this.storeService.select(n.a).pipe(Object(r.a)(this.index)).subscribe(e=>{this.headers=e.headers,this.data=e.data,this.aligns=e.aligns,this.headers&&(this._headers=JSON.parse(this.headers),this._headers.forEach((e,t)=>{this.fileds.push("field"+t)})),this.aligns&&(this._aligns=JSON.parse(this.aligns)),this.data&&(this._data=JSON.parse(this.data))})}}return e.\u0275fac=function(t){return new(t||e)(c.Mb(d.a),c.Mb(c.l))},e.\u0275cmp=c.Gb({type:e,selectors:[["base-table"]],inputs:{index:"index",headers:"headers",aligns:"aligns",data:"data"},features:[c.zb],decls:4,vars:4,consts:[["mat-table","",1,"mat-elevation-z8",3,"dataSource"],[4,"ngFor","ngForOf"],["mat-header-row","",4,"matHeaderRowDef"],["mat-row","",4,"matRowDef","matRowDefColumns"],[3,"matColumnDef"],["mat-header-cell","",4,"matHeaderCellDef"],["mat-cell","",4,"matCellDef"],["mat-header-cell",""],["mat-cell",""],["mat-header-row",""],["mat-row",""]],template:function(e,t){1&e&&(c.Sb(0,"table",0),c.wc(1,f,4,1,"ng-container",1),c.wc(2,b,1,0,"tr",2),c.wc(3,u,1,0,"tr",3),c.Rb()),2&e&&(c.jc("dataSource",t._data),c.Bb(1),c.jc("ngForOf",t.fileds),c.Bb(1),c.jc("matHeaderRowDef",t.fileds),c.Bb(1),c.jc("matRowDefColumns",t.fileds))},directives:[o.j,s.k,o.g,o.i,o.c,o.e,o.b,o.d,o.a,o.f,o.h],styles:[""]}),e})(),w=(()=>{class e{constructor(){this.entry=m}}return e.\u0275mod=c.Kb({type:e}),e.\u0275inj=c.Jb({factory:function(t){return new(t||e)},imports:[[s.c,o.k]]}),e})()}}]);