export const TARGETS = [
  // DOORS
  { id:'wood-door', name:'Wooden Door', cat:'door', grade:'wood', emoji:'🚪', hp:200,
    methods: [
      { name:'Explosive Ammo', items:[{n:'Explosive Ammo',c:18}], best:true, note:'Cheapest sulfur option', sulfur:450 },
      { name:'Satchel Charge', items:[{n:'Satchel Charges',c:2}], best:false, sulfur:960 },
      { name:'C4', items:[{n:'Timed C4',c:1}], best:false, sulfur:2200 },
      { name:'Rocket', items:[{n:'Rockets',c:1}], best:false, note:'Leaves ~50 HP, finish with melee', sulfur:1400 },
      { name:'F1 Grenade', items:[{n:'F1 Grenades',c:4}], best:false, sulfur:240 },
    ],
    eco: { best:{tool:'Salvaged Sword',qty:9}, alt:{tool:'Molotov',qty:2}, shells:{qty:45,sulfur:225}, softside:false, note:'No soft side — same damage from both sides' }
  },
  { id:'metal-door', name:'Sheet Metal Door', cat:'door', grade:'metal', emoji:'🚪', hp:250,
    methods: [
      { name:'Explosive Ammo', items:[{n:'Explosive Ammo',c:63}], best:true, note:'1,575 sulfur — most efficient', sulfur:1575 },
      { name:'Satchel Charge', items:[{n:'Satchel Charges',c:4}], best:false, sulfur:1920 },
      { name:'C4', items:[{n:'Timed C4',c:1}], best:false, sulfur:2200 },
      { name:'Rocket', items:[{n:'Rockets',c:1}], best:false, note:'Leaves ~50 HP, finish cheap', sulfur:1400 },
    ],
    eco: { best:{tool:'Salvaged Hammer',qty:24}, alt:{tool:'Mace',qty:53}, softside:false, note:'No soft side — same damage from all angles' }
  },
  { id:'garage-door', name:'Garage Door', cat:'door', grade:'metal', emoji:'🏪', hp:600,
    methods: [
      { name:'Satchel Charge', items:[{n:'Satchel Charges',c:9}], best:false, sulfur:4320 },
      { name:'C4', items:[{n:'Timed C4',c:2}], best:true, note:'4,400 sulfur — fastest & efficient', sulfur:4400 },
      { name:'Rockets', items:[{n:'Rockets',c:3}], best:false, sulfur:4200 },
      { name:'Explosive Ammo', items:[{n:'Explosive Ammo',c:152}], best:false, sulfur:3800 },
    ],
    eco: { best:{tool:'Salvaged Hammer',qty:56}, alt:{tool:'Mace',qty:125}, softside:false, note:'Extremely slow to melee — explosives strongly recommended' }
  },
  { id:'hqm-door', name:'Armored Door', cat:'door', grade:'hqm', emoji:'🚪', hp:800,
    methods: [
      { name:'Explosive Ammo', items:[{n:'Explosive Ammo',c:251}], best:false, sulfur:6275 },
      { name:'Satchel Charge', items:[{n:'Satchel Charges',c:15}], best:false, sulfur:7200 },
      { name:'C4', items:[{n:'Timed C4',c:3}], best:true, note:'6,600 sulfur — most reliable', sulfur:6600 },
      { name:'Rockets', items:[{n:'Rockets',c:5}], best:false, sulfur:7000 },
    ],
    eco: { best:{tool:'Salvaged Hammer',qty:93}, alt:{tool:'Mace',qty:209}, softside:false, note:'Not practical — use explosives' }
  },
  // WALLS
  { id:'wall-wood', name:'Wood Wall', cat:'wall', grade:'wood', emoji:'🪵', hp:250,
    methods: [
      { name:'Explosive Ammo', items:[{n:'Explosive Ammo',c:48}], best:true, note:'1,200 sulfur — cheapest', sulfur:1200 },
      { name:'Satchel Charge', items:[{n:'Satchel Charges',c:3}], best:false, sulfur:1440 },
      { name:'Incendiary Rocket', items:[{n:'Incendiary Rockets',c:2}], best:false, note:'Great low-cost option', sulfur:600 },
      { name:'C4', items:[{n:'Timed C4',c:1}], best:false, sulfur:2200 },
      { name:'Rocket', items:[{n:'Rockets',c:1}], best:false, note:'Leaves ~50 HP, finish cheap', sulfur:1400 },
    ],
    eco: { best:{tool:'Salvaged Sword',qty:8}, alt:{tool:'Hatchet',qty:25}, shells:{qty:50,sulfur:250}, softside:true, note:'SOFT SIDE ONLY — hard side is near-immune to melee' }
  },
  { id:'wall-stone', name:'Stone Wall', cat:'wall', grade:'stone', emoji:'🧱', hp:500,
    methods: [
      { name:'Explosive Ammo', items:[{n:'Explosive Ammo',c:211}], best:false, sulfur:5275 },
      { name:'Satchel Charge', items:[{n:'Satchel Charges',c:10}], best:false, sulfur:4800 },
      { name:'C4', items:[{n:'Timed C4',c:2}], best:true, note:'4,400 sulfur — most efficient', sulfur:4400 },
      { name:'Rockets', items:[{n:'Rockets',c:4}], best:false, sulfur:5600 },
      { name:'Pickaxe (soft side)', items:[{n:'Pickaxe Hits',c:300}], best:false, note:'0 sulfur, soft side only', sulfur:0 },
    ],
    eco: { best:{tool:'Jackhammer',qty:1}, alt:{tool:'Pickaxe',qty:7}, shells:{qty:278,sulfur:695,note:'278 soft / 556 hard'}, softside:true, note:'Jackhammer/pickaxe soft side only. Shells work both sides.' }
  },
  { id:'wall-metal', name:'Sheet Metal Wall', cat:'wall', grade:'metal', emoji:'🏗️', hp:1000,
    methods: [
      { name:'Explosive Ammo', items:[{n:'Explosive Ammo',c:406}], best:false, sulfur:10150 },
      { name:'Satchel Charge', items:[{n:'Satchel Charges',c:23}], best:false, sulfur:11040 },
      { name:'C4', items:[{n:'Timed C4',c:4}], best:true, note:'8,800 sulfur — most efficient', sulfur:8800 },
      { name:'Rockets', items:[{n:'Rockets',c:8}], best:false, sulfur:11200 },
    ],
    eco: { best:{tool:'Jackhammer',qty:3}, alt:{tool:'Salvaged Icepick',qty:30}, softside:true, note:'SOFT SIDE ONLY — 3 jackhammers or 30 icepicks' }
  },
  { id:'wall-hqm', name:'Armored Wall', cat:'wall', grade:'hqm', emoji:'🛡️', hp:2000,
    methods: [
      { name:'Explosive Ammo', items:[{n:'Explosive Ammo',c:806}], best:false, sulfur:20150 },
      { name:'Satchel Charge', items:[{n:'Satchel Charges',c:46}], best:false, sulfur:22080 },
      { name:'C4', items:[{n:'Timed C4',c:8}], best:true, note:'17,600 sulfur — cheapest', sulfur:17600 },
      { name:'Rockets', items:[{n:'Rockets',c:15}], best:false, sulfur:21000 },
    ],
    eco: { best:{tool:'Jackhammer',qty:5}, alt:{tool:'Salvaged Icepick',qty:59}, softside:true, note:'SOFT SIDE ONLY — very slow even with jackhammer' }
  },
  // FLOORS
  { id:'floor-wood', name:'Wood Floor', cat:'floor', grade:'wood', emoji:'🟫', hp:250,
    methods: [
      { name:'Explosive Ammo', items:[{n:'Explosive Ammo',c:48}], best:true, sulfur:1200 },
      { name:'Satchel Charge', items:[{n:'Satchel Charges',c:3}], best:false, sulfur:1440 },
      { name:'C4', items:[{n:'Timed C4',c:1}], best:false, sulfur:2200 },
      { name:'Rocket', items:[{n:'Rockets',c:1}], best:false, note:'Leaves ~50 HP, finish cheap', sulfur:1400 },
    ],
    eco: { best:{tool:'Salvaged Sword',qty:8}, alt:{tool:'Hatchet',qty:25}, shells:{qty:50,sulfur:250}, softside:true, note:'Soft side = underside of the floor' }
  },
  { id:'floor-stone', name:'Stone Floor', cat:'floor', grade:'stone', emoji:'⬛', hp:500,
    methods: [
      { name:'Explosive Ammo', items:[{n:'Explosive Ammo',c:211}], best:false, sulfur:5275 },
      { name:'Satchel Charge', items:[{n:'Satchel Charges',c:10}], best:false, sulfur:4800 },
      { name:'C4', items:[{n:'Timed C4',c:2}], best:true, note:'4,400 sulfur — most efficient', sulfur:4400 },
      { name:'Rockets', items:[{n:'Rockets',c:4}], best:false, sulfur:5600 },
    ],
    eco: { best:{tool:'Jackhammer',qty:1}, alt:{tool:'Pickaxe',qty:7}, shells:{qty:278,sulfur:695,note:'278 soft / 556 hard'}, softside:true, note:'Soft side only for melee. Attack from below.' }
  },
  { id:'floor-metal', name:'Sheet Metal Floor', cat:'floor', grade:'metal', emoji:'⬜', hp:1000,
    methods: [
      { name:'Explosive Ammo', items:[{n:'Explosive Ammo',c:406}], best:false, sulfur:10150 },
      { name:'Satchel Charge', items:[{n:'Satchel Charges',c:23}], best:false, sulfur:11040 },
      { name:'C4', items:[{n:'Timed C4',c:4}], best:true, note:'8,800 sulfur', sulfur:8800 },
      { name:'Rockets', items:[{n:'Rockets',c:8}], best:false, sulfur:11200 },
    ],
    eco: { best:{tool:'Jackhammer',qty:3}, alt:{tool:'Salvaged Icepick',qty:30}, softside:true, note:'SOFT SIDE ONLY — attack from below' }
  },
  { id:'floor-hqm', name:'Armored Floor', cat:'floor', grade:'hqm', emoji:'🔲', hp:2000,
    methods: [
      { name:'Explosive Ammo', items:[{n:'Explosive Ammo',c:806}], best:false, sulfur:20150 },
      { name:'Satchel Charge', items:[{n:'Satchel Charges',c:46}], best:false, sulfur:22080 },
      { name:'C4', items:[{n:'Timed C4',c:8}], best:true, note:'17,600 sulfur — cheapest', sulfur:17600 },
      { name:'Rockets', items:[{n:'Rockets',c:15}], best:false, sulfur:21000 },
    ],
    eco: { best:{tool:'Jackhammer',qty:5}, alt:{tool:'Salvaged Icepick',qty:59}, softside:true, note:'SOFT SIDE ONLY — very slow' }
  },
  // OTHER
  { id:'tc-wood', name:'Tool Cupboard', cat:'other', grade:'wood', emoji:'🏛️', hp:250,
    methods: [
      { name:'Explosive Ammo', items:[{n:'Explosive Ammo',c:48}], best:true, note:'1,200 sulfur', sulfur:1200 },
      { name:'Satchel Charge', items:[{n:'Satchel Charges',c:3}], best:false, sulfur:1440 },
      { name:'C4', items:[{n:'Timed C4',c:1}], best:false, sulfur:2200 },
    ],
    eco: { best:{tool:'Molotov',qty:1}, alt:{tool:'Salvaged Sword',qty:5}, shells:{qty:10,sulfur:50}, softside:false, note:'1 Molotov destroys it — cheapest possible raid' }
  },
  { id:'turret', name:'Auto Turret', cat:'other', grade:'metal', emoji:'🎯', hp:1000,
    methods: [
      { name:'Explosive Ammo', items:[{n:'Explosive Ammo',c:100}], best:false, sulfur:2500 },
      { name:'Satchel Charge', items:[{n:'Satchel Charges',c:2}], best:true, note:'960 sulfur — very cheap', sulfur:960 },
      { name:'C4', items:[{n:'Timed C4',c:1}], best:false, sulfur:2200 },
      { name:'Rockets', items:[{n:'Rockets',c:4}], best:false, sulfur:5600 },
    ],
    eco: { best:{tool:'Jackhammer',qty:1}, alt:{tool:'Salvaged Sword',qty:1}, softside:false, note:'Very fast with jackhammer — disable it first!' }
  },
  { id:'sam-site', name:'SAM Site', cat:'other', grade:'metal', emoji:'🚀', hp:1000,
    methods: [
      { name:'Explosive Ammo', items:[{n:'Explosive Ammo',c:100}], best:false, sulfur:2500 },
      { name:'Satchel Charge', items:[{n:'Satchel Charges',c:2}], best:true, note:'960 sulfur', sulfur:960 },
      { name:'C4', items:[{n:'Timed C4',c:1}], best:false, sulfur:2200 },
      { name:'Rockets', items:[{n:'Rockets',c:4}], best:false, sulfur:5600 },
    ],
    eco: { best:{tool:'Jackhammer',qty:1}, alt:{tool:'Salvaged Sword',qty:1}, softside:false, note:'Melee is viable — disable it before approaching' }
  },
  { id:'ladder-hatch', name:'Ladder Hatch', cat:'other', grade:'metal', emoji:'🔩', hp:300,
    methods: [
      { name:'Explosive Ammo', items:[{n:'Explosive Ammo',c:64}], best:true, note:'1,600 sulfur — most efficient', sulfur:1600 },
      { name:'Satchel Charge', items:[{n:'Satchel Charges',c:4}], best:false, sulfur:1920 },
      { name:'C4', items:[{n:'Timed C4',c:1}], best:false, sulfur:2200 },
      { name:'Rocket', items:[{n:'Rockets',c:1}], best:false, note:'Leaves ~50 HP, finish cheap', sulfur:1400 },
    ],
    eco: { best:{tool:'Salvaged Hammer',qty:24}, alt:{tool:'Mace',qty:53}, softside:false, note:'Same damage from both sides' }
  },
  { id:'ext-wall-wood', name:'HE Wooden Wall', cat:'wall', grade:'wood', emoji:'🌲', hp:500,
    methods: [
      { name:'Explosive Ammo', items:[{n:'Explosive Ammo',c:93}], best:false, sulfur:2325 },
      { name:'Satchel Charge', items:[{n:'Satchel Charges',c:6}], best:false, sulfur:2880 },
      { name:'C4', items:[{n:'Timed C4',c:1}], best:true, note:'Leaves ~50 HP, finish cheap', sulfur:2200 },
      { name:'Incendiary Rocket', items:[{n:'Incendiary Rockets',c:2}], best:false, sulfur:600 },
    ],
    eco: { best:{tool:'Molotov',qty:7}, alt:{tool:'Salvaged Sword',qty:16}, shells:{qty:90,sulfur:450}, softside:false, note:'Molotovs are the eco choice for external wooden walls' }
  },
  { id:'ext-wall-stone', name:'HE Stone Wall', cat:'wall', grade:'stone', emoji:'🪨', hp:500,
    methods: [
      { name:'Explosive Ammo', items:[{n:'Explosive Ammo',c:184}], best:false, sulfur:4600 },
      { name:'Satchel Charge', items:[{n:'Satchel Charges',c:10}], best:false, sulfur:4800 },
      { name:'C4', items:[{n:'Timed C4',c:2}], best:true, note:'4,400 sulfur', sulfur:4400 },
      { name:'Rockets', items:[{n:'Rockets',c:4}], best:false, sulfur:5600 },
    ],
    eco: { best:{tool:'Jackhammer',qty:5}, alt:{tool:'Salvaged Icepick',qty:64}, shells:{qty:556,sulfur:1390,note:'Any side'}, softside:true, note:'Soft side only for melee. Shells work any side — 556.' }
  },
];

export function findTarget(query) {
  const q = query.toLowerCase().replace(/[-_\s]/g, '');
  return TARGETS.find(t =>
    t.id.replace(/-/g,'') === q ||
    t.name.toLowerCase().replace(/\s/g,'').includes(q) ||
    t.id.includes(query.toLowerCase())
  );
}

export function gradeEmoji(grade) {
  return { wood:'🪵', stone:'🧱', metal:'⚙️', hqm:'💎' }[grade] || '❓';
}

export function sulfurEmoji(s) {
  if (s === 0) return '🆓';
  if (s < 1500) return '🟢';
  if (s < 5000) return '🟡';
  return '🔴';
}
