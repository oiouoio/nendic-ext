if(!window.J)window.J={_libraries:{},_modules:{},_rLibraryVar:/^\$[\w_]+$/,_rModuleVar:/^__[\w_]+$/,_rModuleName:/^([a-z]+)\.([a-z]+)$/i,library:function(a,b){this._libraries[a]=b},namespace:function(a){this._modules[a]={name:a}},module:function(a,b){var c=this.parseFullName(a),d=c.namespaceName,c=c.moduleName;"undefined"===typeof this._modules[d]&&this.namespace(d);b.fullName=a;b.name=c;this._modules[d][c]=b},parseFullName:function(a){var b=this._rModuleName.exec(a);if(!b)throw'Module name "'+a+
'" is not valid. The module name must be like "namespaceName.moduleName" pattern.';return{namespaceName:b[1],moduleName:b[2]}},init:function(){this._libraries.core=this;this.injectDependencyLibraryToLibarary();this.injectDependencyLibraryToModule();this.injectDependencyModuleToModule()},injectDependencyLibraryToLibarary:function(){var a=this;a.eachLibrary(function(b,c){a.injectLibraryDependency(c)})},injectDependencyLibraryToModule:function(){var a=this;a.eachModule(function(b,c){a.injectLibraryDependency(c)})},
injectDependencyModuleToModule:function(){var a=this;a.eachNamespace(function(b,c){a.eachProperty(c,function(c,e){a.eachProperty(e,function(c){var d=c.substring(2);this[c]=a._modules[b][d]},function(b){return a._rModuleVar.test(b)})},function(a){return"name"!==a})})},injectLibraryDependency:function(a){var b=this;b.eachProperty(a,function(a){var d=a.substring(1);this[a]=b._libraries[d]},function(a){return b._rLibraryVar.test(a)})},eachLibrary:function(a){this.eachProperty(this._libraries,a)},eachNamespace:function(a){this.eachProperty(this._modules,
a)},eachModule:function(a){var b=this;this.eachNamespace(function(c,d){b.eachProperty(d,a,function(a,b){return"name"!==a&&"object"===typeof b})})},eachProperty:function(a,b,c){var d,e,c=c||function(){return!0};for(d in a)a.hasOwnProperty(d)&&c(d,a[d])&&(e=a[d],b.call(a,d,e))},startAll:function(){this.eachModule(function(a,b){"function"===typeof b.init&&b.init()})},start:function(a){a=this.parseFullName(a);module=this._modules[a.namespaceName][a.moduleName];"function"===typeof module.init&&module.init()},
stopAll:function(){this.eachModule(function(a,b){"function"===typeof b.destroy&&b.destroy()})},stop:function(a){a=this.parseFullName(a);module=this._modules[a.namespaceName][a.moduleName];"function"===typeof module.destroy&&module.destroy()}};J.library("util",{guid:function(){return"j"+(1073741824*Math.random()).toString(32).replace(".","")}});J.library("ps",{$core:null,$util:null,_subscribersMap:{},subscribe:function(a,b){var c=this.$util.guid();this.eachSubscriberMapDepth(a,function(a,e,f,h){h&&(e[c]=b)});return c},eachSubscriberMapDepth:function(a,b){for(var c=this._subscribersMap,d=a.split("."),e=d.length,f,h,g=0;g<e;g++)f=d[g],h=c[f]=c[f]||{},b(f,h,c,g+1===e),c=h},unsubscribe:function(a,b){this.eachSubscriberMapDepth(a,function(a,d,e,f){f&&delete d[b]})},publish:function(a,b){var c=this,d=function(d){c.$core.eachProperty(d,function(c,
d){"function"===typeof d&&d(b,a)})};this.eachSubscriberMapDepth(a,function(a,b,c,g){d(c["*"]);g&&d(b)})},clear:function(a){this.eachSubscriberMapDepth(a,function(a,c,d,e){e&&delete map[a]})}});J.library("pointcut",{_exprs:{},_rExpr:/^(?:([\w\*]+)\.)?([\w\*]+)\(\)$/,MSG:{INVALID_EXPR:"J.pointcut: invalid expression",ID_REQUIRED:"J.pointcut: id required"},add:function(a,b){if(!a)throw this.MSG.ID_REQUIRED;var c=this._rExpr.exec(b);if(!c)throw this.MSG.INVALID_EXPR;this._exprs[a]={module:c[1]||"*",method:c[2]}},match:function(a,b,c){return(a=this._exprs[a])&&this.matchName(a.module,b)&&this.matchName(a.method,c)?!0:!1},matchName:function(a,b){if("*"===a)return!0;var c="^"+a.replace(/\*/g,
"\\w*")+"$";return RegExp(c).test(b)}});J.library("advice",{_advices:{},msg:{ADVICE_SHOULD_BE_FUNCTION:"J.advice: advice should be function"},add:function(a,b){if("function"!==typeof b)throw this.msg.ADVICE_SHOULD_BE_FUNCTION;this._advices[a]=b},set:function(a,b,c){var d=this._advices[a],e=this.bind(b[c],b);b[c]=function(){var a=Array.prototype.slice.call(arguments);a.splice(0,0,e);return d.apply(b,a.concat())}},bind:function(a,b,c){var d=Array.prototype.slice,e=d.call(arguments,2);return function(){return a.apply(b,e.concat(d.call(arguments)))}}});J.library("aop",{$core:null,$advice:null,$pointcut:null,set:function(a,b){var c=this.$core.guid();this.addAdvisor(c,a,b);this.applyAdvisorToModules(c)},addAdvisor:function(a,b,c){this.$pointcut.add(a,b);this.$advice.add(a,c)},applyAdvisorToModules:function(a){var b=this;this.$core.eachModule(function(c,d){b.$core.eachProperty(d,function(c){b.$advice.set(a,d,c)},function(d,f){return"function"===typeof f&&b.$pointcut.match(a,c,d)})})}});