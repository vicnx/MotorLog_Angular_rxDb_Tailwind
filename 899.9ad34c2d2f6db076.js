"use strict";(self.webpackChunkmotorlog=self.webpackChunkmotorlog||[]).push([[899],{7899:(O,u,n)=>{n.r(u),n.d(u,{CustomServiceDetailsComponent:()=>F});var m=n(177),e=n(4438),i=n(9417),v=n(3955),g=n(9644),E=n(6554),d=n(1141),p=n(9240),S=n(8833),C=n(1802),_=n(2242),h=n(5901),b=n(5779);const D=s=>({color:s});function f(s,c){1&s&&(e.j41(0,"div",11),e.EFF(1),e.nI1(2,"translate"),e.k0s()),2&s&&(e.R7$(),e.SpI(" ",e.bMT(2,1,"pages.custom-services.validations.label_required")," "))}function I(s,c){if(1&s&&e.nrm(0,"i",12),2&s){let o;const l=c.$implicit,t=e.XpG();e.HbH(l),e.Y8G("ngStyle",e.eq3(3,D,null==(o=t.customServiceForm.get("color"))?null:o.value))}}function M(s,c){1&s&&(e.j41(0,"div",11),e.EFF(1),e.nI1(2,"translate"),e.k0s()),2&s&&(e.R7$(),e.SpI(" ",e.bMT(2,1,"pages.custom-services.validations.icono_required")," "))}let F=(()=>{class s extends g.${constructor(){super(...arguments),this.optionsIcons=[],this.formBuilder=(0,e.WQX)(i.ok),this.isConsulta=!1}ngOnInit(){this.routeSvc.data.subscribe(o=>{this.isConsulta=o.isConsulta}),this.userSvc.page.update(o=>this.isConsulta?"pages.custom-services.edit_customService":"pages.custom-services.add_customService"),this.initForm()}onSubmit(){console.log(this.customServiceForm.value),this.customServiceForm.valid?this.newCustomService():this.markFieldsAsTouched(this.customServiceForm)}newCustomService(){this.spinnerSvc.show(),this.userSvc.addCustomServiceToUser(this.customServiceForm.value).subscribe({next:o=>{console.log(o),this.operationOK()}})}operationOK(){this.showSuccess(),this.spinnerSvc.hide(),this.routerSvc.navigate([this.const.routes.customServiceList])}initForm(){this.customServiceForm=this.formBuilder.group({label:["",i.k0.required],value:["",i.k0.required],color:["#ff0000"],icon:["fas fa-car",i.k0.required]}),this.customServiceForm.get("label")?.valueChanges.subscribe(o=>{this.customServiceForm.patchValue({value:o.toLowerCase()})}),this.loadIcons()}loadIcons(){this.vehicleSvc.getIcons().subscribe({next:o=>{this.optionsIcons=o.icons}})}static{this.\u0275fac=(()=>{let o;return function(t){return(o||(o=e.xGo(s)))(t||s)}})()}static{this.\u0275cmp=e.VBU({type:s,selectors:[["app-add-vehicle"]],standalone:!0,features:[e.Vt3,e.aNF],decls:24,vars:22,consts:[[1,"mx-auto","h-screen","md:h-full","max-w-md","sm:max-w-screen-md","px-6","sm:pt-6","sm:pb-4","my-0","sm:my-5","bg-white","border-0","shadow-lg","sm:rounded-3xl"],[1,"container","mx-auto","max-w-screen-md"],[1,"p-4",3,"ngSubmit","formGroup"],[1,"mb-4"],[1,"block","text-gray-700","text-sm","font-bold","mb-2"],["pInputText","","type","text","formControlName","label",1,"w-full",3,"placeholder","disabled"],["class","text-red-500 text-sm mt-1",4,"ngIf"],["formControlName","color",3,"disabled"],["optionLabel","icon","formControlName","icon",3,"options","disabled"],["pTemplate",""],["type","submit",3,"label"],[1,"text-red-500","text-sm","mt-1"],[1,"w-5","h-5","text-2xl",3,"ngStyle"]],template:function(l,t){if(1&l&&(e.j41(0,"div",0)(1,"div",1)(2,"form",2),e.bIt("ngSubmit",function(){return t.onSubmit()}),e.j41(3,"div",3)(4,"label",4),e.EFF(5),e.nI1(6,"translate"),e.k0s(),e.nrm(7,"input",5),e.nI1(8,"translate"),e.DNE(9,f,3,3,"div",6),e.k0s(),e.j41(10,"div",3)(11,"label",4),e.EFF(12),e.nI1(13,"translate"),e.k0s(),e.nrm(14,"p-colorPicker",7),e.k0s(),e.j41(15,"div",3)(16,"label",4),e.EFF(17),e.nI1(18,"translate"),e.k0s(),e.j41(19,"p-selectButton",8),e.DNE(20,I,1,5,"ng-template",9),e.k0s(),e.DNE(21,M,3,3,"div",6),e.k0s(),e.nrm(22,"p-button",10),e.nI1(23,"translate"),e.k0s()()()),2&l){let r,a;e.R7$(2),e.Y8G("formGroup",t.customServiceForm),e.R7$(3),e.JRh(e.bMT(6,12,"pages.custom-services.label")),e.R7$(2),e.Y8G("placeholder",e.bMT(8,14,"pages.custom-services.label"))("disabled",t.isConsulta),e.R7$(2),e.Y8G("ngIf",(null==t.customServiceForm||null==(r=t.customServiceForm.get("label"))?null:r.invalid)&&(null==t.customServiceForm||null==(r=t.customServiceForm.get("label"))?null:r.touched)),e.R7$(3),e.JRh(e.bMT(13,16,"pages.custom-services.color")),e.R7$(2),e.Y8G("disabled",t.isConsulta),e.R7$(3),e.JRh(e.bMT(18,18,"pages.custom-services.icon")),e.R7$(2),e.Y8G("options",t.optionsIcons)("disabled",t.isConsulta),e.R7$(2),e.Y8G("ngIf",(null==t.customServiceForm||null==(a=t.customServiceForm.get("icon"))?null:a.invalid)&&(null==t.customServiceForm||null==(a=t.customServiceForm.get("icon"))?null:a.touched)),e.R7$(),e.Y8G("label",e.bMT(23,20,"pages.custom-services.save"))}},dependencies:[m.MD,m.bT,m.B3,v.h,v.D9,E.PO,_.u,_.S,S.kr,b.Ei,i.YN,i.qT,i.me,i.BC,i.cb,i.X1,i.j4,i.JD,d.tm,d.$n,h.xs,h.JC,p.YG,p.sk,C.O3],encapsulation:2})}}return s})()}}]);