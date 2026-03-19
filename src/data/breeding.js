const WEIGHT = { G:1, Y:1, H:1, W:2, X:2 };
const VALID  = new Set(['G','Y','H','W','X']);

export function parseGene(s) {
  return s.toUpperCase().split('').filter(c => VALID.has(c)).slice(0, 6).join('');
}

export function isValidGene(g) {
  return g.length === 6 && [...g].every(c => VALID.has(c));
}

export function scoreGene(g, target = 'GGGYYY') {
  const tc = {};
  for (const c of target) tc[c] = (tc[c] || 0) + 1;
  let s = 0;
  for (const c of g) { if (tc[c] > 0) { s++; tc[c]--; } }
  return s;
}

function majorityCross(plants, slot) {
  const tally = {};
  for (const p of plants) {
    const g = p[slot];
    if (VALID.has(g)) tally[g] = (tally[g] || 0) + WEIGHT[g];
  }
  if (!Object.keys(tally).length) return '?';
  const max = Math.max(...Object.values(tally));
  const winners = Object.keys(tally).filter(k => tally[k] === max);
  return winners.length === 1 ? winners[0] : '?';
}

function planterResult(plants) {
  return Array.from({length:6}, (_,i) => majorityCross(plants, i)).join('');
}

export function findBreedingPath(clones, target = 'GGGYYY') {
  const pool = [...new Set(clones)];
  pool.sort((a, b) => scoreGene(b, target) - scoreGene(a, target));

  for (const g of pool) {
    if (scoreGene(g, target) === 6) return { found: true, steps: [], best: g };
  }

  const steps = [];
  const visited = new Set(pool);
  const working = [...pool];

  for (let iter = 0; iter < 14; iter++) {
    let best = working.reduce((a,b) => scoreGene(a,target) >= scoreGene(b,target) ? a : b);
    if (scoreGene(best, target) === 6) return { found: true, steps, best };

    const bs = scoreGene(best, target);
    const allCands = [];

    // 2-way
    for (let i = 0; i < working.length; i++) {
      for (let j = i; j < working.length; j++) {
        const r = planterResult([working[i], working[j]]);
        if (!r.includes('?') && !visited.has(r)) {
          allCands.push({ sc: scoreGene(r, target), plants: [working[i], working[j]], r });
        }
      }
    }
    // 3-way
    if (working.length <= 18) {
      for (let i = 0; i < working.length; i++) {
        for (let j = i; j < working.length; j++) {
          for (let k = j; k < working.length; k++) {
            const r = planterResult([working[i], working[j], working[k]]);
            if (!r.includes('?') && !visited.has(r)) {
              allCands.push({ sc: scoreGene(r, target), plants: [working[i], working[j], working[k]], r });
            }
          }
        }
      }
    }

    if (!allCands.length) break;
    allCands.sort((a, b) => b.sc - a.sc);
    const top = allCands[0];
    if (top.sc < bs) break;

    const p = top.plants;
    steps.push(p.length === 2
      ? { a: p[0], b: p[1], result: top.r }
      : { a: p[0], b: p[1], extra: p[2], result: top.r }
    );
    visited.add(top.r);
    working.push(top.r);
    if (top.sc === 6) return { found: true, steps, best: top.r };
  }

  const best = working.reduce((a,b) => scoreGene(a,target) >= scoreGene(b,target) ? a : b);
  return { found: scoreGene(best,target) === 6, steps, best, bestScore: scoreGene(best,target) };
}

export function geneBar(str) {
  const map = { G:'🟩', Y:'🟨', H:'🟦', W:'🟥', X:'⬛' };
  return [...(str||'??????')].map(c => map[c] || '❓').join('');
}

export function qualityLabel(sc) {
  if (sc === 6) return '🏆 GOD CLONE';
  if (sc === 5) return '⭐ Near Perfect';
  if (sc === 4) return '✅ Good';
  if (sc === 3) return '🟡 Decent';
  return '❌ Weak';
}
