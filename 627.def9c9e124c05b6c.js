"use strict";(self.webpackChunkmotorlog=self.webpackChunkmotorlog||[]).push([[627],{4627:(Z,v,r)=>{r.r(v),r.d(v,{HomeComponent:()=>H});var s=r(177),f=r(3955),h=r(9644),m=r(9969),e=r(4438),u=r(9417),x=r(8257),C=r(1080),T=r(1141),y=r(1667),b=r(5779);let R=(()=>{class n{static \u0275fac=function(a){return new(a||n)};static \u0275mod=e.$C({type:n});static \u0275inj=e.G2t({imports:[s.MD,b.Gg]})}return n})();const _=n=>({color:n}),S=n=>[n,"EUR","symbol","1.2-2","es-ES"];function $(n,o){if(1&n){const t=e.RV6();e.j41(0,"div",6)(1,"div",7)(2,"p-calendar",8),e.nI1(3,"translate"),e.mxI("ngModelChange",function(i){e.eBV(t);const l=e.XpG(2);return e.DH7(l.startDate,i)||(l.startDate=i),e.Njj(i)}),e.k0s(),e.j41(4,"p-calendar",8),e.nI1(5,"translate"),e.mxI("ngModelChange",function(i){e.eBV(t);const l=e.XpG(2);return e.DH7(l.endDate,i)||(l.endDate=i),e.Njj(i)}),e.k0s()(),e.j41(6,"div",9)(7,"p-button",10),e.bIt("click",function(){e.eBV(t);const i=e.XpG(2);return e.Njj(i.updateMaintenances())}),e.EFF(8),e.nI1(9,"translate"),e.k0s(),e.j41(10,"p-button",11),e.bIt("click",function(){e.eBV(t);const i=e.XpG(2);return e.Njj(i.resetFilters())}),e.EFF(11),e.nI1(12,"translate"),e.k0s()()()}if(2&n){const t=e.XpG(2);e.Y8G("@fadeInOut",void 0),e.R7$(2),e.R50("ngModel",t.startDate),e.Y8G("placeholder",e.bMT(3,11,"pages.home.filters.desde"))("showIcon",!0),e.R7$(2),e.R50("ngModel",t.endDate),e.Y8G("placeholder",e.bMT(5,13,"pages.home.filters.hasta"))("showIcon",!0),e.R7$(3),e.Y8G("text",!0),e.R7$(),e.JRh(e.bMT(9,15,"pages.home.filters.apply_filters")),e.R7$(2),e.Y8G("text",!0),e.R7$(),e.JRh(e.bMT(12,17,"pages.home.filters.reset_filters"))}}function E(n,o){if(1&n&&(e.j41(0,"span",33),e.EFF(1),e.nI1(2,"translate"),e.nrm(3,"br"),e.k0s()),2&n){const t=o.$implicit;e.R7$(),e.SpI(" ",e.bMT(2,1,t.label)," ")}}function G(n,o){if(1&n&&(e.j41(0,"div",30)(1,"ul",31),e.DNE(2,E,4,3,"span",32),e.k0s()()),2&n){const t=e.XpG().$implicit;e.Y8G("@fadeInOut",void 0),e.R7$(2),e.Y8G("ngForOf",t.serviceType)}}function w(n,o){if(1&n){const t=e.RV6();e.j41(0,"div",34)(1,"p-button",35),e.bIt("click",function(){e.eBV(t);const i=e.XpG().$implicit,l=e.XpG(4);return e.Njj(l.goToEdit(i.id))}),e.nrm(2,"i",36),e.k0s()()}2&n&&(e.Y8G("@fadeInOut",void 0),e.R7$(),e.Y8G("rounded",!0)("text",!0))}function N(n,o){if(1&n){const t=e.RV6();e.qex(0),e.j41(1,"div",15),e.bIt("click",function(){const i=e.eBV(t).$implicit,l=e.XpG(4);return e.Njj(l.toggleMaintenance(i.id))}),e.j41(2,"div",16)(3,"div",17),e.nrm(4,"i",18),e.k0s()(),e.j41(5,"div",19)(6,"div",20)(7,"div",21)(8,"h1",22),e.EFF(9),e.k0s(),e.j41(10,"p",23),e.nrm(11,"i",24),e.EFF(12),e.nI1(13,"number"),e.k0s(),e.j41(14,"p",23),e.nrm(15,"i",25),e.EFF(16),e.k0s()(),e.j41(17,"div",26)(18,"p",27),e.EFF(19),e.nI1(20,"date"),e.k0s(),e.j41(21,"p",22),e.EFF(22),e.nI1(23,"currency"),e.k0s()()(),e.DNE(24,G,3,2,"div",28)(25,w,3,3,"div",29),e.k0s()(),e.bVm()}if(2&n){const t=o.$implicit,a=e.XpG(4);e.R7$(4),e.Y8G("ngClass",a.getIconClasses(t))("ngStyle",e.eq3(23,_,t.color)),e.R7$(4),e.Y8G("ngStyle",e.eq3(25,_,t.color)),e.R7$(),e.SpI(" ",t.title," "),e.R7$(3),e.SpI(" ",e.i5U(13,11,t.odometer,"1.0-0")," km "),e.R7$(4),e.SpI(" ",t.location||"N/A"," "),e.R7$(3),e.SpI(" ",e.i5U(20,14,t.date,"d MMM")," "),e.R7$(2),e.Y8G("ngStyle",e.eq3(27,_,t.color)),e.R7$(),e.SpI(" ",e.iJd(23,17,e.eq3(29,S,t.amount))," "),e.R7$(2),e.Y8G("ngIf",a.selectedMaintenanceId===t.id),e.R7$(),e.Y8G("ngIf",a.selectedMaintenanceId===t.id)}}function O(n,o){if(1&n&&(e.qex(0),e.j41(1,"div",13)(2,"h3",14),e.EFF(3),e.k0s()(),e.DNE(4,N,26,31,"ng-container",12),e.bVm()),2&n){const t=o.$implicit;e.R7$(3),e.SpI(" ",t.date," "),e.R7$(),e.Y8G("ngForOf",t.maintenances)}}function V(n,o){if(1&n&&(e.j41(0,"div",5),e.DNE(1,O,5,2,"ng-container",12),e.k0s()),2&n){const t=e.XpG(2);e.R7$(),e.Y8G("ngForOf",t.groupedMaintenances)}}function Y(n,o){1&n&&(e.j41(0,"span"),e.EFF(1),e.nI1(2,"translate"),e.k0s()),2&n&&(e.R7$(),e.JRh(e.bMT(2,1,"pages.home.no_mant")))}function B(n,o){if(1&n){const t=e.RV6();e.j41(0,"div",0)(1,"button",1),e.bIt("click",function(){e.eBV(t);const i=e.XpG();return e.Njj(i.toggleFilters())}),e.nrm(2,"i",2),e.k0s(),e.j41(3,"p-button",3),e.bIt("onClick",function(){e.eBV(t);const i=e.XpG();return e.Njj(i.goToAddMaintenance())}),e.k0s()(),e.DNE(4,$,13,19,"div",4)(5,V,2,1,"div",5)(6,Y,3,3)}if(2&n){const t=e.XpG();e.R7$(2),e.Y8G("ngClass",t.filtersVisible?"fas fa-chevron-up":"fas fa-chevron-down"),e.R7$(),e.Y8G("rounded",!0),e.R7$(),e.Y8G("ngIf",t.filtersVisible),e.R7$(),e.vxM(5,t.groupedMaintenances.length>0?5:6)}}function X(n,o){1&n&&(e.j41(0,"span"),e.EFF(1),e.nI1(2,"translate"),e.k0s()),2&n&&(e.R7$(),e.JRh(e.bMT(2,1,"pages.home.no_vehicles")))}let z=(()=>{class n extends h.${constructor(){super(),this.vehicleSelected=(0,e.WQX)(C.b).vehicleSelected,this.groupedMaintenances=[],this.selectedMaintenanceId=null,this.startDate=null,this.endDate=null,this.filtersVisible=!1,this.es={firstDayOfWeek:1,dayNames:["Domingo","Lunes","Martes","Mi\xe9rcoles","Jueves","Viernes","S\xe1bado"],dayNamesShort:["Dom","Lun","Mar","Mi\xe9","Jue","Vie","S\xe1b"],monthNames:["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],monthNamesShort:["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],today:"Hoy"},(0,e.QZP)(()=>{this.updateMaintenances()})}filterMaintenances(t){if(!this.startDate&&!this.endDate)return t;const a=this.startDate?new Date(this.startDate):new Date("0001-01-01"),i=this.endDate?new Date(this.endDate):new Date("9999-12-31");return i.setHours(23,59,59,999),t.filter(l=>{const c=new Date(l.date);return c>=a&&c<=i})}groupAndSortMaintenances(t){const a=t.reduce((i,l)=>{const d=new Date(l.date).toLocaleString("default",{month:"short",year:"numeric"}),p=l.serviceType||[],Q=this.translateSvc.instant("pages.mant-details.add-mant.service-type.default"),U=p[0]&&this.translateSvc.instant(p[0]?.label?.toString())||null,L=0===p.length?Q:U+(p.length>1?" +"+(p.length-1):""),P=p.length>0?p[0].color:"text-gray-600",W={...l,title:L,color:P};return i[d]||(i[d]=[]),i[d].push(W),i},{});return Object.keys(a).forEach(i=>{a[i].sort((l,c)=>new Date(c.date).getTime()-new Date(l.date).getTime())}),Object.keys(a).map(i=>({date:i,maintenances:a[i]})).sort((i,l)=>{const c=new Date(a[i.date][0].date);return new Date(a[l.date][0].date).getTime()-c.getTime()})}toggleMaintenance(t){this.selectedMaintenanceId=this.selectedMaintenanceId===t?null:t}goToEdit(t){this.routerSvc.navigate([`${x.a.routes.maintenanceDetails}/${t}`])}getIconClasses(t){return[t.icon||"fas fa-question-circle","text-xl"]}updateMaintenances(){const t=this.vehicleSelected();if(t&&t.mantenimientos&&t.mantenimientos.length>0){const a=this.filterMaintenances(t.mantenimientos);this.groupedMaintenances=this.groupAndSortMaintenances(a)}else this.groupedMaintenances=[]}resetFilters(){this.startDate=null,this.endDate=null,this.updateMaintenances()}toggleFilters(){this.filtersVisible=!this.filtersVisible}goToAddMaintenance(){this.routerSvc.navigate([x.a.routes.addMaintenance])}static{this.\u0275fac=function(a){return new(a||n)}}static{this.\u0275cmp=e.VBU({type:n,selectors:[["app-maintenance-timeline"]],standalone:!0,features:[e.Vt3,e.aNF],decls:2,vars:1,consts:[[1,"flex","justify-between","items-center","mb-4"],[1,"p-button","p-button-info","p-button-icon",3,"click"],[3,"ngClass"],["icon","fas fa-plus","severity","success",3,"onClick","rounded"],["class","flex flex-col md:flex-row justify-between items-start mb-4 mt-5 relative z-20",4,"ngIf"],[1,"w-full","pt-5","mb-20"],[1,"flex","flex-col","md:flex-row","justify-between","items-start","mb-4","mt-5","relative","z-20"],[1,"flex","flex-col","gap-4","mb-4","md:mb-0","w-full","md:w-auto"],[3,"ngModelChange","ngModel","placeholder","showIcon"],[1,"flex","md:flex-col","md:gap-4","w-full","md:w-auto","md:ml-4","md:mr-10"],[3,"click","text"],["severity","danger",3,"click","text"],[4,"ngFor","ngForOf"],[1,"ps-2","my-2","first:mt-0"],[1,"text-xs","font-medium","uppercase","text-gray-500"],[1,"flex","gap-x-3","relative","group","rounded-lg","hover:bg-gray-100","cursor-pointer",3,"click"],[1,"relative","last:after:hidden","after:absolute","after:top-7","after:bottom-0","after:start-3.5","after:w-px","after:-translate-x-[0.5px]","after:bg-gray-200","dark:after:bg-neutral-700"],[1,"relative","z-10","size-7","flex","justify-center","items-center"],[3,"ngClass","ngStyle"],[1,"grow","p-2","pb-8"],[1,"flex","justify-between","items-start","text-sm"],[1,"flex","flex-col"],[1,"font-semibold","text-base",3,"ngStyle"],[1,"mt-1","flex","items-center","text-gray-600"],[1,"fas","fa-tachometer-alt","mr-1"],[1,"fas","fa-map-pin","mr-1"],[1,"flex","flex-col","items-end"],[1,"mt-1","text-gray-400"],["class","font-semibold text-base",4,"ngIf"],["class","absolute bottom-2 right-2",4,"ngIf"],[1,"font-semibold","text-base"],[1,"list-inside","text-xs","pt-2"],["class","text-gray-500",4,"ngFor","ngForOf"],[1,"text-gray-500"],[1,"absolute","bottom-2","right-2"],["severity","primary",1,"text-gray-500","hover:text-gray-700",3,"click","rounded","text"],[1,"fas","fa-pencil-alt","text-lg"]],template:function(a,i){1&a&&e.DNE(0,B,7,4)(1,X,3,3),2&a&&e.vxM(0,i.vehicleSvc.vehicles().length>0?0:1)},dependencies:[s.MD,s.YU,s.Sq,s.bT,s.B3,s.QX,s.oe,s.vh,R,f.h,f.D9,T.tm,T.$n,y.rO,y.Vv,u.YN,u.BC,u.vS],encapsulation:2,data:{animation:[(0,m.hZ)("fadeInOut",[(0,m.wk)("void",(0,m.iF)({opacity:0,transform:"scale(0.95)",height:0,overflow:"hidden"})),(0,m.wk)("*",(0,m.iF)({opacity:1,transform:"scale(1)",height:"*"})),(0,m.kY)("void => *",[(0,m.i0)("300ms ease-out")]),(0,m.kY)("* => void",[(0,m.i0)("300ms ease-in")])])]}})}}return n})();var A=r(5151),J=r(6554);let H=(()=>{class n extends h.${ngOnInit(){this.userSvc.page.update(t=>"pages.home.title")}static{this.\u0275fac=(()=>{let t;return function(i){return(t||(t=e.xGo(n)))(i||n)}})()}static{this.\u0275cmp=e.VBU({type:n,selectors:[["app-home"]],standalone:!0,features:[e.Vt3,e.aNF],decls:5,vars:0,consts:[[1,"flex","flex-col","justify-center","items-center","py-3"],[1,"container","mx-auto","max-w-screen-md","pl-5"],[1,"mx-auto","max-w-screen-md","sm:max-w-screen-lg","px-6","sm:pt-6","sm:pb-4","my-0","sm:my-3","bg-white","border-0","sm-shadow-lg","sm:rounded-3xl"]],template:function(a,i){1&a&&(e.j41(0,"div",0),e.nrm(1,"app-vehicle-selector"),e.k0s(),e.j41(2,"div",1)(3,"div",2),e.nrm(4,"app-maintenance-timeline"),e.k0s()())},dependencies:[s.MD,f.h,J.PO,A.R,z]})}}return n})()}}]);