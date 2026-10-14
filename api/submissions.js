import {put} from '@vercel/blob';import {sections} from '../src/fields.js';import crypto from 'node:crypto';
const fields=sections.flatMap(s=>s.fields);
export default async function handler(req,res){
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Method not allowed'})}
 if(!process.env.BLOB_READ_WRITE_TOKEN)return res.status(503).json({error:'Submission storage is not configured yet. Please contact Sarira Infotech.'});
 const {answers,consent,website}=req.body||{};
 if(website)return res.status(400).json({error:'Invalid submission'});
 if(consent!==true||!answers||typeof answers!=='object'||Array.isArray(answers))return res.status(400).json({error:'Valid answers and consent are required'});
 const safe={};for(const f of fields){let v=answers[f.key];if(f.type==='multi'){if(!Array.isArray(v)||v.some(x=>!f.options.includes(x)))return res.status(400).json({error:'Invalid '+f.label});safe[f.key]=v}else{if(v==null)v='';if(typeof v!=='string')return res.status(400).json({error:'Invalid '+f.label});v=v.trim();if(v.length>3000)return res.status(400).json({error:'Field too long: '+f.label});if(f.type==='select'&&v&&!f.options.includes(v))return res.status(400).json({error:'Invalid '+f.label});safe[f.key]=v}if(f.required&&!(Array.isArray(safe[f.key])?safe[f.key].length:safe[f.key]))return res.status(400).json({error:'Missing '+f.label})}
 const reference='HC-'+crypto.randomUUID().slice(0,8).toUpperCase();
 const record={reference,submittedAt:new Date().toISOString(),answers:safe};
 try{await put('intake/'+reference+'.json',JSON.stringify(record),{access:'private',contentType:'application/json',addRandomSuffix:false,token:process.env.BLOB_READ_WRITE_TOKEN});return res.status(201).json({reference})}catch(e){console.error('Intake save failed:',e.message);return res.status(500).json({error:'Unable to store submission. Please contact Sarira Infotech.'})}
}