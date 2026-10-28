// Optional, manually invoked development tool. Generated image is NOT approved for use.
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {generateDraftIcon} from '../server/src/icon-provider.mjs';
const name=process.argv[2],brief=process.argv[3];
if(!name||!brief){console.error('Usage: OPENAI_IMAGE_MODEL=... OPENAI_API_KEY=... node tools/generate-icon-local.mjs "Mecha Samurai" "cartoon robotic samurai with blade and glowing visor"');process.exit(1);}
const draft=await generateDraftIcon({elementName:name,iconBrief:brief});
const dir=resolve('draft-icon-review');await mkdir(dir,{recursive:true});
const safe=name.normalize('NFKD').replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/^-|-$/g,'').slice(0,60)||'draft';
const file=join(dir,safe+'-'+Date.now()+'.png');await writeFile(file,draft.bytes);
console.log('DRAFT ONLY / MUST PASS IMAGE + IP MODERATION:',file,draft.styleVersion);
