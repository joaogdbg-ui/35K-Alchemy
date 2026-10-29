import test from 'node:test';
import assert from 'node:assert/strict';
import {publicText,publicName,buildPublicNameIndex,PUBLIC_IP_SIGNALS,hasUnresolvedPublicIPSignal} from '../src/ip-safe-names.js';
test('Mock labels replace console and entertainment identities, preserving input',()=>{
 const data=[
 ['Nintendo Switch 2 Cartridge Case','GlidePort II Cartridge Case'],
 ['Game Boy Camera Album','PocketNova Camera Album'],
 ['PlayStation 5 Vertical Cooling Stand','Qelvorune 5 Vertical Cooling Stand'],
 ['Xbox Series X Ventilation Grille','AsterCube Zenith Ventilation Grille'],
 ['Sonic the Hedgehog','Windrush the Hedgehog'],
 ['Pokémon Red','Critter Atlas Red'],
 ['Dragon Ball Z: Budokai 3','Sky Orbs Z: Budokai 3']
 ];
 for(const [oldName,newName] of data)assert.equal(publicText(oldName),newName);
 assert.equal(publicName({name:'Mario Kart'}),'Mosskip Kart');
});
test('Public-name index preserves identifiers and disambiguates coincident labels',()=>{
 const items=[{id:'a',name:'PlayStation'},{id:'b',name:'Qelvorune'},{id:'c',name:'Water'}];
 const original=items.map(x=>x.name);
 const out=buildPublicNameIndex(items);
 assert.deepEqual(items.map(x=>x.name),original);
 assert.equal(out.get('a'),'Qelvorune');
 assert.equal(out.get('b'),'Qelvorune — Edition 2');
 assert.equal(out.get('c'),'Water');
});
test('High-confidence franchise signals are absent from sample public labels',()=>{
 const samples=['Nintendo 64','Game Boy Advance','PlayStation 2','Xbox One','Sega Genesis','Atari Jaguar','Pokémon','Mario','Kirby','Sonic','Metal Gear Solid','Star Wars','Final Fantasy','Dragon Ball','Spider-Man','Batman','Minecraft'];
 for(const name of samples){
  const result=publicText(name);
  for(const signal of PUBLIC_IP_SIGNALS)assert.equal(signal.test(result),false,name+' => '+result);
 }
});

test('Game-title names do not rewrite non-media common words',()=>{
  assert.equal(publicName({name:'Hades',category:'mythology'}),'Hades');
  assert.equal(publicName({name:'Hades',category:'game'}),'Underrealm');
  assert.equal(publicName({name:'Half-Life 2',category:'game'}),'Half Dawn 2');
  assert.equal(publicName({name:'The Sims 4',category:'game'}),'Life Neighbors 4');
  assert.equal(hasUnresolvedPublicIPSignal({name:'Hades',category:'mythology'}),false);
  assert.equal(hasUnresolvedPublicIPSignal({name:'Monster Hunter',category:'game'}),false);
});

test('V76.2 context-specific original game aliases do not rewrite generic science terms',()=>{
 const examples=[['Ninja Gaiden','Nightsunder Legacy'],['Dino Crisis','Raptor Emergency'],['Battletoads','Marsh Brawlers'],['Prince of Persia','Prince of the Dunes'],['Yu-Gi-Oh! Master Duel','Cardbound Legends! Master Duel']];
 for(const [original,expected] of examples)assert.equal(publicName({name:original,category:'game'}),expected);
 for(const n of ['Valve','Halo','Portal','Sonic Wave','DOOM','Knuckles'])
   assert.equal(publicName({name:n,category:'science'}),n);
 assert.equal(publicName({name:'Hades',category:'mythology'}),'Hades');
});
