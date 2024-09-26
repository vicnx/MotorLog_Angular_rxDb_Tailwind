"use strict";(self.webpackChunkmotorlog=self.webpackChunkmotorlog||[]).push([[991],{991:(M,d,n)=>{n.r(d),n.d(d,{WelcomeComponent:()=>O});var i=n(177),t=n(4438),o=n(9417),f=n(3955),v=n(8257),g=n(9644),r=n(713),D=n(1141),m=n(2242),l=n(9998);const a=["fileInput"],h=e=>({userName:e});function E(e,p){1&e&&(t.EFF(0),t.nI1(1,"translate")),2&e&&t.SpI(" ",t.bMT(1,1,"welcome.title")," ")}function x(e,p){if(1&e&&(t.j41(0,"span",11),t.EFF(1),t.nI1(2,"translate"),t.k0s()),2&e){const c=t.XpG();t.R7$(),t.SpI("\u{1f44b} ",t.i5U(2,1,"welcome.welcome-back",t.eq3(4,h,c.userSvc.user().name))," \u{1f44b}")}}function I(e,p){if(1&e&&t.nrm(0,"input",17),2&e){const c=t.XpG();t.Y8G("maxlength",c.const.form.inputText.maxLength)}}function C(e,p){1&e&&(t.EFF(0),t.nI1(1,"translate")),2&e&&t.SpI(" ",t.bMT(1,1,"welcome.start")," ")}function S(e,p){1&e&&(t.EFF(0),t.nI1(1,"translate")),2&e&&t.SpI(" ",t.bMT(1,1,"welcome.continue")," ")}function T(e,p){if(1&e){const c=t.RV6();t.j41(0,"footer",14)(1,"div",18)(2,"p",19),t.EFF(3),t.nI1(4,"translate"),t.k0s(),t.j41(5,"p-button",20),t.bIt("onClick",function(){t.eBV(c);const s=t.XpG();return t.Njj(s.importData())}),t.k0s()()()}2&e&&(t.R7$(3),t.JRh(t.bMT(4,3,"welcome.importText")),t.R7$(2),t.Y8G("rounded",!1)("text",!0))}let O=(()=>{class e extends g.${constructor(){super(),this.welcomeImg="assets/images/welcome.svg",this.dataSvc=(0,t.WQX)(r.N),this.loginForm=new o.gE({userName:new o.MJ("",[o.k0.required,o.k0.maxLength(Number(v.a.form.inputText))])}),(0,t.QZP)(()=>{this.userSvc.userExistOnBd()&&this.userSvc.checkUserExistsDb(),this.userSvc.isUserLogged()&&this.routerSvc.navigate([this.const.routes.home])})}ngOnInit(){this.checkUser()}checkErrors(){return this.userSvc.userExistOnBd()&&!this.userSvc.isUserLogged()?(this.userSvc.setLogginUser(!0),this.spinnerSvc.hide(),void this.userSvc.displayWelcomeDialogInfo.set(!0)):(this.spinnerSvc.show(),this.loginForm.invalid?(this.showErrorMsg(this.translateSvc.instant("errors.MSGS.name")),void this.spinnerSvc.hide()):void this.registerUser())}importData(){console.log(this.fileInput),this.fileInput.nativeElement.click()}registerUser(){this.userSvc.userExistOnBd()||(this.userSvc.setUser(this.loginForm.get("userName")?.value),this.userSvc.displayWelcomeDialogInfo.set(!0),this.spinnerSvc.hide())}static{this.\u0275fac=function(u){return new(u||e)}}static{this.\u0275cmp=t.VBU({type:e,selectors:[["welcome-page"]],viewQuery:function(u,s){if(1&u&&t.GBs(a,5),2&u){let _;t.mGM(_=t.lsd())&&(s.fileInput=_.first)}},standalone:!0,features:[t.Vt3,t.aNF],decls:25,vars:11,consts:[["fileInput",""],[3,"ngSubmit","formGroup"],[1,"h-screen","flex","flex-col"],[1,"flex","flex-col","justify-start","mt-36"],[1,"flex","items-center","flex-col"],["alt","",1,"h-32","mx-auto",3,"src"],[1,"text-2xl","mt-5"],[1,"text-primary-500","font-bold"],[1,"w-3/4","text-center","text-sm","mt-2"],[1,"p-4","mt-1","w-3/4","text-center"],[1,"mb-1"],[1,"text-xl"],["type","submit",3,"outlined"],[1,"fas","fa-chevron-right","ml-2"],[1,"flex","items-center","flex-col","py-5","text-center","w-100","mb-5","mt-10"],["key","toast","position","top-center"],["type","file","accept",".json",2,"display","none",3,"change"],["type","text","name","userName","formControlName","userName","required","","placeholder","Name","pInputText","",1,"m-2",3,"maxlength"],[1,"w-3/4"],[1,"text-xs"],["icon","fas fa-cloud-download-alt",3,"onClick","rounded","text"]],template:function(u,s){if(1&u){const _=t.RV6();t.j41(0,"form",1),t.bIt("ngSubmit",function(){return t.eBV(_),t.Njj(s.checkErrors())}),t.j41(1,"div",2)(2,"div",3)(3,"div",4),t.nrm(4,"img",5),t.j41(5,"h1",6),t.DNE(6,E,2,3),t.j41(7,"span",7),t.EFF(8),t.k0s()(),t.j41(9,"p",8),t.EFF(10),t.nI1(11,"translate"),t.k0s(),t.j41(12,"div",9)(13,"div",10),t.DNE(14,x,3,6,"span",11)(15,I,1,1),t.k0s()(),t.j41(16,"div")(17,"p-button",12),t.DNE(18,C,2,3)(19,S,2,3),t.nrm(20,"i",13),t.k0s()()()(),t.DNE(21,T,6,5,"footer",14),t.k0s(),t.nrm(22,"p-toast",15),t.j41(23,"input",16,0),t.bIt("change",function(R){return t.eBV(_),t.Njj(s.dataSvc.onFileSelected(R))}),t.k0s()()}2&u&&(t.Y8G("formGroup",s.loginForm),t.R7$(4),t.Y8G("src",s.welcomeImg,t.B4B),t.R7$(2),t.vxM(6,s.userSvc.userExistOnBd()?-1:6),t.R7$(2),t.SpI(" ",s.const.appName," \u{1f697}"),t.R7$(2),t.JRh(t.bMT(11,9,"welcome.info")),t.R7$(4),t.vxM(14,s.userSvc.userExistOnBd()&&!s.userSvc.isUserLogged()?14:15),t.R7$(3),t.Y8G("outlined",!0),t.R7$(),t.vxM(18,s.userSvc.userExistOnBd()?19:18),t.R7$(3),t.vxM(21,s.userSvc.userExistOnBd()?-1:21))},dependencies:[i.MD,f.h,f.D9,o.X1,o.qT,o.me,o.BC,o.cb,o.YS,o.tU,o.j4,o.JD,m.u,m.S,D.tm,D.$n,l.MB,l.y8],changeDetection:0})}}return e})()},2242:(M,d,n)=>{n.d(d,{S:()=>v,u:()=>g});var i=n(4438),t=n(177),o=n(9417),f=n(5779);let v=(()=>{class r{el;ngModel;cd;config;variant="outlined";filled;constructor(m,l,a,h){this.el=m,this.ngModel=l,this.cd=a,this.config=h}ngAfterViewInit(){this.updateFilledState(),this.cd.detectChanges()}ngDoCheck(){this.updateFilledState()}onInput(){this.updateFilledState()}updateFilledState(){this.filled=this.el.nativeElement.value&&this.el.nativeElement.value.length||this.ngModel&&this.ngModel.model}static \u0275fac=function(l){return new(l||r)(i.rXU(i.aKT),i.rXU(o.vS,8),i.rXU(i.gRc),i.rXU(f.r1))};static \u0275dir=i.FsC({type:r,selectors:[["","pInputText",""]],hostAttrs:[1,"p-inputtext","p-component","p-element"],hostVars:4,hostBindings:function(l,a){1&l&&i.bIt("input",function(E){return a.onInput(E)}),2&l&&i.AVh("p-filled",a.filled)("p-variant-filled","filled"===a.variant||"filled"===a.config.inputStyle())},inputs:{variant:"variant"}})}return r})(),g=(()=>{class r{static \u0275fac=function(l){return new(l||r)};static \u0275mod=i.$C({type:r});static \u0275inj=i.G2t({imports:[t.MD]})}return r})()}}]);