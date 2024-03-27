
var createWASM8 = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  if (typeof __filename !== 'undefined') _scriptDir ||= __filename;
  return (
function(moduleArg = {}) {

var Module=moduleArg;var readyPromiseResolve,readyPromiseReject;Module["ready"]=new Promise((resolve,reject)=>{readyPromiseResolve=resolve;readyPromiseReject=reject});var moduleOverrides=Object.assign({},Module);var arguments_=[];var thisProgram="./this.program";var quit_=(status,toThrow)=>{throw toThrow};var ENVIRONMENT_IS_WEB=typeof window=="object";var ENVIRONMENT_IS_WORKER=typeof importScripts=="function";var ENVIRONMENT_IS_NODE=typeof process=="object"&&typeof process.versions=="object"&&typeof process.versions.node=="string";var ENVIRONMENT_IS_PTHREAD=Module["ENVIRONMENT_IS_PTHREAD"]||false;var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}var read_,readAsync,readBinary;if(ENVIRONMENT_IS_NODE){var fs=require("fs");var nodePath=require("path");if(ENVIRONMENT_IS_WORKER){scriptDirectory=nodePath.dirname(scriptDirectory)+"/"}else{scriptDirectory=__dirname+"/"}read_=(filename,binary)=>{filename=isFileURI(filename)?new URL(filename):nodePath.normalize(filename);return fs.readFileSync(filename,binary?undefined:"utf8")};readBinary=filename=>{var ret=read_(filename,true);if(!ret.buffer){ret=new Uint8Array(ret)}return ret};readAsync=(filename,onload,onerror,binary=true)=>{filename=isFileURI(filename)?new URL(filename):nodePath.normalize(filename);fs.readFile(filename,binary?undefined:"utf8",(err,data)=>{if(err)onerror(err);else onload(binary?data.buffer:data)})};if(!Module["thisProgram"]&&process.argv.length>1){thisProgram=process.argv[1].replace(/\\/g,"/")}arguments_=process.argv.slice(2);quit_=(status,toThrow)=>{process.exitCode=status;throw toThrow};global.Worker=require("worker_threads").Worker}else if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){if(ENVIRONMENT_IS_WORKER){scriptDirectory=self.location.href}else if(typeof document!="undefined"&&document.currentScript){scriptDirectory=document.currentScript.src}if(_scriptDir){scriptDirectory=_scriptDir}if(scriptDirectory.startsWith("blob:")){scriptDirectory=""}else{scriptDirectory=scriptDirectory.substr(0,scriptDirectory.replace(/[?#].*/,"").lastIndexOf("/")+1)}if(!ENVIRONMENT_IS_NODE){read_=url=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.send(null);return xhr.responseText};if(ENVIRONMENT_IS_WORKER){readBinary=url=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)}}readAsync=(url,onload,onerror)=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,true);xhr.responseType="arraybuffer";xhr.onload=()=>{if(xhr.status==200||xhr.status==0&&xhr.response){onload(xhr.response);return}onerror()};xhr.onerror=onerror;xhr.send(null)}}}else{}if(ENVIRONMENT_IS_NODE){if(typeof performance=="undefined"){global.performance=require("perf_hooks").performance}}var defaultPrint=console.log.bind(console);var defaultPrintErr=console.error.bind(console);if(ENVIRONMENT_IS_NODE){defaultPrint=(...args)=>fs.writeSync(1,args.join(" ")+"\n");defaultPrintErr=(...args)=>fs.writeSync(2,args.join(" ")+"\n")}var out=Module["print"]||defaultPrint;var err=Module["printErr"]||defaultPrintErr;Object.assign(Module,moduleOverrides);moduleOverrides=null;if(Module["arguments"])arguments_=Module["arguments"];if(Module["thisProgram"])thisProgram=Module["thisProgram"];if(Module["quit"])quit_=Module["quit"];var wasmBinary;if(Module["wasmBinary"])wasmBinary=Module["wasmBinary"];var wasmMemory;var wasmModule;var ABORT=false;var EXITSTATUS;var HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;function updateMemoryViews(){var b=wasmMemory.buffer;Module["HEAP8"]=HEAP8=new Int8Array(b);Module["HEAP16"]=HEAP16=new Int16Array(b);Module["HEAPU8"]=HEAPU8=new Uint8Array(b);Module["HEAPU16"]=HEAPU16=new Uint16Array(b);Module["HEAP32"]=HEAP32=new Int32Array(b);Module["HEAPU32"]=HEAPU32=new Uint32Array(b);Module["HEAPF32"]=HEAPF32=new Float32Array(b);Module["HEAPF64"]=HEAPF64=new Float64Array(b)}var INITIAL_MEMORY=Module["INITIAL_MEMORY"]||33554432;if(ENVIRONMENT_IS_PTHREAD){wasmMemory=Module["wasmMemory"]}else{if(Module["wasmMemory"]){wasmMemory=Module["wasmMemory"]}else{wasmMemory=new WebAssembly.Memory({"initial":INITIAL_MEMORY/65536,"maximum":INITIAL_MEMORY/65536,"shared":true});if(!(wasmMemory.buffer instanceof SharedArrayBuffer)){err("requested a shared WebAssembly.Memory but the returned buffer is not a SharedArrayBuffer, indicating that while the browser has SharedArrayBuffer it does not have WebAssembly threads support - you may need to set a flag");if(ENVIRONMENT_IS_NODE){err("(on node you may need: --experimental-wasm-threads --experimental-wasm-bulk-memory and/or recent version)")}throw Error("bad memory")}}}updateMemoryViews();INITIAL_MEMORY=wasmMemory.buffer.byteLength;var __ATPRERUN__=[];var __ATINIT__=[];var __ATPOSTRUN__=[];var runtimeInitialized=false;function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift())}}callRuntimeCallbacks(__ATPRERUN__)}function initRuntime(){runtimeInitialized=true;if(ENVIRONMENT_IS_PTHREAD)return;callRuntimeCallbacks(__ATINIT__)}function postRun(){if(ENVIRONMENT_IS_PTHREAD)return;if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift())}}callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(cb){__ATPRERUN__.unshift(cb)}function addOnInit(cb){__ATINIT__.unshift(cb)}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb)}var runDependencies=0;var runDependencyWatcher=null;var dependenciesFulfilled=null;function addRunDependency(id){runDependencies++;Module["monitorRunDependencies"]?.(runDependencies)}function removeRunDependency(id){runDependencies--;Module["monitorRunDependencies"]?.(runDependencies);if(runDependencies==0){if(runDependencyWatcher!==null){clearInterval(runDependencyWatcher);runDependencyWatcher=null}if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback()}}}function abort(what){Module["onAbort"]?.(what);what="Aborted("+what+")";err(what);ABORT=true;EXITSTATUS=1;what+=". Build with -sASSERTIONS for more info.";var e=new WebAssembly.RuntimeError(what);readyPromiseReject(e);throw e}var dataURIPrefix="data:application/octet-stream;base64,";var isDataURI=filename=>filename.startsWith(dataURIPrefix);var isFileURI=filename=>filename.startsWith("file://");var wasmBinaryFile;wasmBinaryFile="wasm8.wasm";if(!isDataURI(wasmBinaryFile)){wasmBinaryFile=locateFile(wasmBinaryFile)}function getBinarySync(file){if(file==wasmBinaryFile&&wasmBinary){return new Uint8Array(wasmBinary)}if(readBinary){return readBinary(file)}throw"both async and sync fetching of the wasm failed"}function getBinaryPromise(binaryFile){if(!wasmBinary&&(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)){if(typeof fetch=="function"&&!isFileURI(binaryFile)){return fetch(binaryFile,{credentials:"same-origin"}).then(response=>{if(!response["ok"]){throw`failed to load wasm binary file at '${binaryFile}'`}return response["arrayBuffer"]()}).catch(()=>getBinarySync(binaryFile))}else if(readAsync){return new Promise((resolve,reject)=>{readAsync(binaryFile,response=>resolve(new Uint8Array(response)),reject)})}}return Promise.resolve().then(()=>getBinarySync(binaryFile))}function instantiateArrayBuffer(binaryFile,imports,receiver){return getBinaryPromise(binaryFile).then(binary=>WebAssembly.instantiate(binary,imports)).then(receiver,reason=>{err(`failed to asynchronously prepare wasm: ${reason}`);abort(reason)})}function instantiateAsync(binary,binaryFile,imports,callback){if(!binary&&typeof WebAssembly.instantiateStreaming=="function"&&!isDataURI(binaryFile)&&!isFileURI(binaryFile)&&!ENVIRONMENT_IS_NODE&&typeof fetch=="function"){return fetch(binaryFile,{credentials:"same-origin"}).then(response=>{var result=WebAssembly.instantiateStreaming(response,imports);return result.then(callback,function(reason){err(`wasm streaming compile failed: ${reason}`);err("falling back to ArrayBuffer instantiation");return instantiateArrayBuffer(binaryFile,imports,callback)})})}return instantiateArrayBuffer(binaryFile,imports,callback)}function createWasm(){var info={"a":wasmImports};function receiveInstance(instance,module){wasmExports=instance.exports;registerTLSInit(wasmExports["C"]);wasmTable=wasmExports["H"];addOnInit(wasmExports["r"]);wasmModule=module;removeRunDependency("wasm-instantiate");return wasmExports}addRunDependency("wasm-instantiate");function receiveInstantiationResult(result){receiveInstance(result["instance"],result["module"])}if(Module["instantiateWasm"]){try{return Module["instantiateWasm"](info,receiveInstance)}catch(e){err(`Module.instantiateWasm callback failed with error: ${e}`);readyPromiseReject(e)}}instantiateAsync(wasmBinary,wasmBinaryFile,info,receiveInstantiationResult).catch(readyPromiseReject);return{}}function ExitStatus(status){this.name="ExitStatus";this.message=`Program terminated with exit(${status})`;this.status=status}var terminateWorker=worker=>{worker.terminate();worker.onmessage=e=>{}};var killThread=pthread_ptr=>{var worker=PThread.pthreads[pthread_ptr];delete PThread.pthreads[pthread_ptr];terminateWorker(worker);__emscripten_thread_free_data(pthread_ptr);PThread.runningWorkers.splice(PThread.runningWorkers.indexOf(worker),1);worker.pthread_ptr=0};var cancelThread=pthread_ptr=>{var worker=PThread.pthreads[pthread_ptr];worker.postMessage({"cmd":"cancel"})};var cleanupThread=pthread_ptr=>{var worker=PThread.pthreads[pthread_ptr];PThread.returnWorkerToPool(worker)};var spawnThread=threadParams=>{var worker=PThread.getNewWorker();if(!worker){return 6}PThread.runningWorkers.push(worker);PThread.pthreads[threadParams.pthread_ptr]=worker;worker.pthread_ptr=threadParams.pthread_ptr;var msg={"cmd":"run","start_routine":threadParams.startRoutine,"arg":threadParams.arg,"pthread_ptr":threadParams.pthread_ptr};if(ENVIRONMENT_IS_NODE){worker.unref()}worker.postMessage(msg,threadParams.transferList);return 0};var runtimeKeepaliveCounter=0;var keepRuntimeAlive=()=>noExitRuntime||runtimeKeepaliveCounter>0;var withStackSave=f=>{var stack=stackSave();var ret=f();stackRestore(stack);return ret};var proxyToMainThread=(funcIndex,emAsmAddr,sync,...callArgs)=>withStackSave(()=>{var serializedNumCallArgs=callArgs.length;var args=stackAlloc(serializedNumCallArgs*8);var b=args>>3;for(var i=0;i<callArgs.length;i++){var arg=callArgs[i];HEAPF64[b+i]=arg}return __emscripten_run_on_main_thread_js(funcIndex,emAsmAddr,serializedNumCallArgs,args,sync)});function _proc_exit(code){if(ENVIRONMENT_IS_PTHREAD)return proxyToMainThread(0,0,1,code);EXITSTATUS=code;if(!keepRuntimeAlive()){PThread.terminateAllThreads();Module["onExit"]?.(code);ABORT=true}quit_(code,new ExitStatus(code))}var exitJS=(status,implicit)=>{EXITSTATUS=status;if(ENVIRONMENT_IS_PTHREAD){exitOnMainThread(status);throw"unwind"}_proc_exit(status)};var _exit=exitJS;var handleException=e=>{if(e instanceof ExitStatus||e=="unwind"){return EXITSTATUS}quit_(1,e)};var PThread={unusedWorkers:[],runningWorkers:[],tlsInitFunctions:[],pthreads:{},init(){if(ENVIRONMENT_IS_PTHREAD){PThread.initWorker()}else{PThread.initMainThread()}},initMainThread(){addOnPreRun(()=>{addRunDependency("loading-workers");PThread.loadWasmModuleToAllWorkers(()=>removeRunDependency("loading-workers"))})},initWorker(){noExitRuntime=false},setExitStatus:status=>EXITSTATUS=status,terminateAllThreads__deps:["$terminateWorker"],terminateAllThreads:()=>{for(var worker of PThread.runningWorkers){terminateWorker(worker)}for(var worker of PThread.unusedWorkers){terminateWorker(worker)}PThread.unusedWorkers=[];PThread.runningWorkers=[];PThread.pthreads=[]},returnWorkerToPool:worker=>{var pthread_ptr=worker.pthread_ptr;delete PThread.pthreads[pthread_ptr];PThread.unusedWorkers.push(worker);PThread.runningWorkers.splice(PThread.runningWorkers.indexOf(worker),1);worker.pthread_ptr=0;__emscripten_thread_free_data(pthread_ptr)},receiveObjectTransfer(data){},threadInitTLS(){PThread.tlsInitFunctions.forEach(f=>f())},loadWasmModuleToWorker:worker=>new Promise(onFinishedLoading=>{worker.onmessage=e=>{var d=e["data"];var cmd=d["cmd"];if(d["targetThread"]&&d["targetThread"]!=_pthread_self()){var targetWorker=PThread.pthreads[d["targetThread"]];if(targetWorker){targetWorker.postMessage(d,d["transferList"])}else{err(`Internal error! Worker sent a message "${cmd}" to target pthread ${d["targetThread"]}, but that thread no longer exists!`)}return}if(cmd==="checkMailbox"){checkMailbox()}else if(cmd==="spawnThread"){spawnThread(d)}else if(cmd==="cleanupThread"){cleanupThread(d["thread"])}else if(cmd==="killThread"){killThread(d["thread"])}else if(cmd==="cancelThread"){cancelThread(d["thread"])}else if(cmd==="loaded"){worker.loaded=true;onFinishedLoading(worker)}else if(cmd==="alert"){alert(`Thread ${d["threadId"]}: ${d["text"]}`)}else if(d.target==="setimmediate"){worker.postMessage(d)}else if(cmd==="callHandler"){Module[d["handler"]](...d["args"])}else if(cmd){err(`worker sent an unknown command ${cmd}`)}};worker.onerror=e=>{var message="worker sent an error!";err(`${message} ${e.filename}:${e.lineno}: ${e.message}`);throw e};if(ENVIRONMENT_IS_NODE){worker.on("message",data=>worker.onmessage({data:data}));worker.on("error",e=>worker.onerror(e))}var handlers=[];var knownHandlers=["onExit","onAbort","print","printErr"];for(var handler of knownHandlers){if(Module.hasOwnProperty(handler)){handlers.push(handler)}}worker.postMessage({"cmd":"load","handlers":handlers,"urlOrBlob":Module["mainScriptUrlOrBlob"]||_scriptDir,"wasmMemory":wasmMemory,"wasmModule":wasmModule})}),loadWasmModuleToAllWorkers(onMaybeReady){onMaybeReady()},allocateUnusedWorker(){var worker;var pthreadMainJs=locateFile("wasm8.worker.js");worker=new Worker(pthreadMainJs);PThread.unusedWorkers.push(worker)},getNewWorker(){if(PThread.unusedWorkers.length==0){PThread.allocateUnusedWorker();PThread.loadWasmModuleToWorker(PThread.unusedWorkers[0])}return PThread.unusedWorkers.pop()}};Module["PThread"]=PThread;var callRuntimeCallbacks=callbacks=>{while(callbacks.length>0){callbacks.shift()(Module)}};var establishStackSpace=()=>{var pthread_ptr=_pthread_self();var stackHigh=HEAPU32[pthread_ptr+52>>2];var stackSize=HEAPU32[pthread_ptr+56>>2];var stackLow=stackHigh-stackSize;_emscripten_stack_set_limits(stackHigh,stackLow);stackRestore(stackHigh)};Module["establishStackSpace"]=establishStackSpace;function exitOnMainThread(returnCode){if(ENVIRONMENT_IS_PTHREAD)return proxyToMainThread(1,0,0,returnCode);_exit(returnCode)}function getValue(ptr,type="i8"){if(type.endsWith("*"))type="*";switch(type){case"i1":return HEAP8[ptr];case"i8":return HEAP8[ptr];case"i16":return HEAP16[ptr>>1];case"i32":return HEAP32[ptr>>2];case"i64":abort("to do getValue(i64) use WASM_BIGINT");case"float":return HEAPF32[ptr>>2];case"double":return HEAPF64[ptr>>3];case"*":return HEAPU32[ptr>>2];default:abort(`invalid type for getValue: ${type}`)}}var wasmTableMirror=[];var wasmTable;var getWasmTableEntry=funcPtr=>{var func=wasmTableMirror[funcPtr];if(!func){if(funcPtr>=wasmTableMirror.length)wasmTableMirror.length=funcPtr+1;wasmTableMirror[funcPtr]=func=wasmTable.get(funcPtr)}return func};var invokeEntryPoint=(ptr,arg)=>{var result=getWasmTableEntry(ptr)(arg);function finish(result){if(keepRuntimeAlive()){PThread.setExitStatus(result)}else{__emscripten_thread_exit(result)}}finish(result)};Module["invokeEntryPoint"]=invokeEntryPoint;var noExitRuntime=Module["noExitRuntime"]||true;var registerTLSInit=tlsInitFunc=>PThread.tlsInitFunctions.push(tlsInitFunc);function setValue(ptr,value,type="i8"){if(type.endsWith("*"))type="*";switch(type){case"i1":HEAP8[ptr]=value;break;case"i8":HEAP8[ptr]=value;break;case"i16":HEAP16[ptr>>1]=value;break;case"i32":HEAP32[ptr>>2]=value;break;case"i64":abort("to do setValue(i64) use WASM_BIGINT");case"float":HEAPF32[ptr>>2]=value;break;case"double":HEAPF64[ptr>>3]=value;break;case"*":HEAPU32[ptr>>2]=value;break;default:abort(`invalid type for setValue: ${type}`)}}var UTF8Decoder=typeof TextDecoder!="undefined"?new TextDecoder("utf8"):undefined;var UTF8ArrayToString=(heapOrArray,idx,maxBytesToRead)=>{var endIdx=idx+maxBytesToRead;var endPtr=idx;while(heapOrArray[endPtr]&&!(endPtr>=endIdx))++endPtr;if(endPtr-idx>16&&heapOrArray.buffer&&UTF8Decoder){return UTF8Decoder.decode(heapOrArray.buffer instanceof SharedArrayBuffer?heapOrArray.slice(idx,endPtr):heapOrArray.subarray(idx,endPtr))}var str="";while(idx<endPtr){var u0=heapOrArray[idx++];if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=heapOrArray[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}var u2=heapOrArray[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2}else{u0=(u0&7)<<18|u1<<12|u2<<6|heapOrArray[idx++]&63}if(u0<65536){str+=String.fromCharCode(u0)}else{var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}}return str};var UTF8ToString=(ptr,maxBytesToRead)=>ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead):"";var ___assert_fail=(condition,filename,line,func)=>{abort(`Assertion failed: ${UTF8ToString(condition)}, at: `+[filename?UTF8ToString(filename):"unknown filename",line,func?UTF8ToString(func):"unknown function"])};var ___emscripten_init_main_thread_js=tb=>{__emscripten_thread_init(tb,!ENVIRONMENT_IS_WORKER,1,!ENVIRONMENT_IS_WEB,65536,false);PThread.threadInitTLS()};var ___emscripten_thread_cleanup=thread=>{if(!ENVIRONMENT_IS_PTHREAD)cleanupThread(thread);else postMessage({"cmd":"cleanupThread","thread":thread})};function pthreadCreateProxied(pthread_ptr,attr,startRoutine,arg){if(ENVIRONMENT_IS_PTHREAD)return proxyToMainThread(2,0,1,pthread_ptr,attr,startRoutine,arg);return ___pthread_create_js(pthread_ptr,attr,startRoutine,arg)}var ___pthread_create_js=(pthread_ptr,attr,startRoutine,arg)=>{if(typeof SharedArrayBuffer=="undefined"){err("Current environment does not support SharedArrayBuffer, pthreads are not available!");return 6}var transferList=[];var error=0;if(ENVIRONMENT_IS_PTHREAD&&(transferList.length===0||error)){return pthreadCreateProxied(pthread_ptr,attr,startRoutine,arg)}if(error)return error;var threadParams={startRoutine:startRoutine,pthread_ptr:pthread_ptr,arg:arg,transferList:transferList};if(ENVIRONMENT_IS_PTHREAD){threadParams.cmd="spawnThread";postMessage(threadParams,transferList);return 0}return spawnThread(threadParams)};var nowIsMonotonic=1;var __emscripten_get_now_is_monotonic=()=>nowIsMonotonic;var maybeExit=()=>{if(!keepRuntimeAlive()){try{if(ENVIRONMENT_IS_PTHREAD)__emscripten_thread_exit(EXITSTATUS);else _exit(EXITSTATUS)}catch(e){handleException(e)}}};var callUserCallback=func=>{if(ABORT){return}try{func();maybeExit()}catch(e){handleException(e)}};var __emscripten_thread_mailbox_await=pthread_ptr=>{if(typeof Atomics.waitAsync==="function"){var wait=Atomics.waitAsync(HEAP32,pthread_ptr>>2,pthread_ptr);wait.value.then(checkMailbox);var waitingAsync=pthread_ptr+128;Atomics.store(HEAP32,waitingAsync>>2,1)}};Module["__emscripten_thread_mailbox_await"]=__emscripten_thread_mailbox_await;var checkMailbox=()=>{var pthread_ptr=_pthread_self();if(pthread_ptr){__emscripten_thread_mailbox_await(pthread_ptr);callUserCallback(__emscripten_check_mailbox)}};Module["checkMailbox"]=checkMailbox;var __emscripten_notify_mailbox_postmessage=(targetThreadId,currThreadId,mainThreadId)=>{if(targetThreadId==currThreadId){setTimeout(checkMailbox)}else if(ENVIRONMENT_IS_PTHREAD){postMessage({"targetThread":targetThreadId,"cmd":"checkMailbox"})}else{var worker=PThread.pthreads[targetThreadId];if(!worker){return}worker.postMessage({"cmd":"checkMailbox"})}};var proxiedJSCallArgs=[];var __emscripten_receive_on_main_thread_js=(funcIndex,emAsmAddr,callingThread,numCallArgs,args)=>{proxiedJSCallArgs.length=numCallArgs;var b=args>>3;for(var i=0;i<numCallArgs;i++){proxiedJSCallArgs[i]=HEAPF64[b+i]}var func=proxiedFunctionTable[funcIndex];PThread.currentProxiedOperationCallerThread=callingThread;var rtn=func(...proxiedJSCallArgs);PThread.currentProxiedOperationCallerThread=0;return rtn};var __emscripten_thread_set_strongref=thread=>{if(ENVIRONMENT_IS_NODE){PThread.pthreads[thread].ref()}};var _abort=()=>{abort("")};var warnOnce=text=>{warnOnce.shown||={};if(!warnOnce.shown[text]){warnOnce.shown[text]=1;if(ENVIRONMENT_IS_NODE)text="warning: "+text;err(text)}};var _emscripten_check_blocking_allowed=()=>{};var runtimeKeepalivePush=()=>{runtimeKeepaliveCounter+=1};var _emscripten_exit_with_live_runtime=()=>{runtimeKeepalivePush();throw"unwind"};var _emscripten_get_now;_emscripten_get_now=()=>performance.timeOrigin+performance.now();var abortOnCannotGrowMemory=requestedSize=>{abort("OOM")};var _emscripten_resize_heap=requestedSize=>{var oldSize=HEAPU8.length;requestedSize>>>=0;abortOnCannotGrowMemory(requestedSize)};var printCharBuffers=[null,[],[]];var printChar=(stream,curr)=>{var buffer=printCharBuffers[stream];if(curr===0||curr===10){(stream===1?out:err)(UTF8ArrayToString(buffer,0));buffer.length=0}else{buffer.push(curr)}};var SYSCALLS={varargs:undefined,get(){var ret=HEAP32[+SYSCALLS.varargs>>2];SYSCALLS.varargs+=4;return ret},getp(){return SYSCALLS.get()},getStr(ptr){var ret=UTF8ToString(ptr);return ret}};function _fd_write(fd,iov,iovcnt,pnum){if(ENVIRONMENT_IS_PTHREAD)return proxyToMainThread(3,0,1,fd,iov,iovcnt,pnum);var num=0;for(var i=0;i<iovcnt;i++){var ptr=HEAPU32[iov>>2];var len=HEAPU32[iov+4>>2];iov+=8;for(var j=0;j<len;j++){printChar(fd,HEAPU8[ptr+j])}num+=len}HEAPU32[pnum>>2]=num;return 0}var getCFunc=ident=>{var func=Module["_"+ident];return func};var writeArrayToMemory=(array,buffer)=>{HEAP8.set(array,buffer)};var lengthBytesUTF8=str=>{var len=0;for(var i=0;i<str.length;++i){var c=str.charCodeAt(i);if(c<=127){len++}else if(c<=2047){len+=2}else if(c>=55296&&c<=57343){len+=4;++i}else{len+=3}}return len};var stringToUTF8Array=(str,heap,outIdx,maxBytesToWrite)=>{if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343){var u1=str.charCodeAt(++i);u=65536+((u&1023)<<10)|u1&1023}if(u<=127){if(outIdx>=endIdx)break;heap[outIdx++]=u}else if(u<=2047){if(outIdx+1>=endIdx)break;heap[outIdx++]=192|u>>6;heap[outIdx++]=128|u&63}else if(u<=65535){if(outIdx+2>=endIdx)break;heap[outIdx++]=224|u>>12;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63}else{if(outIdx+3>=endIdx)break;heap[outIdx++]=240|u>>18;heap[outIdx++]=128|u>>12&63;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63}}heap[outIdx]=0;return outIdx-startIdx};var stringToUTF8=(str,outPtr,maxBytesToWrite)=>stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite);var stringToUTF8OnStack=str=>{var size=lengthBytesUTF8(str)+1;var ret=stackAlloc(size);stringToUTF8(str,ret,size);return ret};var ccall=(ident,returnType,argTypes,args,opts)=>{var toC={"string":str=>{var ret=0;if(str!==null&&str!==undefined&&str!==0){ret=stringToUTF8OnStack(str)}return ret},"array":arr=>{var ret=stackAlloc(arr.length);writeArrayToMemory(arr,ret);return ret}};function convertReturnValue(ret){if(returnType==="string"){return UTF8ToString(ret)}if(returnType==="boolean")return Boolean(ret);return ret}var func=getCFunc(ident);var cArgs=[];var stack=0;if(args){for(var i=0;i<args.length;i++){var converter=toC[argTypes[i]];if(converter){if(stack===0)stack=stackSave();cArgs[i]=converter(args[i])}else{cArgs[i]=args[i]}}}var ret=func(...cArgs);function onDone(ret){if(stack!==0)stackRestore(stack);return convertReturnValue(ret)}ret=onDone(ret);return ret};var cwrap=(ident,returnType,argTypes,opts)=>{var numericArgs=!argTypes||argTypes.every(type=>type==="number"||type==="boolean");var numericRet=returnType!=="string";if(numericRet&&numericArgs&&!opts){return getCFunc(ident)}return(...args)=>ccall(ident,returnType,argTypes,args,opts)};var uleb128Encode=(n,target)=>{if(n<128){target.push(n)}else{target.push(n%128|128,n>>7)}};var sigToWasmTypes=sig=>{var typeNames={"i":"i32","j":"i64","f":"f32","d":"f64","e":"externref","p":"i32"};var type={parameters:[],results:sig[0]=="v"?[]:[typeNames[sig[0]]]};for(var i=1;i<sig.length;++i){type.parameters.push(typeNames[sig[i]])}return type};var generateFuncType=(sig,target)=>{var sigRet=sig.slice(0,1);var sigParam=sig.slice(1);var typeCodes={"i":127,"p":127,"j":126,"f":125,"d":124,"e":111};target.push(96);uleb128Encode(sigParam.length,target);for(var i=0;i<sigParam.length;++i){target.push(typeCodes[sigParam[i]])}if(sigRet=="v"){target.push(0)}else{target.push(1,typeCodes[sigRet])}};var convertJsFunctionToWasm=(func,sig)=>{if(typeof WebAssembly.Function=="function"){return new WebAssembly.Function(sigToWasmTypes(sig),func)}var typeSectionBody=[1];generateFuncType(sig,typeSectionBody);var bytes=[0,97,115,109,1,0,0,0,1];uleb128Encode(typeSectionBody.length,bytes);bytes.push(...typeSectionBody);bytes.push(2,7,1,1,101,1,102,0,0,7,5,1,1,102,0,0);var module=new WebAssembly.Module(new Uint8Array(bytes));var instance=new WebAssembly.Instance(module,{"e":{"f":func}});var wrappedFunc=instance.exports["f"];return wrappedFunc};var updateTableMap=(offset,count)=>{if(functionsInTableMap){for(var i=offset;i<offset+count;i++){var item=getWasmTableEntry(i);if(item){functionsInTableMap.set(item,i)}}}};var functionsInTableMap;var getFunctionAddress=func=>{if(!functionsInTableMap){functionsInTableMap=new WeakMap;updateTableMap(0,wasmTable.length)}return functionsInTableMap.get(func)||0};var freeTableIndexes=[];var getEmptyTableSlot=()=>{if(freeTableIndexes.length){return freeTableIndexes.pop()}try{wasmTable.grow(1)}catch(err){if(!(err instanceof RangeError)){throw err}throw"Unable to grow wasm table. Set ALLOW_TABLE_GROWTH."}return wasmTable.length-1};var setWasmTableEntry=(idx,func)=>{wasmTable.set(idx,func);wasmTableMirror[idx]=wasmTable.get(idx)};var addFunction=(func,sig)=>{var rtn=getFunctionAddress(func);if(rtn){return rtn}var ret=getEmptyTableSlot();try{setWasmTableEntry(ret,func)}catch(err){if(!(err instanceof TypeError)){throw err}var wrapped=convertJsFunctionToWasm(func,sig);setWasmTableEntry(ret,wrapped)}functionsInTableMap.set(func,ret);return ret};PThread.init();var proxiedFunctionTable=[_proc_exit,exitOnMainThread,pthreadCreateProxied,_fd_write];var wasmImports={d:___assert_fail,j:___emscripten_init_main_thread_js,f:___emscripten_thread_cleanup,q:___pthread_create_js,g:__emscripten_get_now_is_monotonic,n:__emscripten_notify_mailbox_postmessage,h:__emscripten_receive_on_main_thread_js,i:__emscripten_thread_mailbox_await,l:__emscripten_thread_set_strongref,b:_abort,e:_emscripten_check_blocking_allowed,k:_emscripten_exit_with_live_runtime,c:_emscripten_get_now,m:_emscripten_resize_heap,p:_exit,o:_fd_write,a:wasmMemory||Module["wasmMemory"]};var wasmExports=createWasm();var ___wasm_call_ctors=()=>(___wasm_call_ctors=wasmExports["r"])();var _pdp8_create=Module["_pdp8_create"]=a0=>(_pdp8_create=Module["_pdp8_create"]=wasmExports["s"])(a0);var _pdp8_get_console_in=Module["_pdp8_get_console_in"]=a0=>(_pdp8_get_console_in=Module["_pdp8_get_console_in"]=wasmExports["t"])(a0);var _pdp8_get_console_out=Module["_pdp8_get_console_out"]=a0=>(_pdp8_get_console_out=Module["_pdp8_get_console_out"]=wasmExports["u"])(a0);var _pdp8_get_lamps_out=Module["_pdp8_get_lamps_out"]=a0=>(_pdp8_get_lamps_out=Module["_pdp8_get_lamps_out"]=wasmExports["v"])(a0);var _pdp8_set_peripheral=Module["_pdp8_set_peripheral"]=(a0,a1,a2)=>(_pdp8_set_peripheral=Module["_pdp8_set_peripheral"]=wasmExports["w"])(a0,a1,a2);var _pdp8_peripheral_action=Module["_pdp8_peripheral_action"]=(a0,a1,a2,a3,a4)=>(_pdp8_peripheral_action=Module["_pdp8_peripheral_action"]=wasmExports["x"])(a0,a1,a2,a3,a4);var _pdp8_set_throttle=Module["_pdp8_set_throttle"]=(a0,a1)=>(_pdp8_set_throttle=Module["_pdp8_set_throttle"]=wasmExports["y"])(a0,a1);var _pdp8_destroy=Module["_pdp8_destroy"]=a0=>(_pdp8_destroy=Module["_pdp8_destroy"]=wasmExports["z"])(a0);var _malloc=Module["_malloc"]=a0=>(_malloc=Module["_malloc"]=wasmExports["A"])(a0);var _free=Module["_free"]=a0=>(_free=Module["_free"]=wasmExports["B"])(a0);var __emscripten_tls_init=Module["__emscripten_tls_init"]=()=>(__emscripten_tls_init=Module["__emscripten_tls_init"]=wasmExports["C"])();var _pthread_self=Module["_pthread_self"]=()=>(_pthread_self=Module["_pthread_self"]=wasmExports["D"])();var __emscripten_thread_init=Module["__emscripten_thread_init"]=(a0,a1,a2,a3,a4,a5)=>(__emscripten_thread_init=Module["__emscripten_thread_init"]=wasmExports["E"])(a0,a1,a2,a3,a4,a5);var __emscripten_thread_crashed=Module["__emscripten_thread_crashed"]=()=>(__emscripten_thread_crashed=Module["__emscripten_thread_crashed"]=wasmExports["F"])();var _emscripten_main_thread_process_queued_calls=()=>(_emscripten_main_thread_process_queued_calls=wasmExports["emscripten_main_thread_process_queued_calls"])();var _emscripten_main_runtime_thread_id=()=>(_emscripten_main_runtime_thread_id=wasmExports["emscripten_main_runtime_thread_id"])();var __emscripten_run_on_main_thread_js=(a0,a1,a2,a3,a4)=>(__emscripten_run_on_main_thread_js=wasmExports["G"])(a0,a1,a2,a3,a4);var __emscripten_thread_free_data=a0=>(__emscripten_thread_free_data=wasmExports["I"])(a0);var __emscripten_thread_exit=Module["__emscripten_thread_exit"]=a0=>(__emscripten_thread_exit=Module["__emscripten_thread_exit"]=wasmExports["J"])(a0);var __emscripten_check_mailbox=()=>(__emscripten_check_mailbox=wasmExports["K"])();var _emscripten_stack_set_limits=(a0,a1)=>(_emscripten_stack_set_limits=wasmExports["L"])(a0,a1);var stackSave=()=>(stackSave=wasmExports["M"])();var stackRestore=a0=>(stackRestore=wasmExports["N"])(a0);var stackAlloc=a0=>(stackAlloc=wasmExports["O"])(a0);Module["wasmMemory"]=wasmMemory;Module["keepRuntimeAlive"]=keepRuntimeAlive;Module["ccall"]=ccall;Module["cwrap"]=cwrap;Module["addFunction"]=addFunction;Module["setValue"]=setValue;Module["getValue"]=getValue;Module["writeArrayToMemory"]=writeArrayToMemory;Module["ExitStatus"]=ExitStatus;Module["PThread"]=PThread;var calledRun;dependenciesFulfilled=function runCaller(){if(!calledRun)run();if(!calledRun)dependenciesFulfilled=runCaller};function run(){if(runDependencies>0){return}if(ENVIRONMENT_IS_PTHREAD){readyPromiseResolve(Module);initRuntime();startWorker(Module);return}preRun();if(runDependencies>0){return}function doRun(){if(calledRun)return;calledRun=true;Module["calledRun"]=true;if(ABORT)return;initRuntime();readyPromiseResolve(Module);if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();postRun()}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout(function(){setTimeout(function(){Module["setStatus"]("")},1);doRun()},1)}else{doRun()}}if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()()}}run();


  return moduleArg.ready
}
);
})();
if (typeof exports === 'object' && typeof module === 'object')
  module.exports = createWASM8;
else if (typeof define === 'function' && define['amd'])
  define([], () => createWASM8);
