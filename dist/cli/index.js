/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 171:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var Module=void 0!==Module?Module:{},TreeSitter=function(){var initPromise,document="object"==typeof window?{currentScript:window.document.currentScript}:null;class Parser{constructor(){this.initialize()}initialize(){throw new Error("cannot construct a Parser before calling `init()`")}static init(moduleOptions){return initPromise||(Module=Object.assign({},Module,moduleOptions),initPromise=new Promise((resolveInitPromise=>{var moduleOverrides=Object.assign({},Module),arguments_=[],thisProgram="./this.program",quit_=(e,t)=>{throw t},ENVIRONMENT_IS_WEB="object"==typeof window,ENVIRONMENT_IS_WORKER="function"==typeof importScripts,ENVIRONMENT_IS_NODE="object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node,scriptDirectory="",read_,readAsync,readBinary,setWindowTitle;function locateFile(e){return Module.locateFile?Module.locateFile(e,scriptDirectory):scriptDirectory+e}function logExceptionOnExit(e){if(e instanceof ExitStatus)return;err("exiting due to exception: "+e)}if(ENVIRONMENT_IS_NODE){var fs=__nccwpck_require__(896),nodePath=__nccwpck_require__(928);scriptDirectory=ENVIRONMENT_IS_WORKER?nodePath.dirname(scriptDirectory)+"/":__dirname+"/",read_=(e,t)=>(e=isFileURI(e)?new URL(e):nodePath.normalize(e),fs.readFileSync(e,t?void 0:"utf8")),readBinary=e=>{var t=read_(e,!0);return t.buffer||(t=new Uint8Array(t)),t},readAsync=(e,t,r)=>{e=isFileURI(e)?new URL(e):nodePath.normalize(e),fs.readFile(e,(function(e,_){e?r(e):t(_.buffer)}))},process.argv.length>1&&(thisProgram=process.argv[1].replace(/\\/g,"/")),arguments_=process.argv.slice(2), true&&(module.exports=Module),quit_=(e,t)=>{if(keepRuntimeAlive())throw process.exitCode=e,t;logExceptionOnExit(t),process.exit(e)},Module.inspect=function(){return"[Emscripten Module object]"}}else(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)&&(ENVIRONMENT_IS_WORKER?scriptDirectory=self.location.href:void 0!==document&&document.currentScript&&(scriptDirectory=document.currentScript.src),scriptDirectory=0!==scriptDirectory.indexOf("blob:")?scriptDirectory.substr(0,scriptDirectory.replace(/[?#].*/,"").lastIndexOf("/")+1):"",read_=e=>{var t=new XMLHttpRequest;return t.open("GET",e,!1),t.send(null),t.responseText},ENVIRONMENT_IS_WORKER&&(readBinary=e=>{var t=new XMLHttpRequest;return t.open("GET",e,!1),t.responseType="arraybuffer",t.send(null),new Uint8Array(t.response)}),readAsync=(e,t,r)=>{var _=new XMLHttpRequest;_.open("GET",e,!0),_.responseType="arraybuffer",_.onload=()=>{200==_.status||0==_.status&&_.response?t(_.response):r()},_.onerror=r,_.send(null)},setWindowTitle=e=>document.title=e);var out=Module.print||console.log.bind(console),err=Module.printErr||console.warn.bind(console);Object.assign(Module,moduleOverrides),moduleOverrides=null,Module.arguments&&(arguments_=Module.arguments),Module.thisProgram&&(thisProgram=Module.thisProgram),Module.quit&&(quit_=Module.quit);var STACK_ALIGN=16,dynamicLibraries=Module.dynamicLibraries||[],wasmBinary;Module.wasmBinary&&(wasmBinary=Module.wasmBinary);var noExitRuntime=Module.noExitRuntime||!0,wasmMemory;"object"!=typeof WebAssembly&&abort("no native wasm support detected");var ABORT=!1,EXITSTATUS,UTF8Decoder="undefined"!=typeof TextDecoder?new TextDecoder("utf8"):void 0,buffer,HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;function UTF8ArrayToString(e,t,r){for(var _=t+r,n=t;e[n]&&!(n>=_);)++n;if(n-t>16&&e.buffer&&UTF8Decoder)return UTF8Decoder.decode(e.subarray(t,n));for(var s="";t<n;){var a=e[t++];if(128&a){var o=63&e[t++];if(192!=(224&a)){var i=63&e[t++];if((a=224==(240&a)?(15&a)<<12|o<<6|i:(7&a)<<18|o<<12|i<<6|63&e[t++])<65536)s+=String.fromCharCode(a);else{var l=a-65536;s+=String.fromCharCode(55296|l>>10,56320|1023&l)}}else s+=String.fromCharCode((31&a)<<6|o)}else s+=String.fromCharCode(a)}return s}function UTF8ToString(e,t){return e?UTF8ArrayToString(HEAPU8,e,t):""}function stringToUTF8Array(e,t,r,_){if(!(_>0))return 0;for(var n=r,s=r+_-1,a=0;a<e.length;++a){var o=e.charCodeAt(a);if(o>=55296&&o<=57343)o=65536+((1023&o)<<10)|1023&e.charCodeAt(++a);if(o<=127){if(r>=s)break;t[r++]=o}else if(o<=2047){if(r+1>=s)break;t[r++]=192|o>>6,t[r++]=128|63&o}else if(o<=65535){if(r+2>=s)break;t[r++]=224|o>>12,t[r++]=128|o>>6&63,t[r++]=128|63&o}else{if(r+3>=s)break;t[r++]=240|o>>18,t[r++]=128|o>>12&63,t[r++]=128|o>>6&63,t[r++]=128|63&o}}return t[r]=0,r-n}function stringToUTF8(e,t,r){return stringToUTF8Array(e,HEAPU8,t,r)}function lengthBytesUTF8(e){for(var t=0,r=0;r<e.length;++r){var _=e.charCodeAt(r);_<=127?t++:_<=2047?t+=2:_>=55296&&_<=57343?(t+=4,++r):t+=3}return t}function updateGlobalBufferAndViews(e){buffer=e,Module.HEAP8=HEAP8=new Int8Array(e),Module.HEAP16=HEAP16=new Int16Array(e),Module.HEAP32=HEAP32=new Int32Array(e),Module.HEAPU8=HEAPU8=new Uint8Array(e),Module.HEAPU16=HEAPU16=new Uint16Array(e),Module.HEAPU32=HEAPU32=new Uint32Array(e),Module.HEAPF32=HEAPF32=new Float32Array(e),Module.HEAPF64=HEAPF64=new Float64Array(e)}var INITIAL_MEMORY=Module.INITIAL_MEMORY||33554432;wasmMemory=Module.wasmMemory?Module.wasmMemory:new WebAssembly.Memory({initial:INITIAL_MEMORY/65536,maximum:32768}),wasmMemory&&(buffer=wasmMemory.buffer),INITIAL_MEMORY=buffer.byteLength,updateGlobalBufferAndViews(buffer);var wasmTable=new WebAssembly.Table({initial:20,element:"anyfunc"}),__ATPRERUN__=[],__ATINIT__=[],__ATMAIN__=[],__ATPOSTRUN__=[],__RELOC_FUNCS__=[],runtimeInitialized=!1;function keepRuntimeAlive(){return noExitRuntime}function preRun(){if(Module.preRun)for("function"==typeof Module.preRun&&(Module.preRun=[Module.preRun]);Module.preRun.length;)addOnPreRun(Module.preRun.shift());callRuntimeCallbacks(__ATPRERUN__)}function initRuntime(){runtimeInitialized=!0,callRuntimeCallbacks(__RELOC_FUNCS__),callRuntimeCallbacks(__ATINIT__)}function preMain(){callRuntimeCallbacks(__ATMAIN__)}function postRun(){if(Module.postRun)for("function"==typeof Module.postRun&&(Module.postRun=[Module.postRun]);Module.postRun.length;)addOnPostRun(Module.postRun.shift());callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(e){__ATPRERUN__.unshift(e)}function addOnInit(e){__ATINIT__.unshift(e)}function addOnPostRun(e){__ATPOSTRUN__.unshift(e)}var runDependencies=0,runDependencyWatcher=null,dependenciesFulfilled=null;function addRunDependency(e){runDependencies++,Module.monitorRunDependencies&&Module.monitorRunDependencies(runDependencies)}function removeRunDependency(e){if(runDependencies--,Module.monitorRunDependencies&&Module.monitorRunDependencies(runDependencies),0==runDependencies&&(null!==runDependencyWatcher&&(clearInterval(runDependencyWatcher),runDependencyWatcher=null),dependenciesFulfilled)){var t=dependenciesFulfilled;dependenciesFulfilled=null,t()}}function abort(e){throw Module.onAbort&&Module.onAbort(e),err(e="Aborted("+e+")"),ABORT=!0,EXITSTATUS=1,e+=". Build with -sASSERTIONS for more info.",new WebAssembly.RuntimeError(e)}var dataURIPrefix="data:application/octet-stream;base64,",wasmBinaryFile,tempDouble,tempI64;function isDataURI(e){return e.startsWith(dataURIPrefix)}function isFileURI(e){return e.startsWith("file://")}function getBinary(e){try{if(e==wasmBinaryFile&&wasmBinary)return new Uint8Array(wasmBinary);if(readBinary)return readBinary(e);throw"both async and sync fetching of the wasm failed"}catch(e){abort(e)}}function getBinaryPromise(){if(!wasmBinary&&(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)){if("function"==typeof fetch&&!isFileURI(wasmBinaryFile))return fetch(wasmBinaryFile,{credentials:"same-origin"}).then((function(e){if(!e.ok)throw"failed to load wasm binary file at '"+wasmBinaryFile+"'";return e.arrayBuffer()})).catch((function(){return getBinary(wasmBinaryFile)}));if(readAsync)return new Promise((function(e,t){readAsync(wasmBinaryFile,(function(t){e(new Uint8Array(t))}),t)}))}return Promise.resolve().then((function(){return getBinary(wasmBinaryFile)}))}function createWasm(){var e={env:asmLibraryArg,wasi_snapshot_preview1:asmLibraryArg,"GOT.mem":new Proxy(asmLibraryArg,GOTHandler),"GOT.func":new Proxy(asmLibraryArg,GOTHandler)};function t(e,t){var r=e.exports;r=relocateExports(r,1024);var _=getDylinkMetadata(t);_.neededDynlibs&&(dynamicLibraries=_.neededDynlibs.concat(dynamicLibraries)),mergeLibSymbols(r,"main"),Module.asm=r,addOnInit(Module.asm.__wasm_call_ctors),__RELOC_FUNCS__.push(Module.asm.__wasm_apply_data_relocs),removeRunDependency("wasm-instantiate")}function r(e){t(e.instance,e.module)}function _(t){return getBinaryPromise().then((function(t){return WebAssembly.instantiate(t,e)})).then((function(e){return e})).then(t,(function(e){err("failed to asynchronously prepare wasm: "+e),abort(e)}))}if(addRunDependency("wasm-instantiate"),Module.instantiateWasm)try{return Module.instantiateWasm(e,t)}catch(e){return err("Module.instantiateWasm callback failed with error: "+e),!1}return wasmBinary||"function"!=typeof WebAssembly.instantiateStreaming||isDataURI(wasmBinaryFile)||isFileURI(wasmBinaryFile)||ENVIRONMENT_IS_NODE||"function"!=typeof fetch?_(r):fetch(wasmBinaryFile,{credentials:"same-origin"}).then((function(t){return WebAssembly.instantiateStreaming(t,e).then(r,(function(e){return err("wasm streaming compile failed: "+e),err("falling back to ArrayBuffer instantiation"),_(r)}))})),{}}wasmBinaryFile="tree-sitter.wasm",isDataURI(wasmBinaryFile)||(wasmBinaryFile=locateFile(wasmBinaryFile));var ASM_CONSTS={};function ExitStatus(e){this.name="ExitStatus",this.message="Program terminated with exit("+e+")",this.status=e}var GOT={},CurrentModuleWeakSymbols=new Set([]),GOTHandler={get:function(e,t){var r=GOT[t];return r||(r=GOT[t]=new WebAssembly.Global({value:"i32",mutable:!0})),CurrentModuleWeakSymbols.has(t)||(r.required=!0),r}};function callRuntimeCallbacks(e){for(;e.length>0;)e.shift()(Module)}function getDylinkMetadata(e){var t=0,r=0;function _(){for(var r=0,_=1;;){var n=e[t++];if(r+=(127&n)*_,_*=128,!(128&n))break}return r}function n(){var r=_();return UTF8ArrayToString(e,(t+=r)-r,r)}function s(e,t){if(e)throw new Error(t)}var a="dylink.0";if(e instanceof WebAssembly.Module){var o=WebAssembly.Module.customSections(e,a);0===o.length&&(a="dylink",o=WebAssembly.Module.customSections(e,a)),s(0===o.length,"need dylink section"),r=(e=new Uint8Array(o[0])).length}else{s(!(1836278016==new Uint32Array(new Uint8Array(e.subarray(0,24)).buffer)[0]),"need to see wasm magic number"),s(0!==e[8],"need the dylink section to be first"),t=9;var i=_();r=t+i,a=n()}var l={neededDynlibs:[],tlsExports:new Set,weakImports:new Set};if("dylink"==a){l.memorySize=_(),l.memoryAlign=_(),l.tableSize=_(),l.tableAlign=_();for(var u=_(),d=0;d<u;++d){var c=n();l.neededDynlibs.push(c)}}else{s("dylink.0"!==a);for(;t<r;){var m=e[t++],p=_();if(1===m)l.memorySize=_(),l.memoryAlign=_(),l.tableSize=_(),l.tableAlign=_();else if(2===m)for(u=_(),d=0;d<u;++d)c=n(),l.neededDynlibs.push(c);else if(3===m)for(var f=_();f--;){var h=n();256&_()&&l.tlsExports.add(h)}else if(4===m)for(f=_();f--;){n(),h=n();1==(3&_())&&l.weakImports.add(h)}else t+=p}}return l}function getValue(e,t="i8"){switch(t.endsWith("*")&&(t="*"),t){case"i1":case"i8":return HEAP8[e>>0];case"i16":return HEAP16[e>>1];case"i32":case"i64":return HEAP32[e>>2];case"float":return HEAPF32[e>>2];case"double":return HEAPF64[e>>3];case"*":return HEAPU32[e>>2];default:abort("invalid type for getValue: "+t)}return null}function asmjsMangle(e){return 0==e.indexOf("dynCall_")||["stackAlloc","stackSave","stackRestore","getTempRet0","setTempRet0"].includes(e)?e:"_"+e}function mergeLibSymbols(e,t){for(var r in e)if(e.hasOwnProperty(r)){asmLibraryArg.hasOwnProperty(r)||(asmLibraryArg[r]=e[r]);var _=asmjsMangle(r);Module.hasOwnProperty(_)||(Module[_]=e[r]),"__main_argc_argv"==r&&(Module._main=e[r])}}var LDSO={loadedLibsByName:{},loadedLibsByHandle:{}};function dynCallLegacy(e,t,r){var _=Module["dynCall_"+e];return r&&r.length?_.apply(null,[t].concat(r)):_.call(null,t)}var wasmTableMirror=[];function getWasmTableEntry(e){var t=wasmTableMirror[e];return t||(e>=wasmTableMirror.length&&(wasmTableMirror.length=e+1),wasmTableMirror[e]=t=wasmTable.get(e)),t}function dynCall(e,t,r){return e.includes("j")?dynCallLegacy(e,t,r):getWasmTableEntry(t).apply(null,r)}function createInvokeFunction(e){return function(){var t=stackSave();try{return dynCall(e,arguments[0],Array.prototype.slice.call(arguments,1))}catch(e){if(stackRestore(t),e!==e+0)throw e;_setThrew(1,0)}}}var ___heap_base=78144;function zeroMemory(e,t){return HEAPU8.fill(0,e,e+t),e}function getMemory(e){if(runtimeInitialized)return zeroMemory(_malloc(e),e);var t=___heap_base,r=t+e+15&-16;return ___heap_base=r,GOT.__heap_base.value=r,t}function isInternalSym(e){return["__cpp_exception","__c_longjmp","__wasm_apply_data_relocs","__dso_handle","__tls_size","__tls_align","__set_stack_limits","_emscripten_tls_init","__wasm_init_tls","__wasm_call_ctors","__start_em_asm","__stop_em_asm"].includes(e)}function uleb128Encode(e,t){e<128?t.push(e):t.push(e%128|128,e>>7)}function sigToWasmTypes(e){for(var t={i:"i32",j:"i32",f:"f32",d:"f64",p:"i32"},r={parameters:[],results:"v"==e[0]?[]:[t[e[0]]]},_=1;_<e.length;++_)r.parameters.push(t[e[_]]),"j"===e[_]&&r.parameters.push("i32");return r}function generateFuncType(e,t){var r=e.slice(0,1),_=e.slice(1),n={i:127,p:127,j:126,f:125,d:124};t.push(96),uleb128Encode(_.length,t);for(var s=0;s<_.length;++s)t.push(n[_[s]]);"v"==r?t.push(0):t.push(1,n[r])}function convertJsFunctionToWasm(e,t){if("function"==typeof WebAssembly.Function)return new WebAssembly.Function(sigToWasmTypes(t),e);var r=[1];generateFuncType(t,r);var _=[0,97,115,109,1,0,0,0,1];uleb128Encode(r.length,_),_.push.apply(_,r),_.push(2,7,1,1,101,1,102,0,0,7,5,1,1,102,0,0);var n=new WebAssembly.Module(new Uint8Array(_));return new WebAssembly.Instance(n,{e:{f:e}}).exports.f}function updateTableMap(e,t){if(functionsInTableMap)for(var r=e;r<e+t;r++){var _=getWasmTableEntry(r);_&&functionsInTableMap.set(_,r)}}var functionsInTableMap=void 0,freeTableIndexes=[];function getEmptyTableSlot(){if(freeTableIndexes.length)return freeTableIndexes.pop();try{wasmTable.grow(1)}catch(e){if(!(e instanceof RangeError))throw e;throw"Unable to grow wasm table. Set ALLOW_TABLE_GROWTH."}return wasmTable.length-1}function setWasmTableEntry(e,t){wasmTable.set(e,t),wasmTableMirror[e]=wasmTable.get(e)}function addFunction(e,t){if(functionsInTableMap||(functionsInTableMap=new WeakMap,updateTableMap(0,wasmTable.length)),functionsInTableMap.has(e))return functionsInTableMap.get(e);var r=getEmptyTableSlot();try{setWasmTableEntry(r,e)}catch(_){if(!(_ instanceof TypeError))throw _;setWasmTableEntry(r,convertJsFunctionToWasm(e,t))}return functionsInTableMap.set(e,r),r}function updateGOT(e,t){for(var r in e)if(!isInternalSym(r)){var _=e[r];r.startsWith("orig$")&&(r=r.split("$")[1],t=!0),GOT[r]||(GOT[r]=new WebAssembly.Global({value:"i32",mutable:!0})),(t||0==GOT[r].value)&&("function"==typeof _?GOT[r].value=addFunction(_):"number"==typeof _?GOT[r].value=_:err("unhandled export type for `"+r+"`: "+typeof _))}}function relocateExports(e,t,r){var _={};for(var n in e){var s=e[n];"object"==typeof s&&(s=s.value),"number"==typeof s&&(s+=t),_[n]=s}return updateGOT(_,r),_}function resolveGlobalSymbol(e,t){var r;return t&&(r=asmLibraryArg["orig$"+e]),r||(r=asmLibraryArg[e])&&r.stub&&(r=void 0),r||(r=Module[asmjsMangle(e)]),!r&&e.startsWith("invoke_")&&(r=createInvokeFunction(e.split("_")[1])),r}function alignMemory(e,t){return Math.ceil(e/t)*t}function loadWebAssemblyModule(binary,flags,handle){var metadata=getDylinkMetadata(binary);function loadModule(){var firstLoad=!handle||!HEAP8[handle+12>>0];if(firstLoad){var memAlign=Math.pow(2,metadata.memoryAlign);memAlign=Math.max(memAlign,STACK_ALIGN);var memoryBase=metadata.memorySize?alignMemory(getMemory(metadata.memorySize+memAlign),memAlign):0,tableBase=metadata.tableSize?wasmTable.length:0;handle&&(HEAP8[handle+12>>0]=1,HEAPU32[handle+16>>2]=memoryBase,HEAP32[handle+20>>2]=metadata.memorySize,HEAPU32[handle+24>>2]=tableBase,HEAP32[handle+28>>2]=metadata.tableSize)}else memoryBase=HEAPU32[handle+16>>2],tableBase=HEAPU32[handle+24>>2];var tableGrowthNeeded=tableBase+metadata.tableSize-wasmTable.length,moduleExports;function resolveSymbol(e){var t=resolveGlobalSymbol(e,!1);return t||(t=moduleExports[e]),t}tableGrowthNeeded>0&&wasmTable.grow(tableGrowthNeeded);var proxyHandler={get:function(e,t){switch(t){case"__memory_base":return memoryBase;case"__table_base":return tableBase}if(t in asmLibraryArg)return asmLibraryArg[t];var r;t in e||(e[t]=function(){return r||(r=resolveSymbol(t)),r.apply(null,arguments)});return e[t]}},proxy=new Proxy({},proxyHandler),info={"GOT.mem":new Proxy({},GOTHandler),"GOT.func":new Proxy({},GOTHandler),env:proxy,wasi_snapshot_preview1:proxy};function postInstantiation(instance){function addEmAsm(addr,body){for(var args=[],arity=0;arity<16&&-1!=body.indexOf("$"+arity);arity++)args.push("$"+arity);args=args.join(",");var func="("+args+" ) => { "+body+"};";ASM_CONSTS[start]=eval(func)}if(updateTableMap(tableBase,metadata.tableSize),moduleExports=relocateExports(instance.exports,memoryBase),flags.allowUndefined||reportUndefinedSymbols(),"__start_em_asm"in moduleExports)for(var start=moduleExports.__start_em_asm,stop=moduleExports.__stop_em_asm;start<stop;){var jsString=UTF8ToString(start);addEmAsm(start,jsString),start=HEAPU8.indexOf(0,start)+1}var applyRelocs=moduleExports.__wasm_apply_data_relocs;applyRelocs&&(runtimeInitialized?applyRelocs():__RELOC_FUNCS__.push(applyRelocs));var init=moduleExports.__wasm_call_ctors;return init&&(runtimeInitialized?init():__ATINIT__.push(init)),moduleExports}if(flags.loadAsync){if(binary instanceof WebAssembly.Module){var instance=new WebAssembly.Instance(binary,info);return Promise.resolve(postInstantiation(instance))}return WebAssembly.instantiate(binary,info).then((function(e){return postInstantiation(e.instance)}))}var module=binary instanceof WebAssembly.Module?binary:new WebAssembly.Module(binary),instance=new WebAssembly.Instance(module,info);return postInstantiation(instance)}return CurrentModuleWeakSymbols=metadata.weakImports,flags.loadAsync?metadata.neededDynlibs.reduce((function(e,t){return e.then((function(){return loadDynamicLibrary(t,flags)}))}),Promise.resolve()).then((function(){return loadModule()})):(metadata.neededDynlibs.forEach((function(e){loadDynamicLibrary(e,flags)})),loadModule())}function loadDynamicLibrary(e,t,r){t=t||{global:!0,nodelete:!0};var _=LDSO.loadedLibsByName[e];if(_)return t.global&&!_.global&&(_.global=!0,"loading"!==_.module&&mergeLibSymbols(_.module,e)),t.nodelete&&_.refcount!==1/0&&(_.refcount=1/0),_.refcount++,r&&(LDSO.loadedLibsByHandle[r]=_),!t.loadAsync||Promise.resolve(!0);function n(e){if(t.fs&&t.fs.findObject(e)){var r=t.fs.readFile(e,{encoding:"binary"});return r instanceof Uint8Array||(r=new Uint8Array(r)),t.loadAsync?Promise.resolve(r):r}if(e=locateFile(e),t.loadAsync)return new Promise((function(t,r){readAsync(e,(e=>t(new Uint8Array(e))),r)}));if(!readBinary)throw new Error(e+": file not found, and synchronous loading of external files is not available");return readBinary(e)}function s(){if("undefined"!=typeof preloadedWasm&&preloadedWasm[e]){var _=preloadedWasm[e];return t.loadAsync?Promise.resolve(_):_}return t.loadAsync?n(e).then((function(e){return loadWebAssemblyModule(e,t,r)})):loadWebAssemblyModule(n(e),t,r)}function a(t){_.global&&mergeLibSymbols(t,e),_.module=t}return _={refcount:t.nodelete?1/0:1,name:e,module:"loading",global:t.global},LDSO.loadedLibsByName[e]=_,r&&(LDSO.loadedLibsByHandle[r]=_),t.loadAsync?s().then((function(e){return a(e),!0})):(a(s()),!0)}function reportUndefinedSymbols(){for(var e in GOT)if(0==GOT[e].value){var t=resolveGlobalSymbol(e,!0);if(!t&&!GOT[e].required)continue;if("function"==typeof t)GOT[e].value=addFunction(t,t.sig);else{if("number"!=typeof t)throw new Error("bad export type for `"+e+"`: "+typeof t);GOT[e].value=t}}}function preloadDylibs(){dynamicLibraries.length?(addRunDependency("preloadDylibs"),dynamicLibraries.reduce((function(e,t){return e.then((function(){return loadDynamicLibrary(t,{loadAsync:!0,global:!0,nodelete:!0,allowUndefined:!0})}))}),Promise.resolve()).then((function(){reportUndefinedSymbols(),removeRunDependency("preloadDylibs")}))):reportUndefinedSymbols()}function setValue(e,t,r="i8"){switch(r.endsWith("*")&&(r="*"),r){case"i1":case"i8":HEAP8[e>>0]=t;break;case"i16":HEAP16[e>>1]=t;break;case"i32":HEAP32[e>>2]=t;break;case"i64":tempI64=[t>>>0,(tempDouble=t,+Math.abs(tempDouble)>=1?tempDouble>0?(0|Math.min(+Math.floor(tempDouble/4294967296),4294967295))>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[e>>2]=tempI64[0],HEAP32[e+4>>2]=tempI64[1];break;case"float":HEAPF32[e>>2]=t;break;case"double":HEAPF64[e>>3]=t;break;case"*":HEAPU32[e>>2]=t;break;default:abort("invalid type for setValue: "+r)}}var ___memory_base=new WebAssembly.Global({value:"i32",mutable:!1},1024),___stack_pointer=new WebAssembly.Global({value:"i32",mutable:!0},78144),___table_base=new WebAssembly.Global({value:"i32",mutable:!1},1),nowIsMonotonic=!0,_emscripten_get_now;function __emscripten_get_now_is_monotonic(){return nowIsMonotonic}function _abort(){abort("")}function _emscripten_date_now(){return Date.now()}function _emscripten_memcpy_big(e,t,r){HEAPU8.copyWithin(e,t,t+r)}function getHeapMax(){return 2147483648}function emscripten_realloc_buffer(e){try{return wasmMemory.grow(e-buffer.byteLength+65535>>>16),updateGlobalBufferAndViews(wasmMemory.buffer),1}catch(e){}}function _emscripten_resize_heap(e){var t=HEAPU8.length;e>>>=0;var r=getHeapMax();if(e>r)return!1;for(var _=1;_<=4;_*=2){var n=t*(1+.2/_);if(n=Math.min(n,e+100663296),emscripten_realloc_buffer(Math.min(r,(s=Math.max(e,n))+((a=65536)-s%a)%a)))return!0}var s,a;return!1}__emscripten_get_now_is_monotonic.sig="i",Module._abort=_abort,_abort.sig="v",_emscripten_date_now.sig="d",_emscripten_get_now=ENVIRONMENT_IS_NODE?()=>{var e=process.hrtime();return 1e3*e[0]+e[1]/1e6}:()=>performance.now(),_emscripten_get_now.sig="d",_emscripten_memcpy_big.sig="vppp",_emscripten_resize_heap.sig="ip";var SYSCALLS={DEFAULT_POLLMASK:5,calculateAt:function(e,t,r){if(PATH.isAbs(t))return t;var _;-100===e?_=FS.cwd():_=SYSCALLS.getStreamFromFD(e).path;if(0==t.length){if(!r)throw new FS.ErrnoError(44);return _}return PATH.join2(_,t)},doStat:function(e,t,r){try{var _=e(t)}catch(e){if(e&&e.node&&PATH.normalize(t)!==PATH.normalize(FS.getPath(e.node)))return-54;throw e}HEAP32[r>>2]=_.dev,HEAP32[r+8>>2]=_.ino,HEAP32[r+12>>2]=_.mode,HEAPU32[r+16>>2]=_.nlink,HEAP32[r+20>>2]=_.uid,HEAP32[r+24>>2]=_.gid,HEAP32[r+28>>2]=_.rdev,tempI64=[_.size>>>0,(tempDouble=_.size,+Math.abs(tempDouble)>=1?tempDouble>0?(0|Math.min(+Math.floor(tempDouble/4294967296),4294967295))>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[r+40>>2]=tempI64[0],HEAP32[r+44>>2]=tempI64[1],HEAP32[r+48>>2]=4096,HEAP32[r+52>>2]=_.blocks;var n=_.atime.getTime(),s=_.mtime.getTime(),a=_.ctime.getTime();return tempI64=[Math.floor(n/1e3)>>>0,(tempDouble=Math.floor(n/1e3),+Math.abs(tempDouble)>=1?tempDouble>0?(0|Math.min(+Math.floor(tempDouble/4294967296),4294967295))>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[r+56>>2]=tempI64[0],HEAP32[r+60>>2]=tempI64[1],HEAPU32[r+64>>2]=n%1e3*1e3,tempI64=[Math.floor(s/1e3)>>>0,(tempDouble=Math.floor(s/1e3),+Math.abs(tempDouble)>=1?tempDouble>0?(0|Math.min(+Math.floor(tempDouble/4294967296),4294967295))>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[r+72>>2]=tempI64[0],HEAP32[r+76>>2]=tempI64[1],HEAPU32[r+80>>2]=s%1e3*1e3,tempI64=[Math.floor(a/1e3)>>>0,(tempDouble=Math.floor(a/1e3),+Math.abs(tempDouble)>=1?tempDouble>0?(0|Math.min(+Math.floor(tempDouble/4294967296),4294967295))>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[r+88>>2]=tempI64[0],HEAP32[r+92>>2]=tempI64[1],HEAPU32[r+96>>2]=a%1e3*1e3,tempI64=[_.ino>>>0,(tempDouble=_.ino,+Math.abs(tempDouble)>=1?tempDouble>0?(0|Math.min(+Math.floor(tempDouble/4294967296),4294967295))>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[r+104>>2]=tempI64[0],HEAP32[r+108>>2]=tempI64[1],0},doMsync:function(e,t,r,_,n){if(!FS.isFile(t.node.mode))throw new FS.ErrnoError(43);if(2&_)return 0;var s=HEAPU8.slice(e,e+r);FS.msync(t,s,n,r,_)},varargs:void 0,get:function(){return SYSCALLS.varargs+=4,HEAP32[SYSCALLS.varargs-4>>2]},getStr:function(e){return UTF8ToString(e)},getStreamFromFD:function(e){var t=FS.getStream(e);if(!t)throw new FS.ErrnoError(8);return t}};function _proc_exit(e){EXITSTATUS=e,keepRuntimeAlive()||(Module.onExit&&Module.onExit(e),ABORT=!0),quit_(e,new ExitStatus(e))}function exitJS(e,t){EXITSTATUS=e,_proc_exit(e)}_proc_exit.sig="vi";var _exit=exitJS;function _fd_close(e){try{var t=SYSCALLS.getStreamFromFD(e);return FS.close(t),0}catch(e){if("undefined"==typeof FS||!(e instanceof FS.ErrnoError))throw e;return e.errno}}function convertI32PairToI53Checked(e,t){return t+2097152>>>0<4194305-!!e?(e>>>0)+4294967296*t:NaN}function _fd_seek(e,t,r,_,n){try{var s=convertI32PairToI53Checked(t,r);if(isNaN(s))return 61;var a=SYSCALLS.getStreamFromFD(e);return FS.llseek(a,s,_),tempI64=[a.position>>>0,(tempDouble=a.position,+Math.abs(tempDouble)>=1?tempDouble>0?(0|Math.min(+Math.floor(tempDouble/4294967296),4294967295))>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[n>>2]=tempI64[0],HEAP32[n+4>>2]=tempI64[1],a.getdents&&0===s&&0===_&&(a.getdents=null),0}catch(e){if("undefined"==typeof FS||!(e instanceof FS.ErrnoError))throw e;return e.errno}}function doWritev(e,t,r,_){for(var n=0,s=0;s<r;s++){var a=HEAPU32[t>>2],o=HEAPU32[t+4>>2];t+=8;var i=FS.write(e,HEAP8,a,o,_);if(i<0)return-1;n+=i,void 0!==_&&(_+=i)}return n}function _fd_write(e,t,r,_){try{var n=doWritev(SYSCALLS.getStreamFromFD(e),t,r);return HEAPU32[_>>2]=n,0}catch(e){if("undefined"==typeof FS||!(e instanceof FS.ErrnoError))throw e;return e.errno}}function _tree_sitter_log_callback(e,t){if(currentLogCallback){const r=UTF8ToString(t);currentLogCallback(r,0!==e)}}function _tree_sitter_parse_callback(e,t,r,_,n){var s=currentParseCallback(t,{row:r,column:_});"string"==typeof s?(setValue(n,s.length,"i32"),stringToUTF16(s,e,10240)):setValue(n,0,"i32")}function handleException(e){if(e instanceof ExitStatus||"unwind"==e)return EXITSTATUS;quit_(1,e)}function allocateUTF8OnStack(e){var t=lengthBytesUTF8(e)+1,r=stackAlloc(t);return stringToUTF8Array(e,HEAP8,r,t),r}function stringToUTF16(e,t,r){if(void 0===r&&(r=2147483647),r<2)return 0;for(var _=t,n=(r-=2)<2*e.length?r/2:e.length,s=0;s<n;++s){var a=e.charCodeAt(s);HEAP16[t>>1]=a,t+=2}return HEAP16[t>>1]=0,t-_}function AsciiToString(e){for(var t="";;){var r=HEAPU8[e++>>0];if(!r)return t;t+=String.fromCharCode(r)}}_exit.sig="vi",_fd_close.sig="ii",_fd_seek.sig="iijip",_fd_write.sig="iippp";var asmLibraryArg={__heap_base:___heap_base,__indirect_function_table:wasmTable,__memory_base:___memory_base,__stack_pointer:___stack_pointer,__table_base:___table_base,_emscripten_get_now_is_monotonic:__emscripten_get_now_is_monotonic,abort:_abort,emscripten_get_now:_emscripten_get_now,emscripten_memcpy_big:_emscripten_memcpy_big,emscripten_resize_heap:_emscripten_resize_heap,exit:_exit,fd_close:_fd_close,fd_seek:_fd_seek,fd_write:_fd_write,memory:wasmMemory,tree_sitter_log_callback:_tree_sitter_log_callback,tree_sitter_parse_callback:_tree_sitter_parse_callback},asm=createWasm(),___wasm_call_ctors=Module.___wasm_call_ctors=function(){return(___wasm_call_ctors=Module.___wasm_call_ctors=Module.asm.__wasm_call_ctors).apply(null,arguments)},___wasm_apply_data_relocs=Module.___wasm_apply_data_relocs=function(){return(___wasm_apply_data_relocs=Module.___wasm_apply_data_relocs=Module.asm.__wasm_apply_data_relocs).apply(null,arguments)},_malloc=Module._malloc=function(){return(_malloc=Module._malloc=Module.asm.malloc).apply(null,arguments)},_calloc=Module._calloc=function(){return(_calloc=Module._calloc=Module.asm.calloc).apply(null,arguments)},_realloc=Module._realloc=function(){return(_realloc=Module._realloc=Module.asm.realloc).apply(null,arguments)},_free=Module._free=function(){return(_free=Module._free=Module.asm.free).apply(null,arguments)},_ts_language_symbol_count=Module._ts_language_symbol_count=function(){return(_ts_language_symbol_count=Module._ts_language_symbol_count=Module.asm.ts_language_symbol_count).apply(null,arguments)},_ts_language_version=Module._ts_language_version=function(){return(_ts_language_version=Module._ts_language_version=Module.asm.ts_language_version).apply(null,arguments)},_ts_language_field_count=Module._ts_language_field_count=function(){return(_ts_language_field_count=Module._ts_language_field_count=Module.asm.ts_language_field_count).apply(null,arguments)},_ts_language_symbol_name=Module._ts_language_symbol_name=function(){return(_ts_language_symbol_name=Module._ts_language_symbol_name=Module.asm.ts_language_symbol_name).apply(null,arguments)},_ts_language_symbol_for_name=Module._ts_language_symbol_for_name=function(){return(_ts_language_symbol_for_name=Module._ts_language_symbol_for_name=Module.asm.ts_language_symbol_for_name).apply(null,arguments)},_ts_language_symbol_type=Module._ts_language_symbol_type=function(){return(_ts_language_symbol_type=Module._ts_language_symbol_type=Module.asm.ts_language_symbol_type).apply(null,arguments)},_ts_language_field_name_for_id=Module._ts_language_field_name_for_id=function(){return(_ts_language_field_name_for_id=Module._ts_language_field_name_for_id=Module.asm.ts_language_field_name_for_id).apply(null,arguments)},_memset=Module._memset=function(){return(_memset=Module._memset=Module.asm.memset).apply(null,arguments)},_memcpy=Module._memcpy=function(){return(_memcpy=Module._memcpy=Module.asm.memcpy).apply(null,arguments)},_ts_parser_delete=Module._ts_parser_delete=function(){return(_ts_parser_delete=Module._ts_parser_delete=Module.asm.ts_parser_delete).apply(null,arguments)},_ts_parser_reset=Module._ts_parser_reset=function(){return(_ts_parser_reset=Module._ts_parser_reset=Module.asm.ts_parser_reset).apply(null,arguments)},_ts_parser_set_language=Module._ts_parser_set_language=function(){return(_ts_parser_set_language=Module._ts_parser_set_language=Module.asm.ts_parser_set_language).apply(null,arguments)},_ts_parser_timeout_micros=Module._ts_parser_timeout_micros=function(){return(_ts_parser_timeout_micros=Module._ts_parser_timeout_micros=Module.asm.ts_parser_timeout_micros).apply(null,arguments)},_ts_parser_set_timeout_micros=Module._ts_parser_set_timeout_micros=function(){return(_ts_parser_set_timeout_micros=Module._ts_parser_set_timeout_micros=Module.asm.ts_parser_set_timeout_micros).apply(null,arguments)},_memmove=Module._memmove=function(){return(_memmove=Module._memmove=Module.asm.memmove).apply(null,arguments)},_memcmp=Module._memcmp=function(){return(_memcmp=Module._memcmp=Module.asm.memcmp).apply(null,arguments)},_ts_query_new=Module._ts_query_new=function(){return(_ts_query_new=Module._ts_query_new=Module.asm.ts_query_new).apply(null,arguments)},_ts_query_delete=Module._ts_query_delete=function(){return(_ts_query_delete=Module._ts_query_delete=Module.asm.ts_query_delete).apply(null,arguments)},_iswspace=Module._iswspace=function(){return(_iswspace=Module._iswspace=Module.asm.iswspace).apply(null,arguments)},_iswalnum=Module._iswalnum=function(){return(_iswalnum=Module._iswalnum=Module.asm.iswalnum).apply(null,arguments)},_ts_query_pattern_count=Module._ts_query_pattern_count=function(){return(_ts_query_pattern_count=Module._ts_query_pattern_count=Module.asm.ts_query_pattern_count).apply(null,arguments)},_ts_query_capture_count=Module._ts_query_capture_count=function(){return(_ts_query_capture_count=Module._ts_query_capture_count=Module.asm.ts_query_capture_count).apply(null,arguments)},_ts_query_string_count=Module._ts_query_string_count=function(){return(_ts_query_string_count=Module._ts_query_string_count=Module.asm.ts_query_string_count).apply(null,arguments)},_ts_query_capture_name_for_id=Module._ts_query_capture_name_for_id=function(){return(_ts_query_capture_name_for_id=Module._ts_query_capture_name_for_id=Module.asm.ts_query_capture_name_for_id).apply(null,arguments)},_ts_query_string_value_for_id=Module._ts_query_string_value_for_id=function(){return(_ts_query_string_value_for_id=Module._ts_query_string_value_for_id=Module.asm.ts_query_string_value_for_id).apply(null,arguments)},_ts_query_predicates_for_pattern=Module._ts_query_predicates_for_pattern=function(){return(_ts_query_predicates_for_pattern=Module._ts_query_predicates_for_pattern=Module.asm.ts_query_predicates_for_pattern).apply(null,arguments)},_ts_tree_copy=Module._ts_tree_copy=function(){return(_ts_tree_copy=Module._ts_tree_copy=Module.asm.ts_tree_copy).apply(null,arguments)},_ts_tree_delete=Module._ts_tree_delete=function(){return(_ts_tree_delete=Module._ts_tree_delete=Module.asm.ts_tree_delete).apply(null,arguments)},_ts_init=Module._ts_init=function(){return(_ts_init=Module._ts_init=Module.asm.ts_init).apply(null,arguments)},_ts_parser_new_wasm=Module._ts_parser_new_wasm=function(){return(_ts_parser_new_wasm=Module._ts_parser_new_wasm=Module.asm.ts_parser_new_wasm).apply(null,arguments)},_ts_parser_enable_logger_wasm=Module._ts_parser_enable_logger_wasm=function(){return(_ts_parser_enable_logger_wasm=Module._ts_parser_enable_logger_wasm=Module.asm.ts_parser_enable_logger_wasm).apply(null,arguments)},_ts_parser_parse_wasm=Module._ts_parser_parse_wasm=function(){return(_ts_parser_parse_wasm=Module._ts_parser_parse_wasm=Module.asm.ts_parser_parse_wasm).apply(null,arguments)},_ts_language_type_is_named_wasm=Module._ts_language_type_is_named_wasm=function(){return(_ts_language_type_is_named_wasm=Module._ts_language_type_is_named_wasm=Module.asm.ts_language_type_is_named_wasm).apply(null,arguments)},_ts_language_type_is_visible_wasm=Module._ts_language_type_is_visible_wasm=function(){return(_ts_language_type_is_visible_wasm=Module._ts_language_type_is_visible_wasm=Module.asm.ts_language_type_is_visible_wasm).apply(null,arguments)},_ts_tree_root_node_wasm=Module._ts_tree_root_node_wasm=function(){return(_ts_tree_root_node_wasm=Module._ts_tree_root_node_wasm=Module.asm.ts_tree_root_node_wasm).apply(null,arguments)},_ts_tree_edit_wasm=Module._ts_tree_edit_wasm=function(){return(_ts_tree_edit_wasm=Module._ts_tree_edit_wasm=Module.asm.ts_tree_edit_wasm).apply(null,arguments)},_ts_tree_get_changed_ranges_wasm=Module._ts_tree_get_changed_ranges_wasm=function(){return(_ts_tree_get_changed_ranges_wasm=Module._ts_tree_get_changed_ranges_wasm=Module.asm.ts_tree_get_changed_ranges_wasm).apply(null,arguments)},_ts_tree_cursor_new_wasm=Module._ts_tree_cursor_new_wasm=function(){return(_ts_tree_cursor_new_wasm=Module._ts_tree_cursor_new_wasm=Module.asm.ts_tree_cursor_new_wasm).apply(null,arguments)},_ts_tree_cursor_delete_wasm=Module._ts_tree_cursor_delete_wasm=function(){return(_ts_tree_cursor_delete_wasm=Module._ts_tree_cursor_delete_wasm=Module.asm.ts_tree_cursor_delete_wasm).apply(null,arguments)},_ts_tree_cursor_reset_wasm=Module._ts_tree_cursor_reset_wasm=function(){return(_ts_tree_cursor_reset_wasm=Module._ts_tree_cursor_reset_wasm=Module.asm.ts_tree_cursor_reset_wasm).apply(null,arguments)},_ts_tree_cursor_goto_first_child_wasm=Module._ts_tree_cursor_goto_first_child_wasm=function(){return(_ts_tree_cursor_goto_first_child_wasm=Module._ts_tree_cursor_goto_first_child_wasm=Module.asm.ts_tree_cursor_goto_first_child_wasm).apply(null,arguments)},_ts_tree_cursor_goto_next_sibling_wasm=Module._ts_tree_cursor_goto_next_sibling_wasm=function(){return(_ts_tree_cursor_goto_next_sibling_wasm=Module._ts_tree_cursor_goto_next_sibling_wasm=Module.asm.ts_tree_cursor_goto_next_sibling_wasm).apply(null,arguments)},_ts_tree_cursor_goto_parent_wasm=Module._ts_tree_cursor_goto_parent_wasm=function(){return(_ts_tree_cursor_goto_parent_wasm=Module._ts_tree_cursor_goto_parent_wasm=Module.asm.ts_tree_cursor_goto_parent_wasm).apply(null,arguments)},_ts_tree_cursor_current_node_type_id_wasm=Module._ts_tree_cursor_current_node_type_id_wasm=function(){return(_ts_tree_cursor_current_node_type_id_wasm=Module._ts_tree_cursor_current_node_type_id_wasm=Module.asm.ts_tree_cursor_current_node_type_id_wasm).apply(null,arguments)},_ts_tree_cursor_current_node_is_named_wasm=Module._ts_tree_cursor_current_node_is_named_wasm=function(){return(_ts_tree_cursor_current_node_is_named_wasm=Module._ts_tree_cursor_current_node_is_named_wasm=Module.asm.ts_tree_cursor_current_node_is_named_wasm).apply(null,arguments)},_ts_tree_cursor_current_node_is_missing_wasm=Module._ts_tree_cursor_current_node_is_missing_wasm=function(){return(_ts_tree_cursor_current_node_is_missing_wasm=Module._ts_tree_cursor_current_node_is_missing_wasm=Module.asm.ts_tree_cursor_current_node_is_missing_wasm).apply(null,arguments)},_ts_tree_cursor_current_node_id_wasm=Module._ts_tree_cursor_current_node_id_wasm=function(){return(_ts_tree_cursor_current_node_id_wasm=Module._ts_tree_cursor_current_node_id_wasm=Module.asm.ts_tree_cursor_current_node_id_wasm).apply(null,arguments)},_ts_tree_cursor_start_position_wasm=Module._ts_tree_cursor_start_position_wasm=function(){return(_ts_tree_cursor_start_position_wasm=Module._ts_tree_cursor_start_position_wasm=Module.asm.ts_tree_cursor_start_position_wasm).apply(null,arguments)},_ts_tree_cursor_end_position_wasm=Module._ts_tree_cursor_end_position_wasm=function(){return(_ts_tree_cursor_end_position_wasm=Module._ts_tree_cursor_end_position_wasm=Module.asm.ts_tree_cursor_end_position_wasm).apply(null,arguments)},_ts_tree_cursor_start_index_wasm=Module._ts_tree_cursor_start_index_wasm=function(){return(_ts_tree_cursor_start_index_wasm=Module._ts_tree_cursor_start_index_wasm=Module.asm.ts_tree_cursor_start_index_wasm).apply(null,arguments)},_ts_tree_cursor_end_index_wasm=Module._ts_tree_cursor_end_index_wasm=function(){return(_ts_tree_cursor_end_index_wasm=Module._ts_tree_cursor_end_index_wasm=Module.asm.ts_tree_cursor_end_index_wasm).apply(null,arguments)},_ts_tree_cursor_current_field_id_wasm=Module._ts_tree_cursor_current_field_id_wasm=function(){return(_ts_tree_cursor_current_field_id_wasm=Module._ts_tree_cursor_current_field_id_wasm=Module.asm.ts_tree_cursor_current_field_id_wasm).apply(null,arguments)},_ts_tree_cursor_current_node_wasm=Module._ts_tree_cursor_current_node_wasm=function(){return(_ts_tree_cursor_current_node_wasm=Module._ts_tree_cursor_current_node_wasm=Module.asm.ts_tree_cursor_current_node_wasm).apply(null,arguments)},_ts_node_symbol_wasm=Module._ts_node_symbol_wasm=function(){return(_ts_node_symbol_wasm=Module._ts_node_symbol_wasm=Module.asm.ts_node_symbol_wasm).apply(null,arguments)},_ts_node_child_count_wasm=Module._ts_node_child_count_wasm=function(){return(_ts_node_child_count_wasm=Module._ts_node_child_count_wasm=Module.asm.ts_node_child_count_wasm).apply(null,arguments)},_ts_node_named_child_count_wasm=Module._ts_node_named_child_count_wasm=function(){return(_ts_node_named_child_count_wasm=Module._ts_node_named_child_count_wasm=Module.asm.ts_node_named_child_count_wasm).apply(null,arguments)},_ts_node_child_wasm=Module._ts_node_child_wasm=function(){return(_ts_node_child_wasm=Module._ts_node_child_wasm=Module.asm.ts_node_child_wasm).apply(null,arguments)},_ts_node_named_child_wasm=Module._ts_node_named_child_wasm=function(){return(_ts_node_named_child_wasm=Module._ts_node_named_child_wasm=Module.asm.ts_node_named_child_wasm).apply(null,arguments)},_ts_node_child_by_field_id_wasm=Module._ts_node_child_by_field_id_wasm=function(){return(_ts_node_child_by_field_id_wasm=Module._ts_node_child_by_field_id_wasm=Module.asm.ts_node_child_by_field_id_wasm).apply(null,arguments)},_ts_node_next_sibling_wasm=Module._ts_node_next_sibling_wasm=function(){return(_ts_node_next_sibling_wasm=Module._ts_node_next_sibling_wasm=Module.asm.ts_node_next_sibling_wasm).apply(null,arguments)},_ts_node_prev_sibling_wasm=Module._ts_node_prev_sibling_wasm=function(){return(_ts_node_prev_sibling_wasm=Module._ts_node_prev_sibling_wasm=Module.asm.ts_node_prev_sibling_wasm).apply(null,arguments)},_ts_node_next_named_sibling_wasm=Module._ts_node_next_named_sibling_wasm=function(){return(_ts_node_next_named_sibling_wasm=Module._ts_node_next_named_sibling_wasm=Module.asm.ts_node_next_named_sibling_wasm).apply(null,arguments)},_ts_node_prev_named_sibling_wasm=Module._ts_node_prev_named_sibling_wasm=function(){return(_ts_node_prev_named_sibling_wasm=Module._ts_node_prev_named_sibling_wasm=Module.asm.ts_node_prev_named_sibling_wasm).apply(null,arguments)},_ts_node_parent_wasm=Module._ts_node_parent_wasm=function(){return(_ts_node_parent_wasm=Module._ts_node_parent_wasm=Module.asm.ts_node_parent_wasm).apply(null,arguments)},_ts_node_descendant_for_index_wasm=Module._ts_node_descendant_for_index_wasm=function(){return(_ts_node_descendant_for_index_wasm=Module._ts_node_descendant_for_index_wasm=Module.asm.ts_node_descendant_for_index_wasm).apply(null,arguments)},_ts_node_named_descendant_for_index_wasm=Module._ts_node_named_descendant_for_index_wasm=function(){return(_ts_node_named_descendant_for_index_wasm=Module._ts_node_named_descendant_for_index_wasm=Module.asm.ts_node_named_descendant_for_index_wasm).apply(null,arguments)},_ts_node_descendant_for_position_wasm=Module._ts_node_descendant_for_position_wasm=function(){return(_ts_node_descendant_for_position_wasm=Module._ts_node_descendant_for_position_wasm=Module.asm.ts_node_descendant_for_position_wasm).apply(null,arguments)},_ts_node_named_descendant_for_position_wasm=Module._ts_node_named_descendant_for_position_wasm=function(){return(_ts_node_named_descendant_for_position_wasm=Module._ts_node_named_descendant_for_position_wasm=Module.asm.ts_node_named_descendant_for_position_wasm).apply(null,arguments)},_ts_node_start_point_wasm=Module._ts_node_start_point_wasm=function(){return(_ts_node_start_point_wasm=Module._ts_node_start_point_wasm=Module.asm.ts_node_start_point_wasm).apply(null,arguments)},_ts_node_end_point_wasm=Module._ts_node_end_point_wasm=function(){return(_ts_node_end_point_wasm=Module._ts_node_end_point_wasm=Module.asm.ts_node_end_point_wasm).apply(null,arguments)},_ts_node_start_index_wasm=Module._ts_node_start_index_wasm=function(){return(_ts_node_start_index_wasm=Module._ts_node_start_index_wasm=Module.asm.ts_node_start_index_wasm).apply(null,arguments)},_ts_node_end_index_wasm=Module._ts_node_end_index_wasm=function(){return(_ts_node_end_index_wasm=Module._ts_node_end_index_wasm=Module.asm.ts_node_end_index_wasm).apply(null,arguments)},_ts_node_to_string_wasm=Module._ts_node_to_string_wasm=function(){return(_ts_node_to_string_wasm=Module._ts_node_to_string_wasm=Module.asm.ts_node_to_string_wasm).apply(null,arguments)},_ts_node_children_wasm=Module._ts_node_children_wasm=function(){return(_ts_node_children_wasm=Module._ts_node_children_wasm=Module.asm.ts_node_children_wasm).apply(null,arguments)},_ts_node_named_children_wasm=Module._ts_node_named_children_wasm=function(){return(_ts_node_named_children_wasm=Module._ts_node_named_children_wasm=Module.asm.ts_node_named_children_wasm).apply(null,arguments)},_ts_node_descendants_of_type_wasm=Module._ts_node_descendants_of_type_wasm=function(){return(_ts_node_descendants_of_type_wasm=Module._ts_node_descendants_of_type_wasm=Module.asm.ts_node_descendants_of_type_wasm).apply(null,arguments)},_ts_node_is_named_wasm=Module._ts_node_is_named_wasm=function(){return(_ts_node_is_named_wasm=Module._ts_node_is_named_wasm=Module.asm.ts_node_is_named_wasm).apply(null,arguments)},_ts_node_has_changes_wasm=Module._ts_node_has_changes_wasm=function(){return(_ts_node_has_changes_wasm=Module._ts_node_has_changes_wasm=Module.asm.ts_node_has_changes_wasm).apply(null,arguments)},_ts_node_has_error_wasm=Module._ts_node_has_error_wasm=function(){return(_ts_node_has_error_wasm=Module._ts_node_has_error_wasm=Module.asm.ts_node_has_error_wasm).apply(null,arguments)},_ts_node_is_missing_wasm=Module._ts_node_is_missing_wasm=function(){return(_ts_node_is_missing_wasm=Module._ts_node_is_missing_wasm=Module.asm.ts_node_is_missing_wasm).apply(null,arguments)},_ts_query_matches_wasm=Module._ts_query_matches_wasm=function(){return(_ts_query_matches_wasm=Module._ts_query_matches_wasm=Module.asm.ts_query_matches_wasm).apply(null,arguments)},_ts_query_captures_wasm=Module._ts_query_captures_wasm=function(){return(_ts_query_captures_wasm=Module._ts_query_captures_wasm=Module.asm.ts_query_captures_wasm).apply(null,arguments)},___cxa_atexit=Module.___cxa_atexit=function(){return(___cxa_atexit=Module.___cxa_atexit=Module.asm.__cxa_atexit).apply(null,arguments)},_iswdigit=Module._iswdigit=function(){return(_iswdigit=Module._iswdigit=Module.asm.iswdigit).apply(null,arguments)},_iswalpha=Module._iswalpha=function(){return(_iswalpha=Module._iswalpha=Module.asm.iswalpha).apply(null,arguments)},_iswlower=Module._iswlower=function(){return(_iswlower=Module._iswlower=Module.asm.iswlower).apply(null,arguments)},_memchr=Module._memchr=function(){return(_memchr=Module._memchr=Module.asm.memchr).apply(null,arguments)},_strlen=Module._strlen=function(){return(_strlen=Module._strlen=Module.asm.strlen).apply(null,arguments)},_towupper=Module._towupper=function(){return(_towupper=Module._towupper=Module.asm.towupper).apply(null,arguments)},_setThrew=Module._setThrew=function(){return(_setThrew=Module._setThrew=Module.asm.setThrew).apply(null,arguments)},stackSave=Module.stackSave=function(){return(stackSave=Module.stackSave=Module.asm.stackSave).apply(null,arguments)},stackRestore=Module.stackRestore=function(){return(stackRestore=Module.stackRestore=Module.asm.stackRestore).apply(null,arguments)},stackAlloc=Module.stackAlloc=function(){return(stackAlloc=Module.stackAlloc=Module.asm.stackAlloc).apply(null,arguments)},__Znwm=Module.__Znwm=function(){return(__Znwm=Module.__Znwm=Module.asm._Znwm).apply(null,arguments)},__ZdlPv=Module.__ZdlPv=function(){return(__ZdlPv=Module.__ZdlPv=Module.asm._ZdlPv).apply(null,arguments)},__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev=Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev=function(){return(__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev=Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev=Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev).apply(null,arguments)},__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm=Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm=function(){return(__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm=Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm=Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm).apply(null,arguments)},__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm=Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm=function(){return(__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm=Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm=Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm).apply(null,arguments)},__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm=Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm=function(){return(__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm=Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm=Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm).apply(null,arguments)},__ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm=Module.__ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm=function(){return(__ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm=Module.__ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm=Module.asm._ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm).apply(null,arguments)},__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc=Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc=function(){return(__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc=Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc=Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc).apply(null,arguments)},__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev=Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev=function(){return(__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev=Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev=Module.asm._ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev).apply(null,arguments)},__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw=Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw=function(){return(__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw=Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw=Module.asm._ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw).apply(null,arguments)},__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE6resizeEmw=Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE6resizeEmw=function(){return(__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE6resizeEmw=Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE6resizeEmw=Module.asm._ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE6resizeEmw).apply(null,arguments)},dynCall_jiji=Module.dynCall_jiji=function(){return(dynCall_jiji=Module.dynCall_jiji=Module.asm.dynCall_jiji).apply(null,arguments)},_orig$ts_parser_timeout_micros=Module._orig$ts_parser_timeout_micros=function(){return(_orig$ts_parser_timeout_micros=Module._orig$ts_parser_timeout_micros=Module.asm.orig$ts_parser_timeout_micros).apply(null,arguments)},_orig$ts_parser_set_timeout_micros=Module._orig$ts_parser_set_timeout_micros=function(){return(_orig$ts_parser_set_timeout_micros=Module._orig$ts_parser_set_timeout_micros=Module.asm.orig$ts_parser_set_timeout_micros).apply(null,arguments)},calledRun;function callMain(e){var t=Module._main;if(t){(e=e||[]).unshift(thisProgram);var r=e.length,_=stackAlloc(4*(r+1)),n=_>>2;e.forEach((e=>{HEAP32[n++]=allocateUTF8OnStack(e)})),HEAP32[n]=0;try{var s=t(r,_);return exitJS(s,!0),s}catch(e){return handleException(e)}}}Module.AsciiToString=AsciiToString,Module.stringToUTF16=stringToUTF16,dependenciesFulfilled=function e(){calledRun||run(),calledRun||(dependenciesFulfilled=e)};var dylibsLoaded=!1;function run(e){function t(){calledRun||(calledRun=!0,Module.calledRun=!0,ABORT||(initRuntime(),preMain(),Module.onRuntimeInitialized&&Module.onRuntimeInitialized(),shouldRunNow&&callMain(e),postRun()))}e=e||arguments_,runDependencies>0||!dylibsLoaded&&(preloadDylibs(),dylibsLoaded=!0,runDependencies>0)||(preRun(),runDependencies>0||(Module.setStatus?(Module.setStatus("Running..."),setTimeout((function(){setTimeout((function(){Module.setStatus("")}),1),t()}),1)):t()))}if(Module.preInit)for("function"==typeof Module.preInit&&(Module.preInit=[Module.preInit]);Module.preInit.length>0;)Module.preInit.pop()();var shouldRunNow=!0;Module.noInitialRun&&(shouldRunNow=!1),run();const C=Module,INTERNAL={},SIZE_OF_INT=4,SIZE_OF_NODE=5*SIZE_OF_INT,SIZE_OF_POINT=2*SIZE_OF_INT,SIZE_OF_RANGE=2*SIZE_OF_INT+2*SIZE_OF_POINT,ZERO_POINT={row:0,column:0},QUERY_WORD_REGEX=/[\w-.]*/g,PREDICATE_STEP_TYPE_CAPTURE=1,PREDICATE_STEP_TYPE_STRING=2,LANGUAGE_FUNCTION_REGEX=/^_?tree_sitter_\w+/;var VERSION,MIN_COMPATIBLE_VERSION,TRANSFER_BUFFER,currentParseCallback,currentLogCallback;class ParserImpl{static init(){TRANSFER_BUFFER=C._ts_init(),VERSION=getValue(TRANSFER_BUFFER,"i32"),MIN_COMPATIBLE_VERSION=getValue(TRANSFER_BUFFER+SIZE_OF_INT,"i32")}initialize(){C._ts_parser_new_wasm(),this[0]=getValue(TRANSFER_BUFFER,"i32"),this[1]=getValue(TRANSFER_BUFFER+SIZE_OF_INT,"i32")}delete(){C._ts_parser_delete(this[0]),C._free(this[1]),this[0]=0,this[1]=0}setLanguage(e){let t;if(e){if(e.constructor!==Language)throw new Error("Argument must be a Language");{t=e[0];const r=C._ts_language_version(t);if(r<MIN_COMPATIBLE_VERSION||VERSION<r)throw new Error(`Incompatible language version ${r}. Compatibility range ${MIN_COMPATIBLE_VERSION} through ${VERSION}.`)}}else t=0,e=null;return this.language=e,C._ts_parser_set_language(this[0],t),this}getLanguage(){return this.language}parse(e,t,r){if("string"==typeof e)currentParseCallback=(t,r,_)=>e.slice(t,_);else{if("function"!=typeof e)throw new Error("Argument must be a string or a function");currentParseCallback=e}this.logCallback?(currentLogCallback=this.logCallback,C._ts_parser_enable_logger_wasm(this[0],1)):(currentLogCallback=null,C._ts_parser_enable_logger_wasm(this[0],0));let _=0,n=0;if(r&&r.includedRanges){_=r.includedRanges.length,n=C._calloc(_,SIZE_OF_RANGE);let e=n;for(let t=0;t<_;t++)marshalRange(e,r.includedRanges[t]),e+=SIZE_OF_RANGE}const s=C._ts_parser_parse_wasm(this[0],this[1],t?t[0]:0,n,_);if(!s)throw currentParseCallback=null,currentLogCallback=null,new Error("Parsing failed");const a=new Tree(INTERNAL,s,this.language,currentParseCallback);return currentParseCallback=null,currentLogCallback=null,a}reset(){C._ts_parser_reset(this[0])}setTimeoutMicros(e){C._ts_parser_set_timeout_micros(this[0],e)}getTimeoutMicros(){return C._ts_parser_timeout_micros(this[0])}setLogger(e){if(e){if("function"!=typeof e)throw new Error("Logger callback must be a function")}else e=null;return this.logCallback=e,this}getLogger(){return this.logCallback}}class Tree{constructor(e,t,r,_){assertInternal(e),this[0]=t,this.language=r,this.textCallback=_}copy(){const e=C._ts_tree_copy(this[0]);return new Tree(INTERNAL,e,this.language,this.textCallback)}delete(){C._ts_tree_delete(this[0]),this[0]=0}edit(e){marshalEdit(e),C._ts_tree_edit_wasm(this[0])}get rootNode(){return C._ts_tree_root_node_wasm(this[0]),unmarshalNode(this)}getLanguage(){return this.language}walk(){return this.rootNode.walk()}getChangedRanges(e){if(e.constructor!==Tree)throw new TypeError("Argument must be a Tree");C._ts_tree_get_changed_ranges_wasm(this[0],e[0]);const t=getValue(TRANSFER_BUFFER,"i32"),r=getValue(TRANSFER_BUFFER+SIZE_OF_INT,"i32"),_=new Array(t);if(t>0){let e=r;for(let r=0;r<t;r++)_[r]=unmarshalRange(e),e+=SIZE_OF_RANGE;C._free(r)}return _}}class Node{constructor(e,t){assertInternal(e),this.tree=t}get typeId(){return marshalNode(this),C._ts_node_symbol_wasm(this.tree[0])}get type(){return this.tree.language.types[this.typeId]||"ERROR"}get endPosition(){return marshalNode(this),C._ts_node_end_point_wasm(this.tree[0]),unmarshalPoint(TRANSFER_BUFFER)}get endIndex(){return marshalNode(this),C._ts_node_end_index_wasm(this.tree[0])}get text(){return getText(this.tree,this.startIndex,this.endIndex)}isNamed(){return marshalNode(this),1===C._ts_node_is_named_wasm(this.tree[0])}hasError(){return marshalNode(this),1===C._ts_node_has_error_wasm(this.tree[0])}hasChanges(){return marshalNode(this),1===C._ts_node_has_changes_wasm(this.tree[0])}isMissing(){return marshalNode(this),1===C._ts_node_is_missing_wasm(this.tree[0])}equals(e){return this.id===e.id}child(e){return marshalNode(this),C._ts_node_child_wasm(this.tree[0],e),unmarshalNode(this.tree)}namedChild(e){return marshalNode(this),C._ts_node_named_child_wasm(this.tree[0],e),unmarshalNode(this.tree)}childForFieldId(e){return marshalNode(this),C._ts_node_child_by_field_id_wasm(this.tree[0],e),unmarshalNode(this.tree)}childForFieldName(e){const t=this.tree.language.fields.indexOf(e);if(-1!==t)return this.childForFieldId(t)}get childCount(){return marshalNode(this),C._ts_node_child_count_wasm(this.tree[0])}get namedChildCount(){return marshalNode(this),C._ts_node_named_child_count_wasm(this.tree[0])}get firstChild(){return this.child(0)}get firstNamedChild(){return this.namedChild(0)}get lastChild(){return this.child(this.childCount-1)}get lastNamedChild(){return this.namedChild(this.namedChildCount-1)}get children(){if(!this._children){marshalNode(this),C._ts_node_children_wasm(this.tree[0]);const e=getValue(TRANSFER_BUFFER,"i32"),t=getValue(TRANSFER_BUFFER+SIZE_OF_INT,"i32");if(this._children=new Array(e),e>0){let r=t;for(let t=0;t<e;t++)this._children[t]=unmarshalNode(this.tree,r),r+=SIZE_OF_NODE;C._free(t)}}return this._children}get namedChildren(){if(!this._namedChildren){marshalNode(this),C._ts_node_named_children_wasm(this.tree[0]);const e=getValue(TRANSFER_BUFFER,"i32"),t=getValue(TRANSFER_BUFFER+SIZE_OF_INT,"i32");if(this._namedChildren=new Array(e),e>0){let r=t;for(let t=0;t<e;t++)this._namedChildren[t]=unmarshalNode(this.tree,r),r+=SIZE_OF_NODE;C._free(t)}}return this._namedChildren}descendantsOfType(e,t,r){Array.isArray(e)||(e=[e]),t||(t=ZERO_POINT),r||(r=ZERO_POINT);const _=[],n=this.tree.language.types;for(let t=0,r=n.length;t<r;t++)e.includes(n[t])&&_.push(t);const s=C._malloc(SIZE_OF_INT*_.length);for(let e=0,t=_.length;e<t;e++)setValue(s+e*SIZE_OF_INT,_[e],"i32");marshalNode(this),C._ts_node_descendants_of_type_wasm(this.tree[0],s,_.length,t.row,t.column,r.row,r.column);const a=getValue(TRANSFER_BUFFER,"i32"),o=getValue(TRANSFER_BUFFER+SIZE_OF_INT,"i32"),i=new Array(a);if(a>0){let e=o;for(let t=0;t<a;t++)i[t]=unmarshalNode(this.tree,e),e+=SIZE_OF_NODE}return C._free(o),C._free(s),i}get nextSibling(){return marshalNode(this),C._ts_node_next_sibling_wasm(this.tree[0]),unmarshalNode(this.tree)}get previousSibling(){return marshalNode(this),C._ts_node_prev_sibling_wasm(this.tree[0]),unmarshalNode(this.tree)}get nextNamedSibling(){return marshalNode(this),C._ts_node_next_named_sibling_wasm(this.tree[0]),unmarshalNode(this.tree)}get previousNamedSibling(){return marshalNode(this),C._ts_node_prev_named_sibling_wasm(this.tree[0]),unmarshalNode(this.tree)}get parent(){return marshalNode(this),C._ts_node_parent_wasm(this.tree[0]),unmarshalNode(this.tree)}descendantForIndex(e,t=e){if("number"!=typeof e||"number"!=typeof t)throw new Error("Arguments must be numbers");marshalNode(this);let r=TRANSFER_BUFFER+SIZE_OF_NODE;return setValue(r,e,"i32"),setValue(r+SIZE_OF_INT,t,"i32"),C._ts_node_descendant_for_index_wasm(this.tree[0]),unmarshalNode(this.tree)}namedDescendantForIndex(e,t=e){if("number"!=typeof e||"number"!=typeof t)throw new Error("Arguments must be numbers");marshalNode(this);let r=TRANSFER_BUFFER+SIZE_OF_NODE;return setValue(r,e,"i32"),setValue(r+SIZE_OF_INT,t,"i32"),C._ts_node_named_descendant_for_index_wasm(this.tree[0]),unmarshalNode(this.tree)}descendantForPosition(e,t=e){if(!isPoint(e)||!isPoint(t))throw new Error("Arguments must be {row, column} objects");marshalNode(this);let r=TRANSFER_BUFFER+SIZE_OF_NODE;return marshalPoint(r,e),marshalPoint(r+SIZE_OF_POINT,t),C._ts_node_descendant_for_position_wasm(this.tree[0]),unmarshalNode(this.tree)}namedDescendantForPosition(e,t=e){if(!isPoint(e)||!isPoint(t))throw new Error("Arguments must be {row, column} objects");marshalNode(this);let r=TRANSFER_BUFFER+SIZE_OF_NODE;return marshalPoint(r,e),marshalPoint(r+SIZE_OF_POINT,t),C._ts_node_named_descendant_for_position_wasm(this.tree[0]),unmarshalNode(this.tree)}walk(){return marshalNode(this),C._ts_tree_cursor_new_wasm(this.tree[0]),new TreeCursor(INTERNAL,this.tree)}toString(){marshalNode(this);const e=C._ts_node_to_string_wasm(this.tree[0]),t=AsciiToString(e);return C._free(e),t}}class TreeCursor{constructor(e,t){assertInternal(e),this.tree=t,unmarshalTreeCursor(this)}delete(){marshalTreeCursor(this),C._ts_tree_cursor_delete_wasm(this.tree[0]),this[0]=this[1]=this[2]=0}reset(e){marshalNode(e),marshalTreeCursor(this,TRANSFER_BUFFER+SIZE_OF_NODE),C._ts_tree_cursor_reset_wasm(this.tree[0]),unmarshalTreeCursor(this)}get nodeType(){return this.tree.language.types[this.nodeTypeId]||"ERROR"}get nodeTypeId(){return marshalTreeCursor(this),C._ts_tree_cursor_current_node_type_id_wasm(this.tree[0])}get nodeId(){return marshalTreeCursor(this),C._ts_tree_cursor_current_node_id_wasm(this.tree[0])}get nodeIsNamed(){return marshalTreeCursor(this),1===C._ts_tree_cursor_current_node_is_named_wasm(this.tree[0])}get nodeIsMissing(){return marshalTreeCursor(this),1===C._ts_tree_cursor_current_node_is_missing_wasm(this.tree[0])}get nodeText(){marshalTreeCursor(this);const e=C._ts_tree_cursor_start_index_wasm(this.tree[0]),t=C._ts_tree_cursor_end_index_wasm(this.tree[0]);return getText(this.tree,e,t)}get startPosition(){return marshalTreeCursor(this),C._ts_tree_cursor_start_position_wasm(this.tree[0]),unmarshalPoint(TRANSFER_BUFFER)}get endPosition(){return marshalTreeCursor(this),C._ts_tree_cursor_end_position_wasm(this.tree[0]),unmarshalPoint(TRANSFER_BUFFER)}get startIndex(){return marshalTreeCursor(this),C._ts_tree_cursor_start_index_wasm(this.tree[0])}get endIndex(){return marshalTreeCursor(this),C._ts_tree_cursor_end_index_wasm(this.tree[0])}currentNode(){return marshalTreeCursor(this),C._ts_tree_cursor_current_node_wasm(this.tree[0]),unmarshalNode(this.tree)}currentFieldId(){return marshalTreeCursor(this),C._ts_tree_cursor_current_field_id_wasm(this.tree[0])}currentFieldName(){return this.tree.language.fields[this.currentFieldId()]}gotoFirstChild(){marshalTreeCursor(this);const e=C._ts_tree_cursor_goto_first_child_wasm(this.tree[0]);return unmarshalTreeCursor(this),1===e}gotoNextSibling(){marshalTreeCursor(this);const e=C._ts_tree_cursor_goto_next_sibling_wasm(this.tree[0]);return unmarshalTreeCursor(this),1===e}gotoParent(){marshalTreeCursor(this);const e=C._ts_tree_cursor_goto_parent_wasm(this.tree[0]);return unmarshalTreeCursor(this),1===e}}class Language{constructor(e,t){assertInternal(e),this[0]=t,this.types=new Array(C._ts_language_symbol_count(this[0]));for(let e=0,t=this.types.length;e<t;e++)C._ts_language_symbol_type(this[0],e)<2&&(this.types[e]=UTF8ToString(C._ts_language_symbol_name(this[0],e)));this.fields=new Array(C._ts_language_field_count(this[0])+1);for(let e=0,t=this.fields.length;e<t;e++){const t=C._ts_language_field_name_for_id(this[0],e);this.fields[e]=0!==t?UTF8ToString(t):null}}get version(){return C._ts_language_version(this[0])}get fieldCount(){return this.fields.length-1}fieldIdForName(e){const t=this.fields.indexOf(e);return-1!==t?t:null}fieldNameForId(e){return this.fields[e]||null}idForNodeType(e,t){const r=lengthBytesUTF8(e),_=C._malloc(r+1);stringToUTF8(e,_,r+1);const n=C._ts_language_symbol_for_name(this[0],_,r,t);return C._free(_),n||null}get nodeTypeCount(){return C._ts_language_symbol_count(this[0])}nodeTypeForId(e){const t=C._ts_language_symbol_name(this[0],e);return t?UTF8ToString(t):null}nodeTypeIsNamed(e){return!!C._ts_language_type_is_named_wasm(this[0],e)}nodeTypeIsVisible(e){return!!C._ts_language_type_is_visible_wasm(this[0],e)}query(e){const t=lengthBytesUTF8(e),r=C._malloc(t+1);stringToUTF8(e,r,t+1);const _=C._ts_query_new(this[0],r,t,TRANSFER_BUFFER,TRANSFER_BUFFER+SIZE_OF_INT);if(!_){const t=getValue(TRANSFER_BUFFER+SIZE_OF_INT,"i32"),_=UTF8ToString(r,getValue(TRANSFER_BUFFER,"i32")).length,n=e.substr(_,100).split("\n")[0];let s,a=n.match(QUERY_WORD_REGEX)[0];switch(t){case 2:s=new RangeError(`Bad node name '${a}'`);break;case 3:s=new RangeError(`Bad field name '${a}'`);break;case 4:s=new RangeError(`Bad capture name @${a}`);break;case 5:s=new TypeError(`Bad pattern structure at offset ${_}: '${n}'...`),a="";break;default:s=new SyntaxError(`Bad syntax at offset ${_}: '${n}'...`),a=""}throw s.index=_,s.length=a.length,C._free(r),s}const n=C._ts_query_string_count(_),s=C._ts_query_capture_count(_),a=C._ts_query_pattern_count(_),o=new Array(s),i=new Array(n);for(let e=0;e<s;e++){const t=C._ts_query_capture_name_for_id(_,e,TRANSFER_BUFFER),r=getValue(TRANSFER_BUFFER,"i32");o[e]=UTF8ToString(t,r)}for(let e=0;e<n;e++){const t=C._ts_query_string_value_for_id(_,e,TRANSFER_BUFFER),r=getValue(TRANSFER_BUFFER,"i32");i[e]=UTF8ToString(t,r)}const l=new Array(a),u=new Array(a),d=new Array(a),c=new Array(a),m=new Array(a);for(let e=0;e<a;e++){const t=C._ts_query_predicates_for_pattern(_,e,TRANSFER_BUFFER),r=getValue(TRANSFER_BUFFER,"i32");c[e]=[],m[e]=[];const n=[];let s=t;for(let t=0;t<r;t++){const t=getValue(s,"i32");s+=SIZE_OF_INT;const r=getValue(s,"i32");if(s+=SIZE_OF_INT,t===PREDICATE_STEP_TYPE_CAPTURE)n.push({type:"capture",name:o[r]});else if(t===PREDICATE_STEP_TYPE_STRING)n.push({type:"string",value:i[r]});else if(n.length>0){if("string"!==n[0].type)throw new Error("Predicates must begin with a literal value");const t=n[0].value;let r=!0;switch(t){case"not-eq?":r=!1;case"eq?":if(3!==n.length)throw new Error("Wrong number of arguments to `#eq?` predicate. Expected 2, got "+(n.length-1));if("capture"!==n[1].type)throw new Error(`First argument of \`#eq?\` predicate must be a capture. Got "${n[1].value}"`);if("capture"===n[2].type){const t=n[1].name,_=n[2].name;m[e].push((function(e){let n,s;for(const r of e)r.name===t&&(n=r.node),r.name===_&&(s=r.node);return void 0===n||void 0===s||n.text===s.text===r}))}else{const t=n[1].name,_=n[2].value;m[e].push((function(e){for(const n of e)if(n.name===t)return n.node.text===_===r;return!0}))}break;case"not-match?":r=!1;case"match?":if(3!==n.length)throw new Error(`Wrong number of arguments to \`#match?\` predicate. Expected 2, got ${n.length-1}.`);if("capture"!==n[1].type)throw new Error(`First argument of \`#match?\` predicate must be a capture. Got "${n[1].value}".`);if("string"!==n[2].type)throw new Error(`Second argument of \`#match?\` predicate must be a string. Got @${n[2].value}.`);const _=n[1].name,s=new RegExp(n[2].value);m[e].push((function(e){for(const t of e)if(t.name===_)return s.test(t.node.text)===r;return!0}));break;case"set!":if(n.length<2||n.length>3)throw new Error(`Wrong number of arguments to \`#set!\` predicate. Expected 1 or 2. Got ${n.length-1}.`);if(n.some((e=>"string"!==e.type)))throw new Error('Arguments to `#set!` predicate must be a strings.".');l[e]||(l[e]={}),l[e][n[1].value]=n[2]?n[2].value:null;break;case"is?":case"is-not?":if(n.length<2||n.length>3)throw new Error(`Wrong number of arguments to \`#${t}\` predicate. Expected 1 or 2. Got ${n.length-1}.`);if(n.some((e=>"string"!==e.type)))throw new Error(`Arguments to \`#${t}\` predicate must be a strings.".`);const a="is?"===t?u:d;a[e]||(a[e]={}),a[e][n[1].value]=n[2]?n[2].value:null;break;default:c[e].push({operator:t,operands:n.slice(1)})}n.length=0}}Object.freeze(l[e]),Object.freeze(u[e]),Object.freeze(d[e])}return C._free(r),new Query(INTERNAL,_,o,m,c,Object.freeze(l),Object.freeze(u),Object.freeze(d))}static load(e){let t;if(e instanceof Uint8Array)t=Promise.resolve(e);else{const r=e;if("undefined"!=typeof process&&process.versions&&process.versions.node){const e=__nccwpck_require__(896);t=Promise.resolve(e.readFileSync(r))}else t=fetch(r).then((e=>e.arrayBuffer().then((t=>{if(e.ok)return new Uint8Array(t);{const r=new TextDecoder("utf-8").decode(t);throw new Error(`Language.load failed with status ${e.status}.\n\n${r}`)}}))))}const r="function"==typeof loadSideModule?loadSideModule:loadWebAssemblyModule;return t.then((e=>r(e,{loadAsync:!0}))).then((e=>{const t=Object.keys(e),r=t.find((e=>LANGUAGE_FUNCTION_REGEX.test(e)&&!e.includes("external_scanner_")));r||console.log(`Couldn't find language function in WASM file. Symbols:\n${JSON.stringify(t,null,2)}`);const _=e[r]();return new Language(INTERNAL,_)}))}}class Query{constructor(e,t,r,_,n,s,a,o){assertInternal(e),this[0]=t,this.captureNames=r,this.textPredicates=_,this.predicates=n,this.setProperties=s,this.assertedProperties=a,this.refutedProperties=o,this.exceededMatchLimit=!1}delete(){C._ts_query_delete(this[0]),this[0]=0}matches(e,t,r,_){t||(t=ZERO_POINT),r||(r=ZERO_POINT),_||(_={});let n=_.matchLimit;if(void 0===n)n=0;else if("number"!=typeof n)throw new Error("Arguments must be numbers");marshalNode(e),C._ts_query_matches_wasm(this[0],e.tree[0],t.row,t.column,r.row,r.column,n);const s=getValue(TRANSFER_BUFFER,"i32"),a=getValue(TRANSFER_BUFFER+SIZE_OF_INT,"i32"),o=getValue(TRANSFER_BUFFER+2*SIZE_OF_INT,"i32"),i=new Array(s);this.exceededMatchLimit=!!o;let l=0,u=a;for(let t=0;t<s;t++){const r=getValue(u,"i32");u+=SIZE_OF_INT;const _=getValue(u,"i32");u+=SIZE_OF_INT;const n=new Array(_);if(u=unmarshalCaptures(this,e.tree,u,n),this.textPredicates[r].every((e=>e(n)))){i[l++]={pattern:r,captures:n};const e=this.setProperties[r];e&&(i[t].setProperties=e);const _=this.assertedProperties[r];_&&(i[t].assertedProperties=_);const s=this.refutedProperties[r];s&&(i[t].refutedProperties=s)}}return i.length=l,C._free(a),i}captures(e,t,r,_){t||(t=ZERO_POINT),r||(r=ZERO_POINT),_||(_={});let n=_.matchLimit;if(void 0===n)n=0;else if("number"!=typeof n)throw new Error("Arguments must be numbers");marshalNode(e),C._ts_query_captures_wasm(this[0],e.tree[0],t.row,t.column,r.row,r.column,n);const s=getValue(TRANSFER_BUFFER,"i32"),a=getValue(TRANSFER_BUFFER+SIZE_OF_INT,"i32"),o=getValue(TRANSFER_BUFFER+2*SIZE_OF_INT,"i32"),i=[];this.exceededMatchLimit=!!o;const l=[];let u=a;for(let t=0;t<s;t++){const t=getValue(u,"i32");u+=SIZE_OF_INT;const r=getValue(u,"i32");u+=SIZE_OF_INT;const _=getValue(u,"i32");if(u+=SIZE_OF_INT,l.length=r,u=unmarshalCaptures(this,e.tree,u,l),this.textPredicates[t].every((e=>e(l)))){const e=l[_],r=this.setProperties[t];r&&(e.setProperties=r);const n=this.assertedProperties[t];n&&(e.assertedProperties=n);const s=this.refutedProperties[t];s&&(e.refutedProperties=s),i.push(e)}}return C._free(a),i}predicatesForPattern(e){return this.predicates[e]}didExceedMatchLimit(){return this.exceededMatchLimit}}function getText(e,t,r){const _=r-t;let n=e.textCallback(t,null,r);for(t+=n.length;t<r;){const _=e.textCallback(t,null,r);if(!(_&&_.length>0))break;t+=_.length,n+=_}return t>r&&(n=n.slice(0,_)),n}function unmarshalCaptures(e,t,r,_){for(let n=0,s=_.length;n<s;n++){const s=getValue(r,"i32"),a=unmarshalNode(t,r+=SIZE_OF_INT);r+=SIZE_OF_NODE,_[n]={name:e.captureNames[s],node:a}}return r}function assertInternal(e){if(e!==INTERNAL)throw new Error("Illegal constructor")}function isPoint(e){return e&&"number"==typeof e.row&&"number"==typeof e.column}function marshalNode(e){let t=TRANSFER_BUFFER;setValue(t,e.id,"i32"),t+=SIZE_OF_INT,setValue(t,e.startIndex,"i32"),t+=SIZE_OF_INT,setValue(t,e.startPosition.row,"i32"),t+=SIZE_OF_INT,setValue(t,e.startPosition.column,"i32"),t+=SIZE_OF_INT,setValue(t,e[0],"i32")}function unmarshalNode(e,t=TRANSFER_BUFFER){const r=getValue(t,"i32");if(0===r)return null;const _=getValue(t+=SIZE_OF_INT,"i32"),n=getValue(t+=SIZE_OF_INT,"i32"),s=getValue(t+=SIZE_OF_INT,"i32"),a=getValue(t+=SIZE_OF_INT,"i32"),o=new Node(INTERNAL,e);return o.id=r,o.startIndex=_,o.startPosition={row:n,column:s},o[0]=a,o}function marshalTreeCursor(e,t=TRANSFER_BUFFER){setValue(t+0*SIZE_OF_INT,e[0],"i32"),setValue(t+1*SIZE_OF_INT,e[1],"i32"),setValue(t+2*SIZE_OF_INT,e[2],"i32")}function unmarshalTreeCursor(e){e[0]=getValue(TRANSFER_BUFFER+0*SIZE_OF_INT,"i32"),e[1]=getValue(TRANSFER_BUFFER+1*SIZE_OF_INT,"i32"),e[2]=getValue(TRANSFER_BUFFER+2*SIZE_OF_INT,"i32")}function marshalPoint(e,t){setValue(e,t.row,"i32"),setValue(e+SIZE_OF_INT,t.column,"i32")}function unmarshalPoint(e){return{row:getValue(e,"i32"),column:getValue(e+SIZE_OF_INT,"i32")}}function marshalRange(e,t){marshalPoint(e,t.startPosition),marshalPoint(e+=SIZE_OF_POINT,t.endPosition),setValue(e+=SIZE_OF_POINT,t.startIndex,"i32"),setValue(e+=SIZE_OF_INT,t.endIndex,"i32"),e+=SIZE_OF_INT}function unmarshalRange(e){const t={};return t.startPosition=unmarshalPoint(e),e+=SIZE_OF_POINT,t.endPosition=unmarshalPoint(e),e+=SIZE_OF_POINT,t.startIndex=getValue(e,"i32"),e+=SIZE_OF_INT,t.endIndex=getValue(e,"i32"),t}function marshalEdit(e){let t=TRANSFER_BUFFER;marshalPoint(t,e.startPosition),t+=SIZE_OF_POINT,marshalPoint(t,e.oldEndPosition),t+=SIZE_OF_POINT,marshalPoint(t,e.newEndPosition),t+=SIZE_OF_POINT,setValue(t,e.startIndex,"i32"),t+=SIZE_OF_INT,setValue(t,e.oldEndIndex,"i32"),t+=SIZE_OF_INT,setValue(t,e.newEndIndex,"i32"),t+=SIZE_OF_INT}for(const e of Object.getOwnPropertyNames(ParserImpl.prototype))Object.defineProperty(Parser.prototype,e,{value:ParserImpl.prototype[e],enumerable:!1,writable:!1});Parser.Language=Language,Module.onRuntimeInitialized=()=>{ParserImpl.init(),resolveInitPromise()}})))}}return Parser}(); true&&(module.exports=TreeSitter);


/***/ }),

/***/ 122:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.runChecks = runChecks;
exports.closestKey = closestKey;
// `removed` are flag calls the PR deleted (see removedReferences), checked only against experiments.
function runChecks(references, flags, removed = []) {
    const byKey = new Map(flags.map((f) => [f.key, f]));
    const findings = [];
    const removedFindings = [...groupByKey(removed)].flatMap(([key, refs]) => {
        const flag = byKey.get(key);
        return flag ? experimentRemovedFindings(flag, refs) : [];
    });
    const removedKeys = new Set(removedFindings.map((f) => f.key));
    findings.push(...removedFindings);
    for (const [key, refs] of groupByKey(references)) {
        const flag = byKey.get(key);
        if (!flag) {
            const suggestion = closestKey(key, flags.filter((f) => !f.archived).map((f) => f.key));
            findings.push({
                severity: "error",
                kind: "missing",
                key,
                message: suggestion ? `Doesn't exist. Did you mean \`${suggestion}\`?` : "Doesn't exist in this project",
                create: suggestion ? undefined : { variants: inferVariants(refs) },
                fix: suggestion ? { from: key, to: suggestion } : undefined,
                references: refs,
            });
        }
        else if (flag.archived) {
            findings.push({ severity: "error", kind: "archived", key, flagId: flag.id, message: "Archived, but still used", references: refs });
        }
        else if (!flag.active) {
            findings.push({ severity: "warning", kind: "disabled", key, flagId: flag.id, message: "Disabled, so it always evaluates to false", references: refs });
        }
        else if (flag.stale) {
            findings.push({
                severity: "warning",
                kind: "stale",
                key,
                flagId: flag.id,
                message: "Looks stale (fully rolled out or not evaluated in 30+ days). Consider removing it",
                references: refs,
            });
        }
        if (flag && !flag.archived) {
            findings.push(...variantFindings(flag, refs), ...runtimeFindings(flag, refs), 
            // A removal error already covers the experiment; don't also warn about the remaining calls.
            ...(removedKeys.has(key) ? [] : experimentFindings(flag, refs)));
        }
    }
    for (const ref of references.filter((r) => r.key === null)) {
        findings.push({
            severity: "warning",
            kind: "dynamic",
            key: null,
            message: "Dynamic key, can't be checked",
            references: [ref],
        });
    }
    return findings;
}
// Compares the variant names used in code with the flag's real variants. Each finding points at
// the comparison itself, not the call, so the annotation lands on the line with the wrong name.
function variantFindings(flag, refs) {
    const unknown = new Map();
    for (const ref of refs) {
        for (const use of ref.variants) {
            if (flag.variants?.includes(use.value))
                continue;
            const at = { ...ref, line: use.line, column: use.column };
            unknown.set(use.value, [...(unknown.get(use.value) ?? []), at]);
        }
    }
    return [...unknown].map(([value, at]) => {
        if (flag.variants === null) {
            return {
                severity: "warning",
                kind: "variant",
                key: flag.key,
                flagId: flag.id,
                message: `Boolean flag compared to \`${value}\`, which never matches`,
                references: at,
            };
        }
        const suggestion = closestKey(value, flag.variants);
        return {
            severity: "error",
            kind: "variant",
            key: flag.key,
            flagId: flag.id,
            message: suggestion
                ? `Variant \`${value}\` doesn't exist. Did you mean \`${suggestion}\`?`
                : `Variant \`${value}\` doesn't exist. Variants: ${flag.variants.map((v) => `\`${v}\``).join(", ")}`,
            fix: suggestion ? { from: value, to: suggestion } : undefined,
            references: at,
        };
    });
}
// A flag limited to one evaluation runtime is never served to the other kind of SDK, so the
// call silently returns undefined/false there.
function runtimeFindings(flag, refs) {
    const limitedTo = flag.evaluationRuntime;
    if (limitedTo !== "client" && limitedTo !== "server")
        return [];
    const wrong = refs.filter((r) => r.runtime !== null && r.runtime !== limitedTo);
    if (wrong.length === 0)
        return [];
    const message = limitedTo === "server"
        ? "Set to evaluate on the server only, so it's always off in client code"
        : "Set to evaluate in client SDKs only, so it's always off in server code";
    return [{ severity: "error", kind: "runtime", key: flag.key, flagId: flag.id, message, references: wrong }];
}
// Only says the PR touches files that use the flag: removed call sites aren't visible from the head commit.
function experimentFindings(flag, refs) {
    if (flag.runningExperiments.length === 0)
        return [];
    const names = flag.runningExperiments.map((e) => `"${e.name}"`).join(", ");
    return [
        {
            severity: "warning",
            kind: "experiment",
            key: flag.key,
            flagId: flag.id,
            message: `Drives the running experiment${flag.runningExperiments.length > 1 ? "s" : ""} ${names}. Changing this code can skew the results`,
            links: flag.runningExperiments.map((e) => ({ label: `View ${e.name}`, path: `experiments/${e.id}` })),
            references: refs,
        },
    ];
}
function experimentRemovedFindings(flag, removed) {
    if (flag.runningExperiments.length === 0)
        return [];
    const names = flag.runningExperiments.map((e) => `"${e.name}"`).join(", ");
    return [
        {
            severity: "error",
            kind: "experiment-removed",
            key: flag.key,
            flagId: flag.id,
            message: `This PR removes code for a flag that drives the running experiment${flag.runningExperiments.length > 1 ? "s" : ""} ${names}. Removing it now breaks the results`,
            links: flag.runningExperiments.map((e) => ({ label: `View ${e.name}`, path: `experiments/${e.id}` })),
            references: removed,
        },
    ];
}
// Variant names the code compares against, with `control` first since PostHog and experiments expect it.
// null when the code never compares the value, so the flag is created as a boolean.
function inferVariants(refs) {
    const used = [...new Set(refs.flatMap((r) => r.variants.map((v) => v.value)))];
    if (used.length === 0)
        return null;
    return used.includes("control") ? used : ["control", ...used];
}
function groupByKey(references) {
    const groups = new Map();
    for (const ref of references) {
        if (ref.key === null)
            continue;
        groups.set(ref.key, [...(groups.get(ref.key) ?? []), ref]);
    }
    return groups;
}
function closestKey(key, candidates) {
    // Allow roughly one typo per 4 characters, capped at 3.
    const maxDistance = Math.min(3, Math.max(1, Math.floor(key.length / 4)));
    let best = null;
    let bestDistance = Infinity;
    for (const candidate of candidates) {
        const distance = levenshtein(key, candidate);
        if (distance <= maxDistance && distance < bestDistance) {
            best = candidate;
            bestDistance = distance;
        }
    }
    return best;
}
function levenshtein(a, b) {
    let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
        const current = [i];
        for (let j = 1; j <= b.length; j++) {
            current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        }
        previous = current;
    }
    return previous[b.length];
}


/***/ }),

/***/ 581:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const path_1 = __importDefault(__nccwpck_require__(928));
const util_1 = __nccwpck_require__(23);
const checks_1 = __nccwpck_require__(122);
const posthog_1 = __nccwpck_require__(139);
const report_1 = __nccwpck_require__(665);
const scan_1 = __nccwpck_require__(798);
const USAGE = `Usage: flag-lint --project-id <id> [--dir .] [--host https://us.posthog.com] [--base <git ref>] [--wrappers useFlag,isOn] [--format text|markdown]

Reads the personal API key from POSTHOG_API_KEY. Without --base, scans every supported file.`;
async function main() {
    const { values } = (0, util_1.parseArgs)({
        options: {
            dir: { type: "string", default: "." },
            "project-id": { type: "string" },
            host: { type: "string", default: "https://us.posthog.com" },
            base: { type: "string" },
            wrappers: { type: "string", default: "" },
            format: { type: "string", default: "text" },
            help: { type: "boolean", default: false },
        },
    });
    const apiKey = process.env.POSTHOG_API_KEY;
    if (values.help || !values["project-id"] || !apiKey) {
        console.error(USAGE);
        process.exit(values.help ? 0 : 2);
    }
    const dir = path_1.default.resolve(values.dir);
    const wrappers = values.wrappers.split(",").map((w) => w.trim()).filter(Boolean);
    const files = (0, scan_1.listFiles)(dir, values.base);
    const references = await (0, scan_1.scan)(dir, files, wrappers);
    const flags = await (0, posthog_1.fetchFlags)({ host: values.host, projectId: values["project-id"], apiKey });
    const findings = (0, checks_1.runChecks)(references, flags);
    process.stdout.write(values.format === "markdown"
        ? (0, report_1.renderMarkdown)(findings, references, { host: values.host, projectId: values["project-id"] })
        : (0, report_1.renderText)(findings, references.length));
    process.exit(findings.some((f) => f.severity === "error") ? 1 : 0);
}
main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(2);
});


/***/ }),

/***/ 542:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.languageFor = languageFor;
exports.extractReferences = extractReferences;
const fs_1 = __importDefault(__nccwpck_require__(896));
const module_1 = __nccwpck_require__(339);
const path_1 = __importDefault(__nccwpck_require__(928));
const Parser = __nccwpck_require__(171);
const JS_METHODS = [
    "isFeatureEnabled",
    "getFeatureFlag",
    "getFeatureFlagPayload",
    "getFeatureFlagResult",
    "useFeatureFlagEnabled",
    "useFeatureFlagVariantKey",
    "useFeatureFlagPayload",
];
const PY_METHODS = [
    "feature_enabled",
    "is_feature_enabled",
    "get_feature_flag",
    "get_feature_flag_payload",
    "get_feature_flag_result",
];
// Snapshot API from evaluateFlags(). The names are generic, so only match them as method calls.
const JS_SNAPSHOT_METHODS = ["isEnabled", "getFlag", "getPayload"];
const PY_SNAPSHOT_METHODS = ["is_enabled", "get_flag", "get_payload"];
// React bindings only exist in the browser SDK; the evaluateFlags() snapshot only in server SDKs.
const CLIENT_METHODS = new Set(["useFeatureFlagEnabled", "useFeatureFlagVariantKey", "useFeatureFlagPayload", "PostHogFeature"]);
const CLIENT_PACKAGES = /^(posthog-js|posthog-react-native|@posthog\/react)(\/|$)/;
const SERVER_PACKAGES = /^posthog-node(\/|$)/;
// Calls whose return value is the variant name, so comparisons against them are worth checking.
const VARIANT_METHODS = new Set(["getFeatureFlag", "useFeatureFlagVariantKey", "getFlag", "get_feature_flag", "get_flag"]);
const EXTENSIONS = {
    ".ts": "typescript",
    ".mts": "typescript",
    ".cts": "typescript",
    ".tsx": "tsx",
    ".js": "javascript",
    ".jsx": "javascript",
    ".mjs": "javascript",
    ".cjs": "javascript",
    ".py": "python",
};
function languageFor(file) {
    return EXTENSIONS[path_1.default.extname(file)] ?? null;
}
// Bundled: dist/<entry>/wasm (see scripts/copy-wasm.js). From source (tests): node_modules.
// The resolve goes through createRequire with a computed path so ncc doesn't try to bundle the .wasm.
function wasmPath(name) {
    const bundled = path_1.default.join(__dirname, "wasm", name);
    if (fs_1.default.existsSync(bundled))
        return bundled;
    const pkg = name === "tree-sitter.wasm" ? "web-tree-sitter" : "tree-sitter-wasms/out";
    return (0, module_1.createRequire)(__filename).resolve([pkg, name].join("/"));
}
let initialized = null;
const languages = new Map();
async function parserFor(language) {
    initialized ??= Parser.init({ locateFile: () => wasmPath("tree-sitter.wasm") });
    await initialized;
    if (!languages.has(language)) {
        languages.set(language, Parser.Language.load(wasmPath(`tree-sitter-${language}.wasm`)));
    }
    const parser = new Parser();
    parser.setLanguage(await languages.get(language));
    return parser;
}
async function extractReferences(source, file, options = {}) {
    const language = languageFor(file);
    if (!language)
        return [];
    const parser = await parserFor(language);
    const tree = parser.parse(source);
    const isPython = language === "python";
    const methods = new Set([...(isPython ? PY_METHODS : JS_METHODS), ...(options.wrappers ?? [])]);
    const snapshotMethods = new Set(isPython ? PY_SNAPSHOT_METHODS : JS_SNAPSHOT_METHODS);
    const fileRuntime = isPython ? "server" : runtimeFromImports(source);
    const runtimeOf = (method) => isPython ? "server" : CLIENT_METHODS.has(method) ? "client" : snapshotMethods.has(method) ? "server" : fileRuntime;
    const references = [];
    const visit = (node) => {
        if (node.type === (isPython ? "call" : "call_expression")) {
            const ref = isPython
                ? pythonCall(node, methods, snapshotMethods)
                : jsCall(node, methods, snapshotMethods);
            if (ref) {
                const variants = VARIANT_METHODS.has(ref.method) ? variantUses(node, isPython) : [];
                references.push({ ...ref, variants, runtime: runtimeOf(ref.method), file, line: node.startPosition.row + 1, column: node.startPosition.column + 1 });
            }
        }
        else if (!isPython && (node.type === "jsx_opening_element" || node.type === "jsx_self_closing_element")) {
            const ref = jsxFeature(node);
            if (ref)
                references.push({ ...ref, runtime: "client", file, line: node.startPosition.row + 1, column: node.startPosition.column + 1 });
        }
        for (const child of node.namedChildren)
            visit(child);
    };
    visit(tree.rootNode);
    tree.delete();
    parser.delete();
    return references;
}
// `posthog.isFeatureEnabled` exists in both posthog-js and posthog-node, so the file's imports decide.
// A file importing both (or neither) stays unknown rather than guessing.
function runtimeFromImports(source) {
    const packages = [...source.matchAll(/(?:from\s+|require\(\s*|import\(\s*)["']([^"']+)["']/g)].map((m) => m[1]);
    const client = packages.some((p) => CLIENT_PACKAGES.test(p));
    const server = packages.some((p) => SERVER_PACKAGES.test(p));
    return client === server ? null : client ? "client" : "server";
}
function jsCall(node, methods, snapshotMethods) {
    const fn = node.childForFieldName("function");
    if (!fn)
        return null;
    let method = null;
    if (fn.type === "identifier") {
        method = methods.has(fn.text) ? fn.text : null;
    }
    else if (fn.type === "member_expression") {
        const name = fn.childForFieldName("property")?.text ?? "";
        method = methods.has(name) || snapshotMethods.has(name) ? name : null;
    }
    if (!method)
        return null;
    const arg = node.childForFieldName("arguments")?.namedChildren[0];
    if (!arg)
        return null;
    return { method, key: jsStringValue(arg), expression: arg.text };
}
function jsStringValue(node) {
    if (node.type === "string")
        return node.text.slice(1, -1);
    if (node.type === "template_string" && !node.namedChildren.some((c) => c.type === "template_substitution")) {
        return node.text.slice(1, -1);
    }
    return null;
}
function jsxFeature(node) {
    if (node.childForFieldName("name")?.text !== "PostHogFeature")
        return null;
    let match = null;
    const variants = [];
    for (const attr of node.namedChildren) {
        if (attr.type !== "jsx_attribute")
            continue;
        const [name, value] = attr.namedChildren;
        if (!value)
            continue;
        // flag="key" or flag={"key"}; same for match="variant" (match={true} is the boolean form)
        const inner = value.type === "jsx_expression" ? value.namedChildren[0] : value;
        const literal = inner ? jsStringValue(inner) : null;
        if (name?.text === "flag")
            match = { method: "PostHogFeature", key: literal, expression: value.text, variants };
        if (name?.text === "match" && literal !== null)
            variants.push(variantUse(literal, inner));
    }
    return match;
}
function variantUse(value, node) {
    return { value, line: node.startPosition.row + 1, column: node.startPosition.column + 1 };
}
const sameNode = (a, b) => !!a && a.startIndex === b.startIndex && a.endIndex === b.endIndex && a.type === b.type;
// Strings the flag's value gets compared to, either directly (`getFeatureFlag("k") === "a"`,
// `switch`/`match` on the call) or through a variable assigned from the call in the same function.
function variantUses(call, isPython) {
    const value = unwrap(call);
    const uses = comparisons(value, isPython);
    const parent = value.parent;
    let name = null;
    if (parent?.type === "variable_declarator" && sameNode(parent.childForFieldName("value"), value)) {
        name = parent.childForFieldName("name");
    }
    else if ((parent?.type === "assignment" || parent?.type === "assignment_expression") && sameNode(parent.childForFieldName("right"), value)) {
        name = parent.childForFieldName("left");
    }
    if (name?.type === "identifier") {
        const scope = enclosingScope(value, isPython);
        const visit = (node) => {
            if (node.type === "identifier" && node.text === name.text && !sameNode(node, name)) {
                uses.push(...comparisons(unwrap(node), isPython));
            }
            for (const child of node.namedChildren)
                visit(child);
        };
        visit(scope);
    }
    const seen = new Set();
    return uses.filter((u) => {
        const id = `${u.value}:${u.line}:${u.column}`;
        return seen.has(id) ? false : (seen.add(id), true);
    });
}
// Climb through wrappers that don't change the value: `await x`, `(x)`, `x!`.
function unwrap(node) {
    let current = node;
    while (current.parent &&
        ["await_expression", "await", "parenthesized_expression", "non_null_expression"].includes(current.parent.type)) {
        current = current.parent;
    }
    return current;
}
function enclosingScope(node, isPython) {
    const scopes = isPython
        ? ["function_definition", "module"]
        : ["function_declaration", "function_expression", "function", "arrow_function", "method_definition", "program"];
    let current = node.parent;
    while (current && !scopes.includes(current.type))
        current = current.parent;
    return current ?? node.tree.rootNode;
}
function comparisons(value, isPython) {
    const parent = value.parent;
    if (!parent)
        return [];
    const strings = (nodes) => nodes.flatMap((n) => {
        const literal = n ? (isPython ? pythonStringValue(n) : jsStringValue(n)) : null;
        return literal === null ? [] : [variantUse(literal, n)];
    });
    if (!isPython) {
        if (parent.type === "binary_expression" && ["===", "==", "!==", "!="].includes(parent.childForFieldName("operator")?.text ?? "")) {
            const other = sameNode(parent.childForFieldName("left"), value) ? parent.childForFieldName("right") : parent.childForFieldName("left");
            return strings([other]);
        }
        // switch (x) parses as switch_statement > parenthesized_expression > x, which unwrap() already climbed.
        if (parent.type === "switch_statement" && sameNode(parent.childForFieldName("value"), value)) {
            const cases = parent.childForFieldName("body")?.namedChildren.filter((c) => c.type === "switch_case") ?? [];
            return strings(cases.map((c) => c.childForFieldName("value")));
        }
        return [];
    }
    if (parent.type === "comparison_operator") {
        const operators = parent.children.filter((c) => !c.isNamed()).map((c) => c.text);
        if (!operators.some((op) => ["==", "!=", "in", "not in", "not"].includes(op)))
            return [];
        return parent.namedChildren
            .filter((c) => !sameNode(c, value))
            .flatMap((c) => (["tuple", "list", "set"].includes(c.type) ? strings(c.namedChildren) : strings([c])));
    }
    if (parent.type === "match_statement" && sameNode(parent.childForFieldName("subject"), value)) {
        const patterns = parent.descendantsOfType("case_pattern").filter((p) => sameNode(enclosingMatch(p), parent));
        return patterns.flatMap((p) => strings(p.namedChildren.flatMap((c) => (c.type === "union_pattern" ? c.namedChildren : [c]))));
    }
    return [];
}
function enclosingMatch(node) {
    let current = node.parent;
    while (current && current.type !== "match_statement")
        current = current.parent;
    return current;
}
function pythonCall(node, methods, snapshotMethods) {
    const fn = node.childForFieldName("function");
    if (!fn)
        return null;
    let method = null;
    if (fn.type === "identifier") {
        method = methods.has(fn.text) ? fn.text : null;
    }
    else if (fn.type === "attribute") {
        const name = fn.childForFieldName("attribute")?.text ?? "";
        method = methods.has(name) || snapshotMethods.has(name) ? name : null;
    }
    if (!method)
        return null;
    const args = node.childForFieldName("arguments")?.namedChildren ?? [];
    // feature_enabled("key", ...) or feature_enabled(key="key", ...)
    const keyword = args.find((a) => a.type === "keyword_argument" && a.childForFieldName("name")?.text === "key");
    const arg = keyword ? keyword.childForFieldName("value") : args.find((a) => a.type !== "keyword_argument");
    if (!arg)
        return null;
    return { method, key: pythonStringValue(arg), expression: arg.text };
}
function pythonStringValue(node) {
    if (node.type !== "string" || node.namedChildren.some((c) => c.type === "interpolation"))
        return null;
    const match = node.text.match(/^[rRbBuU]*("""|'''|"|')([\s\S]*)\1$/);
    return match ? match[2] : null;
}


/***/ }),

/***/ 139:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fetchFlags = fetchFlags;
// The list endpoint hides archived flags unless `archived` is passed, so fetch both sets.
// Staleness comes from PostHog's own `active=STALE` filter rather than being recomputed here.
async function fetchFlags(config) {
    const [live, archived, stale] = await Promise.all([
        fetchAll(config, ""),
        fetchAll(config, "&archived=true"),
        fetchAll(config, "&active=STALE"),
    ]);
    const staleKeys = new Set(stale.map((f) => f.key));
    const byKey = new Map();
    for (const flag of [...live, ...archived])
        byKey.set(flag.key, { ...flag, stale: staleKeys.has(flag.key) });
    return [...byKey.values()];
}
async function fetchAll(config, extraQuery) {
    const host = config.host.replace(/\/+$/, "");
    let url = `${host}/api/projects/${encodeURIComponent(config.projectId)}/feature_flags/?limit=200${extraQuery}`;
    const flags = [];
    while (url) {
        const response = await fetch(url, { headers: { Authorization: `Bearer ${config.apiKey}` } });
        if (!response.ok) {
            const body = await response.text();
            throw new Error(`PostHog API ${response.status} for ${url}: ${body.slice(0, 300)}`);
        }
        const page = (await response.json());
        for (const f of page.results) {
            const variants = f.filters?.multivariate?.variants;
            flags.push({
                id: f.id,
                key: f.key,
                active: Boolean(f.active),
                archived: Boolean(f.archived),
                stale: false,
                variants: Array.isArray(variants) ? variants.map((v) => v.key) : null,
                evaluationRuntime: f.evaluation_runtime ?? null,
                runningExperiments: (f.experiment_set_metadata ?? [])
                    .filter((e) => e.is_running)
                    .map((e) => ({ id: e.id, name: e.name })),
            });
        }
        url = page.next;
    }
    return flags;
}


/***/ }),

/***/ 665:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.COMMENT_MARKER = void 0;
exports.renderMarkdown = renderMarkdown;
exports.renderText = renderText;
exports.annotations = annotations;
exports.createUrl = createUrl;
exports.COMMENT_MARKER = "<!-- flag-lint -->";
function renderMarkdown(findings, references, context) {
    const host = context.host.replace(/\/+$/, "");
    const flagsUrl = `${host}/project/${context.projectId}/feature_flags`;
    const errors = findings.filter((f) => f.severity === "error");
    const warnings = findings.filter((f) => f.severity === "warning");
    const files = new Set(references.map((r) => r.file)).size;
    const scope = `${plural(references.length, "flag reference")} across ${plural(files, "file")}`;
    const footer = `<sub>flag-lint · hackathon project${context.sha ? ` · updated for commit \`${context.sha.slice(0, 7)}\`` : ""}</sub>`;
    const lines = [exports.COMMENT_MARKER, "### 🚩 PostHog feature flags", ""];
    if (references.length === 0) {
        lines.push("No feature flag references in the changed files.", "", footer);
        return lines.join("\n") + "\n";
    }
    if (findings.length === 0) {
        lines.push(`✅ ${references.length === 1 ? "The flag reference matches" : `All ${scope} match`} your PostHog project.`, "", footer);
        return lines.join("\n") + "\n";
    }
    const counts = [errors.length && `**${plural(errors.length, "problem")}**`, warnings.length && plural(warnings.length, "warning")];
    lines.push(`${counts.filter(Boolean).join(", ")} in ${scope}`, "", "| | Flag | Problem | Where |", "|---|---|---|---|");
    for (const finding of [...errors, ...warnings]) {
        const icon = finding.severity === "error" ? "❌" : "⚠️";
        const name = code(finding.key ?? finding.references[0].expression);
        const flag = finding.flagId === undefined ? name : `[${name}](${flagsUrl}/${finding.flagId})`;
        const where = finding.references.map((r) => location(r, context)).join(", ");
        const projectUrl = `${host}/project/${context.projectId}`;
        const links = [
            ...(finding.create && finding.key ? [`[Create it →](${createUrl(flagsUrl, finding.key, finding.create.variants)})`] : []),
            ...(finding.links ?? []).map((l) => `[${cell(l.label)} →](${projectUrl}/${l.path})`),
        ];
        lines.push(`| ${icon} | ${flag} | ${cell([finding.message, ...links].join(" · "))} | ${where} |`);
    }
    const recheck = context.rerunUrl ? [`[🔄 Re-check](${context.rerunUrl}) after fixing flags in PostHog`] : [];
    lines.push("", [`[View flags](${flagsUrl})`, ...recheck].join(" · "), "", footer);
    return lines.join("\n") + "\n";
}
function renderText(findings, scannedReferences) {
    if (findings.length === 0)
        return `flag-lint: ${plural(scannedReferences, "reference")} checked, no problems found.\n`;
    return (findings
        .map((f) => {
        const head = `${f.severity.toUpperCase()} ${f.key ?? f.references[0].expression}: ${f.message.replace(/`/g, "")}`;
        return [head, ...f.references.map((r) => `    ${r.file}:${r.line}`)].join("\n");
    })
        .join("\n") + "\n");
}
// One annotation per reference, so each call site gets marked in the PR's "Files changed" tab.
// Removed calls have no line in the PR's version of the file to annotate.
function annotations(findings) {
    return findings.flatMap((f) => f.references.filter((r) => !r.removed).map((r) => ({
        severity: f.severity,
        title: `PostHog flag: ${f.key ?? r.expression}`,
        message: f.message.replace(/`/g, ""),
        file: r.file,
        line: r.line,
        column: r.column,
    })));
}
// Prefills PostHog's new-flag form. The full /project/<id>/ path avoids a redirect, which would
// re-encode the query and turn keys like `1e3` into numbers.
function createUrl(flagsUrl, key, variants) {
    const params = new URLSearchParams({ key });
    if (variants) {
        params.set("type", "multivariate");
        params.set("variants", variants.join(","));
    }
    return `${flagsUrl}/new?${params.toString().replace(/%2C/g, ",")}`;
}
function plural(count, noun) {
    return `${count} ${noun}${count === 1 ? "" : "s"}`;
}
// Inline code that survives backticks in the content (e.g. template literals).
function code(text) {
    return cell(text.includes("`") ? `\`\` ${text} \`\`` : `\`${text}\``);
}
function cell(text) {
    return text.replace(/\|/g, "\\|").replace(/\n/g, " ");
}
function location(ref, context) {
    const label = `\`${ref.file}:${ref.line}\`${ref.removed ? " (removed)" : ""}`;
    const blob = ref.removed ? context.baseBlobUrl : context.blobUrl;
    return blob ? `[${label}](${blob}/${ref.file}#L${ref.line})` : label;
}


/***/ }),

/***/ 798:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.listFiles = listFiles;
exports.scan = scan;
exports.removedReferences = removedReferences;
const child_process_1 = __nccwpck_require__(317);
const fs_1 = __importDefault(__nccwpck_require__(896));
const path_1 = __importDefault(__nccwpck_require__(928));
const extract_1 = __nccwpck_require__(542);
const IGNORED_DIRS = new Set(["node_modules", ".git", "dist", "build", "venv", ".venv", "__pycache__", "site-packages"]);
// Files changed between `base` and HEAD (added/modified/renamed only), or every supported file.
function listFiles(dir, base) {
    if (base) {
        const out = (0, child_process_1.execFileSync)("git", ["diff", "--name-only", "--diff-filter=AMR", `${base}...HEAD`], { cwd: dir, encoding: "utf8" });
        return out.split("\n").filter((f) => f && (0, extract_1.languageFor)(f) && !f.split("/").some((p) => IGNORED_DIRS.has(p)));
    }
    const files = [];
    const walk = (rel) => {
        for (const entry of fs_1.default.readdirSync(path_1.default.join(dir, rel), { withFileTypes: true })) {
            const child = rel ? `${rel}/${entry.name}` : entry.name;
            if (entry.isDirectory()) {
                if (!IGNORED_DIRS.has(entry.name))
                    walk(child);
            }
            else if ((0, extract_1.languageFor)(entry.name)) {
                files.push(child);
            }
        }
    };
    walk("");
    return files;
}
async function scan(dir, files, wrappers = []) {
    const references = [];
    for (const file of files) {
        const source = fs_1.default.readFileSync(path_1.default.join(dir, file), "utf8");
        references.push(...(await (0, extract_1.extractReferences)(source, file, { wrappers })));
    }
    return references;
}
// Flag calls the PR removed from one file: present in the base version, with their line no longer
// in the new version, capped by how many uses of that flag the file lost. Moving or reformatting a
// call therefore doesn't count as removing it. Returned references point at the base version.
function removedReferences(baseRefs, baseSource, headRefs, headSource) {
    const headLines = new Set((headSource ?? "").split("\n").map((l) => l.trim()));
    const baseLines = baseSource.split("\n");
    const removed = [];
    const keys = new Set(baseRefs.flatMap((r) => (r.key === null ? [] : [r.key])));
    for (const key of keys) {
        const before = baseRefs.filter((r) => r.key === key);
        const lost = before.length - headRefs.filter((r) => r.key === key).length;
        if (lost <= 0)
            continue;
        const gone = before.filter((r) => !headLines.has((baseLines[r.line - 1] ?? "").trim()));
        removed.push(...gone.slice(0, lost).map((r) => ({ ...r, removed: true })));
    }
    return removed;
}


/***/ }),

/***/ 317:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ 896:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 339:
/***/ ((module) => {

"use strict";
module.exports = require("module");

/***/ }),

/***/ 928:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 23:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(581);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;