import fs from "node:fs";
import assert from "node:assert/strict";

const app=fs.readFileSync("app.js","utf8");
const html=fs.readFileSync("index.html","utf8");
const sw=fs.readFileSync("sw.js","utf8");
const manifest=JSON.parse(fs.readFileSync("manifest.json","utf8"));

const VERSION=(app.match(/const VERSION="([^"]+)"/)||[])[1];
assert.equal(VERSION,"0.1.1","app.js version");
assert.equal((html.match(/v0\.1\.0/g)||[]).length,2,"index version badge/footer");
assert.match(sw,/const VERSION="0\.1\.0";/,"service worker version");

assert.doesNotThrow(()=>new Function(app),"app.js syntax");

for(const id of [
  "startScreen","gameScreen","startBtn","ageBtn","lifeLog","statBars",
  "tab-life","tab-relations","tab-career","tab-finance","tab-assets",
  "tab-activities","tab-achievements","tab-stats","tab-social",
  "modal","modalBody","toast","refreshOverlay","versionText"
]) assert.match(html,new RegExp('id=["\\"]'+id+'["\\"]'),"missing DOM id: "+id);

const functions=new Set([...app.matchAll(/function\s+([A-Za-z_$][\w$]*)\s*\(/g)].map(m=>m[1]));
const inline=[...html.matchAll(/onclick="([^"]+)"/g)].map(m=>m[1]);
for(const expr of inline){
  const m=expr.match(/^\s*([A-Za-z_$][\w$]*)\s*\(/);
  if(m)assert.ok(functions.has(m[1]),"inline handler has no function: "+m[1]);
}

assert.match(app,/state\.events\.push\(\{age:state\.age,year:state\.year/,"journal must append newest entries");
assert.match(app,/state\.events\.slice\(-80\)/,"journal history must be bounded from the newest side");
assert.match(app,/events\.slice\(-24\)/,"rendered journal must show recent history");
assert.match(app,/function ensureTabBackButtons\(\)/,"back-button persistence guard missing");
assert.match(app,/choiceEvents>0&&state\.age>=8/,"choice-event setting must be respected");
assert.match(app,/function randomLifeEvent\(\)\{return null\}/,"legacy uncontrolled random events must be disabled");
assert.match(app,/state\.meta\.choiceYear===state\.year/,"duplicate yearly choice guard missing");
assert.match(app,/const ML_EVENT_DEFAULTS=\{randomEvents:2,choiceEvents:1\}/,"default event settings changed unexpectedly");
assert.match(app,/function mlSafeText\(/,"saved text sanitization missing");
assert.match(app,/state\.pendingConsequences=Array\.isArray\(state\.pendingConsequences\)/,"pending consequence migration missing");

assert.equal(manifest.lang,"hu");
assert.equal(manifest.display,"standalone");
assert.ok(Array.isArray(manifest.icons)&&manifest.icons.length>0,"PWA icon missing");

console.log("MegaLife v0.1.1 release smoke tests: PASS");
