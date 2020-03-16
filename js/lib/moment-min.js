(function(f){var t,Ah="2.8.0",A5=typeof global!=="undefined"?global:this,AS,AA=Math.round,AI,Y=0,I=1,Ay=2,X=3,Ae=4,V=5,x=6,AQ={},Ar=[],AR=(typeof module!=="undefined"&&module.exports),E=/^\/?Date\((\-?\d+)/i,A8=/(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,Aj=/^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,AV=/(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g,AH=/(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,J=/\d\d?/,AJ=/\d{1,3}/,g=/\d{1,4}/,BE=/[+\-]?\d{1,6}/,A3=/\d+/,l=/[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,Q=/Z|[\+\-]\d\d:?\d\d/gi,M=/T/i,At=/[\+\-]?\d+(\.\d{1,3})?/,BK=/\d{1,2}/,AG=/\d/,T=/\d\d/,A7=/\d{3}/,As=/\d{4}/,AN=/[+-]?\d{6}/,AE=/[+-]?\d+/,Ap=/^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,y="YYYY-MM-DDTHH:mm:ssZ",A6=[["YYYYYY-MM-DD",/[+-]\d{6}-\d{2}-\d{2}/],["YYYY-MM-DD",/\d{4}-\d{2}-\d{2}/],["GGGG-[W]WW-E",/\d{4}-W\d{2}-\d/],["GGGG-[W]WW",/\d{4}-W\d{2}/],["YYYY-DDD",/\d{4}-\d{3}/]],j=[["HH:mm:ss.SSSS",/(T| )\d\d:\d\d:\d\d\.\d+/],["HH:mm:ss",/(T| )\d\d:\d\d:\d\d/],["HH:mm",/(T| )\d\d:\d\d/],["HH",/(T| )\d\d/]],AF=/([\+\-]|\d\d)/gi,Al="Date|Hours|Minutes|Seconds|Milliseconds".split("|"),e={Milliseconds:1,Seconds:1000,Minutes:60000,Hours:3600000,Days:86400000,Months:2592000000,Years:31536000000},F={ms:"millisecond",s:"second",m:"minute",h:"hour",d:"day",D:"date",w:"week",W:"isoWeek",M:"month",Q:"quarter",y:"year",DDD:"dayOfYear",e:"weekday",E:"isoWeekday",gg:"weekYear",GG:"isoWeekYear"},A2={dayofyear:"dayOfYear",isoweekday:"isoWeekday",isoweek:"isoWeek",weekyear:"weekYear",isoweekyear:"isoWeekYear"},AP={},Z={s:45,m:45,h:22,d:26,M:11},Ax="DDD w W M D d".split(" "),AT="M D H h m s w W".split(" "),Az={M:function(){return this.month()+1
},MMM:function(i){return this.localeData().monthsShort(this,i)
},MMMM:function(i){return this.localeData().months(this,i)
},D:function(){return this.date()
},DDD:function(){return this.dayOfYear()
},d:function(){return this.day()
},dd:function(i){return this.localeData().weekdaysMin(this,i)
},ddd:function(i){return this.localeData().weekdaysShort(this,i)
},dddd:function(i){return this.localeData().weekdays(this,i)
},w:function(){return this.week()
},W:function(){return this.isoWeek()
},YY:function(){return m(this.year()%100,2)
},YYYY:function(){return m(this.year(),4)
},YYYYY:function(){return m(this.year(),5)
},YYYYYY:function(){var BL=this.year(),i=BL>=0?"+":"-";
return i+m(Math.abs(BL),6)
},gg:function(){return m(this.weekYear()%100,2)
},gggg:function(){return m(this.weekYear(),4)
},ggggg:function(){return m(this.weekYear(),5)
},GG:function(){return m(this.isoWeekYear()%100,2)
},GGGG:function(){return m(this.isoWeekYear(),4)
},GGGGG:function(){return m(this.isoWeekYear(),5)
},e:function(){return this.weekday()
},E:function(){return this.isoWeekday()
},a:function(){return this.localeData().meridiem(this.hours(),this.minutes(),true)
},A:function(){return this.localeData().meridiem(this.hours(),this.minutes(),false)
},H:function(){return this.hours()
},h:function(){return this.hours()%12||12
},m:function(){return this.minutes()
},s:function(){return this.seconds()
},S:function(){return o(this.milliseconds()/100)
},SS:function(){return m(o(this.milliseconds()/10),2)
},SSS:function(){return m(this.milliseconds(),3)
},SSSS:function(){return m(this.milliseconds(),3)
},Z:function(){var BL=-this.zone(),i="+";
if(BL<0){BL=-BL;
i="-"
}return i+m(o(BL/60),2)+":"+m(o(BL)%60,2)
},ZZ:function(){var BL=-this.zone(),i="+";
if(BL<0){BL=-BL;
i="-"
}return i+m(o(BL/60),2)+m(o(BL)%60,2)
},z:function(){return this.zoneAbbr()
},zz:function(){return this.zoneName()
},X:function(){return this.unix()
},Q:function(){return this.quarter()
}},A={},z=["months","monthsShort","weekdays","weekdaysShort","weekdaysMin"];
function Au(BL,i,BM){switch(arguments.length){case 2:return BL!=null?BL:i;
case 3:return BL!=null?BL:i!=null?i:BM;
default:throw new Error("Implement me")
}}function AL(){return{empty:false,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:false,invalidMonth:null,invalidFormat:false,userInvalidated:false,iso:false}
}function BJ(i){if(t.suppressDeprecationWarnings===false&&typeof console!=="undefined"&&console.warn){console.warn("Deprecation warning: "+i)
}}function BH(BL,i){var BM=true;
return Af(function(){if(BM){BJ(BL);
BM=false
}return i.apply(this,arguments)
},i)
}function G(i,BL){if(!A[i]){BJ(BL);
A[i]=true
}}function q(BL,i){return function(BM){return m(BL.call(this,BM),i)
}
}function K(i,BL){return function(BM){return this.localeData().ordinal(i.call(this,BM),BL)
}
}while(Ax.length){AI=Ax.pop();
Az[AI+"o"]=K(Az[AI],AI)
}while(AT.length){AI=AT.pop();
Az[AI+AI]=q(Az[AI],2)
}Az.DDDD=q(Az.DDD,3);
function AD(){}function n(BL,i){if(i!==false){BB(BL)
}An(this,BL);
this._d=new Date(+BL._d)
}function AK(BP){var BR=N(BP),BQ=BR.year||0,BL=BR.quarter||0,BM=BR.month||0,i=BR.week||0,BU=BR.day||0,BS=BR.hour||0,BO=BR.minute||0,BT=BR.second||0,BN=BR.millisecond||0;
this._milliseconds=+BN+BT*1000+BO*60000+BS*3600000;
this._days=+BU+i*7;
this._months=+BM+BL*3+BQ*12;
this._data={};
this._locale=t.localeData();
this._bubble()
}function Af(BM,BL){for(var BN in BL){if(BL.hasOwnProperty(BN)){BM[BN]=BL[BN]
}}if(BL.hasOwnProperty("toString")){BM.toString=BL.toString
}if(BL.hasOwnProperty("valueOf")){BM.valueOf=BL.valueOf
}return BM
}function An(BP,BO){var BL,BN,BM;
if(typeof BO._isAMomentObject!=="undefined"){BP._isAMomentObject=BO._isAMomentObject
}if(typeof BO._i!=="undefined"){BP._i=BO._i
}if(typeof BO._f!=="undefined"){BP._f=BO._f
}if(typeof BO._l!=="undefined"){BP._l=BO._l
}if(typeof BO._strict!=="undefined"){BP._strict=BO._strict
}if(typeof BO._tzm!=="undefined"){BP._tzm=BO._tzm
}if(typeof BO._isUTC!=="undefined"){BP._isUTC=BO._isUTC
}if(typeof BO._offset!=="undefined"){BP._offset=BO._offset
}if(typeof BO._pf!=="undefined"){BP._pf=BO._pf
}if(typeof BO._locale!=="undefined"){BP._locale=BO._locale
}if(Ar.length>0){for(BL in Ar){BN=Ar[BL];
BM=BO[BN];
if(typeof BM!=="undefined"){BP[BN]=BM
}}}return BP
}function O(i){if(i<0){return Math.ceil(i)
}else{return Math.floor(i)
}}function m(BO,BN,BM){var BL=""+Math.abs(BO),i=BO>=0;
while(BL.length<BN){BL="0"+BL
}return(i?(BM?"+":""):"-")+BL
}function D(BM,i){var BL={milliseconds:0,months:0};
BL.months=i.month()-BM.month()+(i.year()-BM.year())*12;
if(BM.clone().add(BL.months,"M").isAfter(i)){--BL.months
}BL.milliseconds=+i-+(BM.clone().add(BL.months,"M"));
return BL
}function AB(BM,i){var BL;
i=a(i,BM);
if(BM.isBefore(i)){BL=D(BM,i)
}else{BL=D(i,BM);
BL.milliseconds=-BL.milliseconds;
BL.months=-BL.months
}return BL
}function u(BL,i){return function(BP,BO){var BN,BM;
if(BO!==null&&!isNaN(+BO)){G(i,"moment()."+i+"(period, number) is deprecated. Please use moment()."+i+"(number, period).");
BM=BP;
BP=BO;
BO=BM
}BP=typeof BP==="string"?+BP:BP;
BN=t.duration(BP,BO);
h(this,BN,BL);
return this
}
}function h(BM,BP,BO,BN){var BL=BP._milliseconds,BQ=BP._days,i=BP._months;
BN=BN==null?true:BN;
if(BL){BM._d.setTime(+BM._d+BL*BO)
}if(BQ){Av(BM,"Date",BI(BM,"Date")+BQ*BO)
}if(i){BD(BM,BI(BM,"Month")+i*BO)
}if(BN){t.updateOffset(BM,BQ||i)
}}function B(i){return Object.prototype.toString.call(i)==="[object Array]"
}function H(i){return Object.prototype.toString.call(i)==="[object Date]"||i instanceof Date
}function Aw(BQ,BP,BM){var BL=Math.min(BQ.length,BP.length),BN=Math.abs(BQ.length-BP.length),BR=0,BO;
for(BO=0;
BO<BL;
BO++){if((BM&&BQ[BO]!==BP[BO])||(!BM&&o(BQ[BO])!==o(BP[BO]))){BR++
}}return BR+BN
}function A1(BL){if(BL){var i=BL.toLowerCase().replace(/(.)s$/,"$1");
BL=F[BL]||A2[i]||i
}return BL
}function N(BM){var BL={},i,BN;
for(BN in BM){if(BM.hasOwnProperty(BN)){i=A1(BN);
if(i){BL[i]=BM[BN]
}}}return BL
}function Ab(BL){var i,BM;
if(BL.indexOf("week")===0){i=7;
BM="day"
}else{if(BL.indexOf("month")===0){i=12;
BM="month"
}else{return 
}}t[BL]=function(BR,BO){var BQ,BN,BS=t._locale[BL],BP=[];
if(typeof BR==="number"){BO=BR;
BR=f
}BN=function(BU){var BT=t().utc().set(BM,BU);
return BS.call(t._locale,BT,BR||"")
};
if(BO!=null){return BN(BO)
}else{for(BQ=0;
BQ<i;
BQ++){BP.push(BN(BQ))
}return BP
}}
}function o(i){var BM=+i,BL=0;
if(BM!==0&&isFinite(BM)){if(BM>=0){BL=Math.floor(BM)
}else{BL=Math.ceil(BM)
}}return BL
}function A9(i,BL){return new Date(Date.UTC(i,BL+1,0)).getUTCDate()
}function Ak(i,BM,BL){return d(t([i,11,31+BM-BL]),BM,BL).week
}function A4(i){return Ao(i)?366:365
}function Ao(i){return(i%4===0&&i%100!==0)||i%400===0
}function BB(i){var BL;
if(i._a&&i._pf.overflow===-2){BL=i._a[I]<0||i._a[I]>11?I:i._a[Ay]<1||i._a[Ay]>A9(i._a[Y],i._a[I])?Ay:i._a[X]<0||i._a[X]>23?X:i._a[Ae]<0||i._a[Ae]>59?Ae:i._a[V]<0||i._a[V]>59?V:i._a[x]<0||i._a[x]>999?x:-1;
if(i._pf._overflowDayOfYear&&(BL<Y||BL>Ay)){BL=Ay
}i._pf.overflow=BL
}}function Ag(i){if(i._isValid==null){i._isValid=!isNaN(i._d.getTime())&&i._pf.overflow<0&&!i._pf.empty&&!i._pf.invalidMonth&&!i._pf.nullInput&&!i._pf.invalidFormat&&!i._pf.userInvalidated;
if(i._strict){i._isValid=i._isValid&&i._pf.charsLeftOver===0&&i._pf.unusedTokens.length===0
}}return i._isValid
}function Aq(i){return i?i.toLowerCase().replace("_","-"):i
}function AY(BQ){var BO=0,BM,BP,BL,BN;
while(BO<BQ.length){BN=Aq(BQ[BO]).split("-");
BM=BN.length;
BP=Aq(BQ[BO+1]);
BP=BP?BP.split("-"):null;
while(BM>0){BL=C(BN.slice(0,BM).join("-"));
if(BL){return BL
}if(BP&&BP.length>=BM&&Aw(BN,BP,true)>=BM-1){break
}BM--
}BO++
}return null
}function C(i){var BM=null;
if(!AQ[i]&&AR){try{BM=t.locale();
require("./locale/"+i);
t.locale(BM)
}catch(BL){}}return AQ[i]
}function a(i,BL){return BL._isUTC?t(i).zone(BL._offset||0):t(i).local()
}Af(AD.prototype,{set:function(BL){var BN,BM;
for(BM in BL){BN=BL[BM];
if(typeof BN==="function"){this[BM]=BN
}else{this["_"+BM]=BN
}}},_months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),months:function(i){return this._months[i.month()]
},_monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),monthsShort:function(i){return this._monthsShort[i.month()]
},monthsParse:function(BL){var BM,BO,BN;
if(!this._monthsParse){this._monthsParse=[]
}for(BM=0;
BM<12;
BM++){if(!this._monthsParse[BM]){BO=t.utc([2000,BM]);
BN="^"+this.months(BO,"")+"|^"+this.monthsShort(BO,"");
this._monthsParse[BM]=new RegExp(BN.replace(".",""),"i")
}if(this._monthsParse[BM].test(BL)){return BM
}}},_weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdays:function(i){return this._weekdays[i.day()]
},_weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysShort:function(i){return this._weekdaysShort[i.day()]
},_weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),weekdaysMin:function(i){return this._weekdaysMin[i.day()]
},weekdaysParse:function(BO){var BL,BN,BM;
if(!this._weekdaysParse){this._weekdaysParse=[]
}for(BL=0;
BL<7;
BL++){if(!this._weekdaysParse[BL]){BN=t([2000,1]).day(BL);
BM="^"+this.weekdays(BN,"")+"|^"+this.weekdaysShort(BN,"")+"|^"+this.weekdaysMin(BN,"");
this._weekdaysParse[BL]=new RegExp(BM.replace(".",""),"i")
}if(this._weekdaysParse[BL].test(BO)){return BL
}}},_longDateFormat:{LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY LT",LLLL:"dddd, MMMM D, YYYY LT"},longDateFormat:function(BL){var i=this._longDateFormat[BL];
if(!i&&this._longDateFormat[BL.toUpperCase()]){i=this._longDateFormat[BL.toUpperCase()].replace(/MMMM|MM|DD|dddd/g,function(BM){return BM.slice(1)
});
this._longDateFormat[BL]=i
}return i
},isPM:function(i){return((i+"").toLowerCase().charAt(0)==="p")
},_meridiemParse:/[ap]\.?m?\.?/i,meridiem:function(i,BL,BM){if(i>11){return BM?"pm":"PM"
}else{return BM?"am":"AM"
}},_calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},calendar:function(BL,BM){var i=this._calendar[BL];
return typeof i==="function"?i.apply(BM):i
},_relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},relativeTime:function(BN,BM,BL,BO){var i=this._relativeTime[BL];
return(typeof i==="function")?i(BN,BM,BL,BO):i.replace(/%d/i,BN)
},pastFuture:function(BM,i){var BL=this._relativeTime[BM>0?"future":"past"];
return typeof BL==="function"?BL(i):BL.replace(/%s/i,i)
},ordinal:function(i){return this._ordinal.replace("%d",i)
},_ordinal:"%d",preparse:function(i){return i
},postformat:function(i){return i
},week:function(i){return d(i,this._week.dow,this._week.doy).week
},_week:{dow:0,doy:6},_invalidDate:"Invalid date",invalidDate:function(){return this._invalidDate
}});
function AO(i){if(i.match(/\[[\s\S]/)){return i.replace(/^\[|\]$/g,"")
}return i.replace(/\\/g,"")
}function U(BN){var BO=BN.match(AV),BL,BM;
for(BL=0,BM=BO.length;
BL<BM;
BL++){if(Az[BO[BL]]){BO[BL]=Az[BO[BL]]
}else{BO[BL]=AO(BO[BL])
}}return function(BP){var i="";
for(BL=0;
BL<BM;
BL++){i+=BO[BL] instanceof Function?BO[BL].call(BP,BN):BO[BL]
}return i
}
}function AU(i,BL){if(!i.isValid()){return i.localeData().invalidDate()
}BL=BF(BL,i.localeData());
if(!AP[BL]){AP[BL]=U(BL)
}return AP[BL](i)
}function BF(BO,BL){var BM=5;
function BN(i){return BL.longDateFormat(i)||i
}AH.lastIndex=0;
while(BM>=0&&AH.test(BO)){BO=BO.replace(AH,BN);
AH.lastIndex=0;
BM-=1
}return BO
}function AZ(BN,BM){var BL,i=BM._strict;
switch(BN){case"Q":return AG;
case"DDDD":return A7;
case"YYYY":case"GGGG":case"gggg":return i?As:g;
case"Y":case"G":case"g":return AE;
case"YYYYYY":case"YYYYY":case"GGGGG":case"ggggg":return i?AN:BE;
case"S":if(i){return AG
}case"SS":if(i){return T
}case"SSS":if(i){return A7
}case"DDD":return AJ;
case"MMM":case"MMMM":case"dd":case"ddd":case"dddd":return l;
case"a":case"A":return BM._locale._meridiemParse;
case"X":return At;
case"Z":case"ZZ":return Q;
case"T":return M;
case"SSSS":return A3;
case"MM":case"DD":case"YY":case"GG":case"gg":case"HH":case"hh":case"mm":case"ss":case"ww":case"WW":return i?T:J;
case"M":case"D":case"d":case"H":case"h":case"m":case"s":case"w":case"W":case"e":case"E":return J;
case"Do":return BK;
default:BL=new RegExp(BC(Ad(BN.replace("\\","")),"i"));
return BL
}}function b(BL){BL=BL||"";
var i=(BL.match(Q)||[]),BO=i[i.length-1]||[],BN=(BO+"").match(AF)||["-",0,0],BM=+(BN[1]*60)+o(BN[2]);
return BN[0]==="+"?-BM:BM
}function Ac(BO,BM,BN){var BL,i=BN._a;
switch(BO){case"Q":if(BM!=null){i[I]=(o(BM)-1)*3
}break;
case"M":case"MM":if(BM!=null){i[I]=o(BM)-1
}break;
case"MMM":case"MMMM":BL=BN._locale.monthsParse(BM);
if(BL!=null){i[I]=BL
}else{BN._pf.invalidMonth=BM
}break;
case"D":case"DD":if(BM!=null){i[Ay]=o(BM)
}break;
case"Do":if(BM!=null){i[Ay]=o(parseInt(BM,10))
}break;
case"DDD":case"DDDD":if(BM!=null){BN._dayOfYear=o(BM)
}break;
case"YY":i[Y]=t.parseTwoDigitYear(BM);
break;
case"YYYY":case"YYYYY":case"YYYYYY":i[Y]=o(BM);
break;
case"a":case"A":BN._isPm=BN._locale.isPM(BM);
break;
case"H":case"HH":case"h":case"hh":i[X]=o(BM);
break;
case"m":case"mm":i[Ae]=o(BM);
break;
case"s":case"ss":i[V]=o(BM);
break;
case"S":case"SS":case"SSS":case"SSSS":i[x]=o(("0."+BM)*1000);
break;
case"X":BN._d=new Date(parseFloat(BM)*1000);
break;
case"Z":case"ZZ":BN._useUTC=true;
BN._tzm=b(BM);
break;
case"dd":case"ddd":case"dddd":BL=BN._locale.weekdaysParse(BM);
if(BL!=null){BN._w=BN._w||{};
BN._w.d=BL
}else{BN._pf.invalidWeekday=BM
}break;
case"w":case"ww":case"W":case"WW":case"d":case"e":case"E":BO=BO.substr(0,1);
case"gggg":case"GGGG":case"GGGGG":BO=BO.substr(0,2);
if(BM){BN._w=BN._w||{};
BN._w[BO]=o(BM)
}break;
case"gg":case"GG":BN._w=BN._w||{};
BN._w[BO]=t.parseTwoDigitYear(BM)
}}function v(BM){var i,BO,BN,BP,BR,BQ,BL;
i=BM._w;
if(i.GG!=null||i.W!=null||i.E!=null){BR=1;
BQ=4;
BO=Au(i.GG,BM._a[Y],d(t(),1,4).year);
BN=Au(i.W,1);
BP=Au(i.E,1)
}else{BR=BM._locale._week.dow;
BQ=BM._locale._week.doy;
BO=Au(i.gg,BM._a[Y],d(t(),BR,BQ).year);
BN=Au(i.w,1);
if(i.d!=null){BP=i.d;
if(BP<BR){++BN
}}else{if(i.e!=null){BP=i.e+BR
}else{BP=BR
}}}BL=W(BO,BN,BP,BQ,BR);
BM._a[Y]=BL.year;
BM._dayOfYear=BL.dayOfYear
}function AM(BP){var BQ,BO,BN=[],BM,BL;
if(BP._d){return 
}BM=P(BP);
if(BP._w&&BP._a[Ay]==null&&BP._a[I]==null){v(BP)
}if(BP._dayOfYear){BL=Au(BP._a[Y],BM[Y]);
if(BP._dayOfYear>A4(BL)){BP._pf._overflowDayOfYear=true
}BO=k(BL,0,BP._dayOfYear);
BP._a[I]=BO.getUTCMonth();
BP._a[Ay]=BO.getUTCDate()
}for(BQ=0;
BQ<3&&BP._a[BQ]==null;
++BQ){BP._a[BQ]=BN[BQ]=BM[BQ]
}for(;
BQ<7;
BQ++){BP._a[BQ]=BN[BQ]=(BP._a[BQ]==null)?(BQ===2?1:0):BP._a[BQ]
}BP._d=(BP._useUTC?k:AW).apply(null,BN);
if(BP._tzm!=null){BP._d.setUTCMinutes(BP._d.getUTCMinutes()+BP._tzm)
}}function Ai(BL){var i;
if(BL._d){return 
}i=N(BL._i);
BL._a=[i.year,i.month,i.day,i.hour,i.minute,i.second,i.millisecond];
AM(BL)
}function P(BL){var i=new Date();
if(BL._useUTC){return[i.getUTCFullYear(),i.getUTCMonth(),i.getUTCDate()]
}else{return[i.getFullYear(),i.getMonth(),i.getDate()]
}}function s(BN){if(BN._f===t.ISO_8601){AX(BN);
return 
}BN._a=[];
BN._pf.empty=true;
var BQ=""+BN._i,BP,BM,BT,BO,BS,BL=BQ.length,BR=0;
BT=BF(BN._f,BN._locale).match(AV)||[];
for(BP=0;
BP<BT.length;
BP++){BO=BT[BP];
BM=(BQ.match(AZ(BO,BN))||[])[0];
if(BM){BS=BQ.substr(0,BQ.indexOf(BM));
if(BS.length>0){BN._pf.unusedInput.push(BS)
}BQ=BQ.slice(BQ.indexOf(BM)+BM.length);
BR+=BM.length
}if(Az[BO]){if(BM){BN._pf.empty=false
}else{BN._pf.unusedTokens.push(BO)
}Ac(BO,BM,BN)
}else{if(BN._strict&&!BM){BN._pf.unusedTokens.push(BO)
}}}BN._pf.charsLeftOver=BL-BR;
if(BQ.length>0){BN._pf.unusedInput.push(BQ)
}if(BN._isPm&&BN._a[X]<12){BN._a[X]+=12
}if(BN._isPm===false&&BN._a[X]===12){BN._a[X]=0
}AM(BN);
BB(BN)
}function Ad(i){return i.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,function(BL,BP,BO,BN,BM){return BP||BO||BN||BM
})
}function BC(i){return i.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")
}function A0(BL){var BP,BN,BO,BM,BQ;
if(BL._f.length===0){BL._pf.invalidFormat=true;
BL._d=new Date(NaN);
return 
}for(BM=0;
BM<BL._f.length;
BM++){BQ=0;
BP=An({},BL);
BP._pf=AL();
BP._f=BL._f[BM];
s(BP);
if(!Ag(BP)){continue
}BQ+=BP._pf.charsLeftOver;
BQ+=BP._pf.unusedTokens.length*10;
BP._pf.score=BQ;
if(BO==null||BQ<BO){BO=BQ;
BN=BP
}}Af(BL,BN||BP)
}function AX(BO){var BP,BL,BN=BO._i,BM=Ap.exec(BN);
if(BM){BO._pf.iso=true;
for(BP=0,BL=A6.length;
BP<BL;
BP++){if(A6[BP][1].exec(BN)){BO._f=A6[BP][0]+(BM[6]||" ");
break
}}for(BP=0,BL=j.length;
BP<BL;
BP++){if(j[BP][1].exec(BN)){BO._f+=j[BP][0];
break
}}if(BN.match(Q)){BO._f+="Z"
}s(BO)
}else{BO._isValid=false
}}function L(i){AX(i);
if(i._isValid===false){delete i._isValid;
t.createFromInputFallback(i)
}}function r(BM){var BL=BM._i,i;
if(BL===f){BM._d=new Date()
}else{if(H(BL)){BM._d=new Date(+BL)
}else{if((i=E.exec(BL))!==null){BM._d=new Date(+i[1])
}else{if(typeof BL==="string"){L(BM)
}else{if(B(BL)){BM._a=BL.slice(0);
AM(BM)
}else{if(typeof (BL)==="object"){Ai(BM)
}else{if(typeof (BL)==="number"){BM._d=new Date(BL)
}else{t.createFromInputFallback(BM)
}}}}}}}}function AW(BR,i,BP,BO,BQ,BN,BM){var BL=new Date(BR,i,BP,BO,BQ,BN,BM);
if(BR<1970){BL.setFullYear(BR)
}return BL
}function k(BL){var i=new Date(Date.UTC.apply(null,arguments));
if(BL<1970){i.setUTCFullYear(BL)
}return i
}function BA(BL,i){if(typeof BL==="string"){if(!isNaN(BL)){BL=parseInt(BL,10)
}else{BL=i.weekdaysParse(BL);
if(typeof BL!=="number"){return null
}}}return BL
}function Am(BL,BN,BM,BO,i){return i.relativeTime(BN||1,!!BM,BL,BO)
}function c(BO,BL,BS){var BM=t.duration(BO).abs(),BT=AA(BM.as("s")),BN=AA(BM.as("m")),BR=AA(BM.as("h")),BU=AA(BM.as("d")),i=AA(BM.as("M")),BP=AA(BM.as("y")),BQ=BT<Z.s&&["s",BT]||BN===1&&["m"]||BN<Z.m&&["mm",BN]||BR===1&&["h"]||BR<Z.h&&["hh",BR]||BU===1&&["d"]||BU<Z.d&&["dd",BU]||i===1&&["M"]||i<Z.M&&["MM",i]||BP===1&&["y"]||["yy",BP];
BQ[2]=BL;
BQ[3]=+BO>0;
BQ[4]=BS;
return Am.apply({},BQ)
}function d(BO,BM,BP){var BL=BP-BM,i=BP-BO.day(),BN;
if(i>BL){i-=7
}if(i<BL-7){i+=7
}BN=t(BO).add(i,"d");
return{week:Math.ceil(BN.dayOfYear()/7),year:BN.year()}
}function W(BO,BN,BP,BR,i){var BQ=k(BO,0,1).getUTCDay(),BM,BL;
BQ=BQ===0?7:BQ;
BP=BP!=null?BP:i;
BM=i-BQ+(BQ>BR?7:0)-(BQ<i?7:0);
BL=7*(BN-1)+(BP-i)+BM+1;
return{year:BL>0?BO:BO-1,dayOfYear:BL>0?BL:A4(BO-1)+BL}
}function p(BL){var i=BL._i,BM=BL._f;
BL._locale=BL._locale||t.localeData(BL._l);
if(i===null||(BM===f&&i==="")){return t.invalid({nullInput:true})
}if(typeof i==="string"){BL._i=i=BL._locale.preparse(i)
}if(t.isMoment(i)){return new n(i,true)
}else{if(BM){if(B(BM)){A0(BL)
}else{s(BL)
}}else{r(BL)
}}return new n(BL)
}t=function(BM,BN,i,BL){var BO;
if(typeof (i)==="boolean"){BL=i;
i=f
}BO={};
BO._isAMomentObject=true;
BO._i=BM;
BO._f=BN;
BO._l=i;
BO._strict=BL;
BO._isUTC=false;
BO._pf=AL();
return p(BO)
};
t.suppressDeprecationWarnings=false;
t.createFromInputFallback=BH("moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/moment/moment/issues/1407 for more info.",function(i){i._d=new Date(i._i)
});
function Aa(BN,BO){var BM,BL;
if(BO.length===1&&B(BO[0])){BO=BO[0]
}if(!BO.length){return t()
}BM=BO[0];
for(BL=1;
BL<BO.length;
++BL){if(BO[BL][BN](BM)){BM=BO[BL]
}}return BM
}t.min=function(){var i=[].slice.call(arguments,0);
return Aa("isBefore",i)
};
t.max=function(){var i=[].slice.call(arguments,0);
return Aa("isAfter",i)
};
t.utc=function(BM,BN,i,BL){var BO;
if(typeof (i)==="boolean"){BL=i;
i=f
}BO={};
BO._isAMomentObject=true;
BO._useUTC=true;
BO._isUTC=true;
BO._l=i;
BO._i=BM;
BO._f=BN;
BO._strict=BL;
BO._pf=AL();
return p(BO).utc()
};
t.unix=function(i){return t(i*1000)
};
t.duration=function(BM,BQ){var BR=BM,BP=null,BL,BO,BN,i;
if(t.isDuration(BM)){BR={ms:BM._milliseconds,d:BM._days,M:BM._months}
}else{if(typeof BM==="number"){BR={};
if(BQ){BR[BQ]=BM
}else{BR.milliseconds=BM
}}else{if(!!(BP=A8.exec(BM))){BL=(BP[1]==="-")?-1:1;
BR={y:0,d:o(BP[Ay])*BL,h:o(BP[X])*BL,m:o(BP[Ae])*BL,s:o(BP[V])*BL,ms:o(BP[x])*BL}
}else{if(!!(BP=Aj.exec(BM))){BL=(BP[1]==="-")?-1:1;
BN=function(BT){var BS=BT&&parseFloat(BT.replace(",","."));
return(isNaN(BS)?0:BS)*BL
};
BR={y:BN(BP[2]),M:BN(BP[3]),d:BN(BP[4]),h:BN(BP[5]),m:BN(BP[6]),s:BN(BP[7]),w:BN(BP[8])}
}else{if(typeof BR==="object"&&("from" in BR||"to" in BR)){i=AB(t(BR.from),t(BR.to));
BR={};
BR.ms=i.milliseconds;
BR.M=i.months
}}}}}BO=new AK(BR);
if(t.isDuration(BM)&&BM.hasOwnProperty("_locale")){BO._locale=BM._locale
}return BO
};
t.version=Ah;
t.defaultFormat=y;
t.ISO_8601=function(){};
t.momentProperties=Ar;
t.updateOffset=function(){};
t.relativeTimeThreshold=function(i,BL){if(Z[i]===f){return false
}if(BL===f){return Z[i]
}Z[i]=BL;
return true
};
t.lang=BH("moment.lang is deprecated. Use moment.locale instead.",function(i,BL){return t.locale(i,BL)
});
t.locale=function(BL,i){var BM;
if(BL){if(typeof (i)!=="undefined"){BM=t.defineLocale(BL,i)
}else{BM=t.localeData(BL)
}if(BM){t.duration._locale=t._locale=BM
}}return t._locale._abbr
};
t.defineLocale=function(BL,i){if(i!==null){i.abbr=BL;
if(!AQ[BL]){AQ[BL]=new AD()
}AQ[BL].set(i);
t.locale(BL);
return AQ[BL]
}else{delete AQ[BL];
return null
}};
t.langData=BH("moment.langData is deprecated. Use moment.localeData instead.",function(i){return t.localeData(i)
});
t.localeData=function(BL){var i;
if(BL&&BL._locale&&BL._locale._abbr){BL=BL._locale._abbr
}if(!BL){return t._locale
}if(!B(BL)){i=C(BL);
if(i){return i
}BL=[BL]
}return AY(BL)
};
t.isMoment=function(i){return i instanceof n||(i!=null&&i.hasOwnProperty("_isAMomentObject"))
};
t.isDuration=function(i){return i instanceof AK
};
for(AI=z.length-1;
AI>=0;
--AI){Ab(z[AI])
}t.normalizeUnits=function(i){return A1(i)
};
t.invalid=function(BL){var i=t.utc(NaN);
if(BL!=null){Af(i._pf,BL)
}else{i._pf.userInvalidated=true
}return i
};
t.parseZone=function(){return t.apply(null,arguments).parseZone()
};
t.parseTwoDigitYear=function(i){return o(i)+(o(i)>68?1900:2000)
};
Af(t.fn=n.prototype,{clone:function(){return t(this)
},valueOf:function(){return +this._d+((this._offset||0)*60000)
},unix:function(){return Math.floor(+this/1000)
},toString:function(){return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
},toDate:function(){return this._offset?new Date(+this):this._d
},toISOString:function(){var i=t(this).utc();
if(0<i.year()&&i.year()<=9999){return AU(i,"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
}else{return AU(i,"YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
}},toArray:function(){var i=this;
return[i.year(),i.month(),i.date(),i.hours(),i.minutes(),i.seconds(),i.milliseconds()]
},isValid:function(){return Ag(this)
},isDSTShifted:function(){if(this._a){return this.isValid()&&Aw(this._a,(this._isUTC?t.utc(this._a):t(this._a)).toArray())>0
}return false
},parsingFlags:function(){return Af({},this._pf)
},invalidAt:function(){return this._pf.overflow
},utc:function(i){return this.zone(0,i)
},local:function(i){if(this._isUTC){this.zone(0,i);
this._isUTC=false;
if(i){this.add(this._d.getTimezoneOffset(),"m")
}}return this
},format:function(BL){var i=AU(this,BL||t.defaultFormat);
return this.localeData().postformat(i)
},add:u(1,"add"),subtract:u(-1,"subtract"),diff:function(BO,BN,i){var BP=a(BO,this),BL=(this.zone()-BP.zone())*60000,BQ,BM;
BN=A1(BN);
if(BN==="year"||BN==="month"){BQ=(this.daysInMonth()+BP.daysInMonth())*43200000;
BM=((this.year()-BP.year())*12)+(this.month()-BP.month());
BM+=((this-t(this).startOf("month"))-(BP-t(BP).startOf("month")))/BQ;
BM-=((this.zone()-t(this).startOf("month").zone())-(BP.zone()-t(BP).startOf("month").zone()))*60000/BQ;
if(BN==="year"){BM=BM/12
}}else{BQ=(this-BP);
BM=BN==="second"?BQ/1000:BN==="minute"?BQ/60000:BN==="hour"?BQ/3600000:BN==="day"?(BQ-BL)/86400000:BN==="week"?(BQ-BL)/604800000:BQ
}return i?BM:O(BM)
},from:function(BL,i){return t.duration({to:this,from:BL}).locale(this.locale()).humanize(!i)
},fromNow:function(i){return this.from(t(),i)
},calendar:function(BO){var BL=BO||t(),i=a(BL,this).startOf("day"),BN=this.diff(i,"days",true),BM=BN<-6?"sameElse":BN<-1?"lastWeek":BN<0?"lastDay":BN<1?"sameDay":BN<2?"nextDay":BN<7?"nextWeek":"sameElse";
return this.format(this.localeData().calendar(BM,this))
},isLeapYear:function(){return Ao(this.year())
},isDST:function(){return(this.zone()<this.clone().month(0).zone()||this.zone()<this.clone().month(5).zone())
},day:function(BL){var i=this._isUTC?this._d.getUTCDay():this._d.getDay();
if(BL!=null){BL=BA(BL,this.localeData());
return this.add(BL-i,"d")
}else{return i
}},month:S("Month",true),startOf:function(i){i=A1(i);
switch(i){case"year":this.month(0);
case"quarter":case"month":this.date(1);
case"week":case"isoWeek":case"day":this.hours(0);
case"hour":this.minutes(0);
case"minute":this.seconds(0);
case"second":this.milliseconds(0)
}if(i==="week"){this.weekday(0)
}else{if(i==="isoWeek"){this.isoWeekday(1)
}}if(i==="quarter"){this.month(Math.floor(this.month()/3)*3)
}return this
},endOf:function(i){i=A1(i);
return this.startOf(i).add(1,(i==="isoWeek"?"week":i)).subtract(1,"ms")
},isAfter:function(BL,i){i=typeof i!=="undefined"?i:"millisecond";
return +this.clone().startOf(i)>+t(BL).startOf(i)
},isBefore:function(BL,i){i=typeof i!=="undefined"?i:"millisecond";
return +this.clone().startOf(i)<+t(BL).startOf(i)
},isSame:function(BL,i){i=i||"ms";
return +this.clone().startOf(i)===+a(BL,this).startOf(i)
},min:BH("moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548",function(i){i=t.apply(null,arguments);
return i<this?this:i
}),max:BH("moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548",function(i){i=t.apply(null,arguments);
return i>this?this:i
}),zone:function(i,BN){var BM=this._offset||0,BL;
if(i!=null){if(typeof i==="string"){i=b(i)
}if(Math.abs(i)<16){i=i*60
}if(!this._isUTC&&BN){BL=this._d.getTimezoneOffset()
}this._offset=i;
this._isUTC=true;
if(BL!=null){this.subtract(BL,"m")
}if(BM!==i){if(!BN||this._changeInProgress){h(this,t.duration(BM-i,"m"),1,false)
}else{if(!this._changeInProgress){this._changeInProgress=true;
t.updateOffset(this,true);
this._changeInProgress=null
}}}}else{return this._isUTC?BM:this._d.getTimezoneOffset()
}return this
},zoneAbbr:function(){return this._isUTC?"UTC":""
},zoneName:function(){return this._isUTC?"Coordinated Universal Time":""
},parseZone:function(){if(this._tzm){this.zone(this._tzm)
}else{if(typeof this._i==="string"){this.zone(this._i)
}}return this
},hasAlignedHourOffset:function(i){if(!i){i=0
}else{i=t(i).zone()
}return(this.zone()-i)%60===0
},daysInMonth:function(){return A9(this.year(),this.month())
},dayOfYear:function(i){var BL=AA((t(this).startOf("day")-t(this).startOf("year"))/86400000)+1;
return i==null?BL:this.add((i-BL),"d")
},quarter:function(i){return i==null?Math.ceil((this.month()+1)/3):this.month((i-1)*3+this.month()%3)
},weekYear:function(i){var BL=d(this,this.localeData()._week.dow,this.localeData()._week.doy).year;
return i==null?BL:this.add((i-BL),"y")
},isoWeekYear:function(i){var BL=d(this,1,4).year;
return i==null?BL:this.add((i-BL),"y")
},week:function(i){var BL=this.localeData().week(this);
return i==null?BL:this.add((i-BL)*7,"d")
},isoWeek:function(i){var BL=d(this,1,4).week;
return i==null?BL:this.add((i-BL)*7,"d")
},weekday:function(i){var BL=(this.day()+7-this.localeData()._week.dow)%7;
return i==null?BL:this.add(i-BL,"d")
},isoWeekday:function(i){return i==null?this.day()||7:this.day(this.day()%7?i:i-7)
},isoWeeksInYear:function(){return Ak(this.year(),1,4)
},weeksInYear:function(){var i=this.localeData()._week;
return Ak(this.year(),i.dow,i.doy)
},get:function(i){i=A1(i);
return this[i]()
},set:function(i,BL){i=A1(i);
if(typeof this[i]==="function"){this[i](BL)
}return this
},locale:function(i){if(i===f){return this._locale._abbr
}else{this._locale=t.localeData(i);
return this
}},lang:BH("moment().lang() is deprecated. Use moment().localeData() instead.",function(i){return this.localeData(i)
}),localeData:function(){return this._locale
}});
function BD(i,BL){var BM;
if(typeof BL==="string"){BL=i.localeData().monthsParse(BL);
if(typeof BL!=="number"){return i
}}BM=Math.min(i.date(),A9(i.year(),BL));
i._d["set"+(i._isUTC?"UTC":"")+"Month"](BL,BM);
return i
}function BI(BL,i){return BL._d["get"+(BL._isUTC?"UTC":"")+i]()
}function Av(BL,i,BM){if(i==="Month"){return BD(BL,BM)
}else{return BL._d["set"+(BL._isUTC?"UTC":"")+i](BM)
}}function S(i,BL){return function(BM){if(BM!=null){Av(this,i,BM);
t.updateOffset(this,BL);
return this
}else{return BI(this,i)
}}
}t.fn.millisecond=t.fn.milliseconds=S("Milliseconds",false);
t.fn.second=t.fn.seconds=S("Seconds",false);
t.fn.minute=t.fn.minutes=S("Minutes",false);
t.fn.hour=t.fn.hours=S("Hours",true);
t.fn.date=S("Date",true);
t.fn.dates=BH("dates accessor is deprecated. Use date instead.",S("Date",true));
t.fn.year=S("FullYear",true);
t.fn.years=BH("years accessor is deprecated. Use year instead.",S("FullYear",true));
t.fn.days=t.fn.day;
t.fn.months=t.fn.month;
t.fn.weeks=t.fn.week;
t.fn.isoWeeks=t.fn.isoWeek;
t.fn.quarters=t.fn.quarter;
t.fn.toJSON=t.fn.toISOString;
function R(i){return i*400/146097
}function BG(i){return i*146097/400
}Af(t.duration.fn=AK.prototype,{_bubble:function(){var BM=this._milliseconds,BR=this._days,i=this._months,BP=this._data,BQ,BO,BL,BN=0;
BP.milliseconds=BM%1000;
BQ=O(BM/1000);
BP.seconds=BQ%60;
BO=O(BQ/60);
BP.minutes=BO%60;
BL=O(BO/60);
BP.hours=BL%24;
BR+=O(BL/24);
BN=O(R(BR));
BR-=O(BG(BN));
i+=O(BR/30);
BR%=30;
BN+=O(i/12);
i%=12;
BP.days=BR;
BP.months=i;
BP.years=BN
},abs:function(){this._milliseconds=Math.abs(this._milliseconds);
this._days=Math.abs(this._days);
this._months=Math.abs(this._months);
this._data.milliseconds=Math.abs(this._data.milliseconds);
this._data.seconds=Math.abs(this._data.seconds);
this._data.minutes=Math.abs(this._data.minutes);
this._data.hours=Math.abs(this._data.hours);
this._data.months=Math.abs(this._data.months);
this._data.years=Math.abs(this._data.years);
return this
},weeks:function(){return O(this.days()/7)
},valueOf:function(){return this._milliseconds+this._days*86400000+(this._months%12)*2592000000+o(this._months/12)*31536000000
},humanize:function(BL){var i=c(this,!BL,this.localeData());
if(BL){i=this.localeData().pastFuture(+this,i)
}return this.localeData().postformat(i)
},add:function(i,BM){var BL=t.duration(i,BM);
this._milliseconds+=BL._milliseconds;
this._days+=BL._days;
this._months+=BL._months;
this._bubble();
return this
},subtract:function(i,BM){var BL=t.duration(i,BM);
this._milliseconds-=BL._milliseconds;
this._days-=BL._days;
this._months-=BL._months;
this._bubble();
return this
},get:function(i){i=A1(i);
return this[i.toLowerCase()+"s"]()
},as:function(BL){var BM,i;
BL=A1(BL);
BM=this._days+this._milliseconds/86400000;
if(BL==="month"||BL==="year"){i=this._months+R(BM)*12;
return BL==="month"?i:i/12
}else{BM+=BG(this._months/12);
switch(BL){case"week":return BM/7;
case"day":return BM;
case"hour":return BM*24;
case"minute":return BM*24*60;
case"second":return BM*24*60*60;
case"millisecond":return BM*24*60*60*1000;
default:throw new Error("Unknown unit "+BL)
}}},lang:t.fn.lang,locale:t.fn.locale,toIsoString:BH("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",function(){return this.toISOString()
}),toISOString:function(){var BN=Math.abs(this.years()),i=Math.abs(this.months()),BP=Math.abs(this.days()),BL=Math.abs(this.hours()),BM=Math.abs(this.minutes()),BO=Math.abs(this.seconds()+this.milliseconds()/1000);
if(!this.asSeconds()){return"P0D"
}return(this.asSeconds()<0?"-":"")+"P"+(BN?BN+"Y":"")+(i?i+"M":"")+(BP?BP+"D":"")+((BL||BM||BO)?"T":"")+(BL?BL+"H":"")+(BM?BM+"M":"")+(BO?BO+"S":"")
},localeData:function(){return this._locale
}});
function AC(i){t.duration.fn[i]=function(){return this._data[i]
}
}for(AI in e){if(e.hasOwnProperty(AI)){AC(AI.toLowerCase())
}}t.duration.fn.asMilliseconds=function(){return this.as("ms")
};
t.duration.fn.asSeconds=function(){return this.as("s")
};
t.duration.fn.asMinutes=function(){return this.as("m")
};
t.duration.fn.asHours=function(){return this.as("h")
};
t.duration.fn.asDays=function(){return this.as("d")
};
t.duration.fn.asWeeks=function(){return this.as("weeks")
};
t.duration.fn.asMonths=function(){return this.as("M")
};
t.duration.fn.asYears=function(){return this.as("y")
};
t.locale("en",{ordinal:function(BM){var i=BM%10,BL=(o(BM%100/10)===1)?"th":(i===1)?"st":(i===2)?"nd":(i===3)?"rd":"th";
return BM+BL
}});
function w(i){if(typeof ender!=="undefined"){return 
}AS=A5.moment;
if(i){A5.moment=BH("Accessing Moment through the global scope is deprecated, and will be removed in an upcoming release.",t)
}else{A5.moment=t
}}if(AR){module.exports=t
}else{if(typeof define==="function"&&define.amd){define("moment",function(BL,i,BM){if(BM.config&&BM.config()&&BM.config().noGlobal===true){A5.moment=AS
}return t
});
w(true)
}else{w()
}}}).call(this);