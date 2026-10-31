import {getDocument,GlobalWorkerOptions} from 'pdfjs-dist/build/pdf.mjs';
import './pdf-viewer.css';
export function mount(host){
 const {w}=host,{make,textButton}=host.ui,{mirrorFileContext,signedInSubject}=host.storage,launch=w.launchContext,owner=launch?.owner||signedInSubject();if(owner)w.ownerSub=owner;
 const body=make('div','window-content pdf-viewer-content'),toolbar=make('div','pdf-toolbar'),surface=make('div','pdf-viewer-surface'),status=make('div','app-status'),canvas=make('canvas');canvas.setAttribute('aria-label','PDF page');
 let pdf,loading,candidate,rendering,unsubscribe=()=>{},page=1,zoom=1,revision=0,loadRevision=0,disposed=false,version,resizeFrame=0,lastWidth=0;
 const valid=()=>!disposed&&!host.signal.aborted&&body.isConnected&&signedInSubject()===owner;
 const tell=text=>{if(valid())status.textContent=text;};
 async function render(){if(!pdf||!valid())return;const request=++revision;rendering?.cancel();try{const current=await pdf.getPage(page);if(!valid()||request!==revision)return;const base=current.getViewport({scale:1}),width=Math.max(200,surface.clientWidth-24),scale=Math.min(2,Math.max(.25,width/base.width))*zoom,viewport=current.getViewport({scale});if(viewport.width*viewport.height>16000000)throw Error('This PDF page is too large to display at this zoom.');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);canvas.style.width=canvas.width+'px';canvas.style.height=canvas.height+'px';canvas.setAttribute('aria-label','PDF page '+page+' of '+pdf.numPages);rendering=current.render({canvasContext:canvas.getContext('2d'),viewport});await rendering.promise;if(valid()&&request===revision)tell('Page '+page+' of '+pdf.numPages);}catch(e){if(valid()&&request===revision&&e.name!=='RenderingCancelledException')tell(e.message);}}
 const resizeObserver=new ResizeObserver(()=>{const width=surface.clientWidth;if(width===lastWidth)return;lastWidth=width;cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>render());});resizeObserver.observe(surface);
 async function open(path,preview){
  const token=++loadRevision;let next;candidate?.destroy().catch(()=>{});candidate=null;tell('Opening PDF…');
  try{
   const c=await mirrorFileContext(),file=preview?{data:preview,version:null}:await c.files.read(path);if(!valid()||!c.valid()||token!==loadRevision)return;
   GlobalWorkerOptions.workerSrc=new URL('./workers/pdf-preview.mjs',import.meta.url).href;next=getDocument({data:Uint8Array.from(file.data),useSystemFonts:true});candidate=next;const opened=await next.promise;
   if(!valid()||!c.valid()||token!==loadRevision){await next.destroy().catch(()=>{});return;}
   unsubscribe();unsubscribe=()=>{};rendering?.cancel();revision++;const old=loading;loading=next;candidate=null;pdf=opened;version=file.version;page=1;zoom=1;surface.replaceChildren(canvas);old?.destroy().catch(()=>{});
   if(path){w.previewBytes?.fill(0);w.previewBytes=null;w.launchContext=Object.freeze({version:1,storage:'mirror',path,owner});w.title=path.split('/').pop()+' — PDF Viewer';unsubscribe=c.files.subscribe(async()=>{if(!valid()||loading!==next)return;try{const current=await c.files.read(path);if(valid()&&loading===next&&(current.version!==version||current.status==='conflict'))tell('This PDF changed. Reopen it to view the latest copy.');}catch{if(valid()&&loading===next)tell('This PDF is no longer available in Files.');}});}
   await render();
  }catch(e){if(next){if(candidate===next)candidate=null;await next.destroy().catch(()=>{});}if(valid()&&token===loadRevision)tell('Could not open PDF: '+e.message);}
 }
 toolbar.append(textButton('Open from My files',async()=>{try{const path=await host.storage.pickFile({extensions:['.pdf'],signal:host.signal});if(path&&valid())await open(path,null);}catch(e){tell('Could not choose a PDF: '+e.message);}}),textButton('Previous',()=>{if(page>1){page--;render();}}),textButton('Next',()=>{if(pdf&&page<pdf.numPages){page++;render();}}),textButton('Zoom out',()=>{zoom=Math.max(.5,zoom-.2);render();}),textButton('Zoom in',()=>{zoom=Math.min(2,zoom+.2);render();}));body.append(toolbar,surface,status);
 if(launch||w.previewBytes)queueMicrotask(()=>open(launch?.path||null,w.previewBytes));else{surface.append(make('p','','Choose a PDF from My files.'));queueMicrotask(()=>tell('Choose a PDF from My files.'));}
 return {element:body,dispose(){disposed=true;revision++;loadRevision++;resizeObserver.disconnect();cancelAnimationFrame(resizeFrame);unsubscribe();rendering?.cancel();candidate?.destroy().catch(()=>{});loading?.destroy().catch(()=>{});}};
}
