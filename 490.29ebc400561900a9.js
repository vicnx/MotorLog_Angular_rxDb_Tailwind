"use strict";(self.webpackChunkmotorlog=self.webpackChunkmotorlog||[]).push([[490],{4490:(ge,g,l)=>{l.r(g),l.d(g,{SettingsComponent:()=>fe});var i=l(4438),h=l(1626),y=l(9644),p=l(177),T=l(3955),M=l(1141),u=l(8542),v=l(2010),x=l(5779),k=l(563);let re=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=i.$C({type:t});static \u0275inj=i.G2t({imports:[p.MD,v.iI,k.Z,u.S,x.Gg,v.iI,u.S,x.Gg]})}return t})();var le=l(713),C=l(8257),ce=l(4799);const me=["fileInput"];function pe(t,s){if(1&t){const e=i.RV6();i.j41(0,"a",9),i.bIt("click",function(){i.eBV(e);const o=i.XpG().$implicit,a=i.XpG();return i.Njj(a.handleMenuAction(o.action))}),i.j41(1,"div",10),i.nrm(2,"i",11),i.j41(3,"span",12),i.EFF(4),i.k0s()(),i.nrm(5,"i",13),i.k0s()}if(2&t){const e=i.XpG().$implicit,n=i.XpG();i.R7$(2),i.Y8G("ngClass",e.icon+" text-gray-500"),i.R7$(2),i.JRh(n.getTranslatedLabel(e.label))}}function de(t,s){if(1&t){const e=i.RV6();i.j41(0,"div")(1,"a",9),i.bIt("click",function(){const o=i.eBV(e).$implicit,a=i.XpG(3);return i.Njj(a.handleMenuAction(o.action))}),i.j41(2,"div",10),i.nrm(3,"i",11),i.j41(4,"span",12),i.EFF(5),i.k0s()(),i.nrm(6,"i",13),i.k0s(),i.nrm(7,"hr"),i.k0s()}if(2&t){const e=s.$implicit,n=i.XpG(3);i.R7$(3),i.Y8G("ngClass",e.icon+" text-gray-500"),i.R7$(2),i.JRh(n.getTranslatedLabel(e.label))}}function ue(t,s){if(1&t&&(i.j41(0,"div")(1,"div",14),i.nrm(2,"i",11),i.j41(3,"span",15),i.EFF(4),i.k0s()(),i.DNE(5,de,8,2,"div",16),i.k0s()),2&t){const e=i.XpG().$implicit,n=i.XpG();i.R7$(2),i.Y8G("ngClass",e.icon+" text-gray-500"),i.R7$(2),i.JRh(n.getTranslatedLabel(e.label)),i.R7$(),i.Y8G("ngForOf",e.items)}}function _e(t,s){if(1&t&&(i.j41(0,"div",6),i.DNE(1,pe,6,2,"a",7)(2,ue,6,3,"div",8),i.k0s()),2&t){const e=s.$implicit;i.R7$(),i.Y8G("ngIf",0===(null==e.items?null:e.items.length)),i.R7$(),i.Y8G("ngIf",null==e.items?null:e.items.length)}}let fe=(()=>{class t extends y.${constructor(){super(...arguments),this.http=(0,i.WQX)(h.Qq),this.settingsMenu=[],this.dataSvc=(0,i.WQX)(le.N)}ngOnInit(){this.userSvc.page.update(e=>"pages.settings.settings"),this.loadSettingsMenu()}loadSettingsMenu(){this.http.get("assets/data/settings-menu.json").subscribe(e=>{this.settingsMenu=e.settingsMenu},e=>{console.error("Error loading settings menu:",e)})}handleMenuAction(e){switch(e){case"import":this.importData();break;case"export":this.exportData();break;case"delete":this.deleteData();break;case"profile":this.routerSvc.navigate([C.a.routes.profile]);break;case"fixmant":this.fixMantIds();break;default:console.warn("Action not found:",e)}}importData(){this.fileInput.nativeElement.click()}exportData(){this.showSuccess(),this.dataSvc.exportData()}deleteData(){this.confirmationSvc.confirm({message:this.translateSvc.instant("pages.settings.delete_data.confirm_msg"),header:this.translateSvc.instant("pages.settings.delete_data.confirm_header"),icon:"fas fa-exclamation-triangle",rejectButtonStyleClass:"p-button-text",acceptLabel:this.translateSvc.instant("confirm.default_yes"),rejectLabel:this.translateSvc.instant("confirm.default_no"),key:"confirmDialog",accept:()=>{this.dataSvc.clearAllData(),setTimeout(()=>{this.routerSvc.navigate([C.a.routes.welcome])},500)},reject:()=>{}})}getTranslatedLabel(e){return this.translateSvc.instant(e)}fixMantIds(){this.confirmationSvc.confirm({message:this.translateSvc.instant("pages.settings.fixMant.confirm_msg"),header:this.translateSvc.instant("pages.settings.fixMant.confirm_header"),icon:"fas fa-exclamation-triangle",rejectButtonStyleClass:"p-button-text",acceptLabel:this.translateSvc.instant("confirm.default_yes"),rejectLabel:this.translateSvc.instant("confirm.default_no"),key:"confirmDialog",accept:()=>{this.spinnerSvc.show(),this.vehicleSvc.fixDuplicateMaintenanceIds(this.vehicleSvc.vehicleSelected()).subscribe({next:e=>{this.spinnerSvc.hide(),this.showSuccess()},error:e=>{this.showErrorMsg(e),this.spinnerSvc.hide()}})},reject:()=>{}})}static{this.\u0275fac=(()=>{let e;return function(o){return(e||(e=i.xGo(t)))(o||t)}})()}static{this.\u0275cmp=i.VBU({type:t,selectors:[["app-settings"]],viewQuery:function(n,o){if(1&n&&i.GBs(me,5),2&n){let a;i.mGM(a=i.lsd())&&(o.fileInput=a.first)}},standalone:!0,features:[i.Vt3,i.aNF],decls:6,vars:1,consts:[["fileInput",""],[1,"bg-gray-50","min-h-screen"],[1,"sm:mx-auto","max-w-screen-md","sm:px-6","sm:pt-6","sm:pb-4","my-0","sm:my-5","pt-5","mx-3"],[1,"max-w-full","mx-autorounded-none","flex","justify-center","flex-col","items-center"],["class","w-full border-b max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 mb-5",4,"ngFor","ngForOf"],["type","file","accept",".json",2,"display","none",3,"change"],[1,"w-full","border-b","max-w-sm","bg-white","border","border-gray-200","rounded-lg","shadow","dark:bg-gray-800","dark:border-gray-700","dark:hover:bg-gray-700","mb-5"],["class","flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition duration-500 ease-in-out transform",3,"click",4,"ngIf"],[4,"ngIf"],[1,"flex","items-center","justify-between","p-4","hover:bg-gray-50","rounded-lg","cursor-pointer","transition","duration-500","ease-in-out","transform",3,"click"],[1,"flex","items-center","space-x-4"],[3,"ngClass"],[1,"text-lg"],[1,"fas","fa-chevron-right","text-gray-400"],[1,"p-2","text-xs","text-gray-400","uppercase","ml-1"],[1,"ml-2"],[4,"ngFor","ngForOf"]],template:function(n,o){if(1&n){const a=i.RV6();i.j41(0,"div",1)(1,"div",2)(2,"div",3),i.DNE(3,_e,3,2,"div",4),i.k0s()()(),i.j41(4,"input",5,0),i.bIt("change",function(c){return i.eBV(a),i.Njj(o.dataSvc.onFileSelected(c))}),i.k0s()}2&n&&(i.R7$(3),i.Y8G("ngForOf",o.settingsMenu))},dependencies:[p.MD,p.YU,p.Sq,p.bT,h.q1,T.h,M.tm,u.S,re,ce.F],encapsulation:2})}}return t})()}}]);