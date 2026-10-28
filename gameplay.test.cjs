const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync('game.js','utf8');
function fn(name){const start=source.indexOf('function '+name+'(');assert(start>=0,name);let depth=0,begin=source.indexOf('{',start);for(let i=begin;i<source.length;i++){if(source[i]==='{')depth++;if(source[i]==='}'&&!--depth)return source.slice(start,i+1);}throw Error(name);}
const ctx={SHAPES:[[[1]],[[1,1]]],challengePieceQueue:[0,1],challengePieceIndex:0,setTimeout:()=>{},updateObjBar:()=>{}};vm.createContext(ctx);vm.runInContext(fn('rndChallenge'),ctx);
assert.strictEqual(ctx.rndChallenge(),ctx.SHAPES[0]);assert.strictEqual(ctx.rndChallenge(),ctx.SHAPES[1]);assert.strictEqual(ctx.rndChallenge(),null);assert.equal(ctx.challengePieceIndex,2);
Object.assign(ctx,{grid:[[1,0]],pieces:[[[1]]],held:null,held2:null,score:12,combo:2,totalLines:3,rotatedSlots:{0:true},advMode:false,updateShopBtns:()=>{}});vm.runInContext(fn('saveState'),ctx);ctx.saveState();ctx.grid[0][0]=0;ctx.rotatedSlots[0]=false;assert.equal(ctx.lastState.grid[0][0],1);assert.equal(ctx.lastState.rotatedSlots[0],true);assert.equal(ctx.lastState.challengePieceIndex,2);
Object.assign(ctx,{isChallenge:true,held:null,held2:null,finishChallenge:()=>{ctx.finished=true},tryAutoStore:()=>false});vm.runInContext(fn('checkState'),ctx);ctx.checkState([null,null,null],null,null);assert(ctx.finished);
const html=fs.readFileSync('index.html','utf8');assert(!html.includes('<style>'));assert(!html.includes('<script>'));assert(html.includes('src="game.js"'));assert(html.includes('href="style.css"'));
for(const name of ['getAdvProgress','saveAdvProgress'])assert.equal((source.match(new RegExp('function '+name+'\\(','g'))||[]).length,1);
assert(source.includes('if(epoch!==gameEpoch)return;'));assert(!source.includes('if(isChallenge){finishChallenge();return;}'));
console.log('Passed: queue exhaustion, completion gate, undo snapshot isolation, external assets, duplicate removal, stale-clear and failed-challenge guards.');
