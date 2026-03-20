/**
 * decayScheduler.js
 * Manages in-memory decay timers. Each timer:
 *   - Fires a 5-minute warning DM to the user
 *   - Fires a final "it's gone" DM when decay completes
 *   - Can be cancelled with /decaycancel
 */

const activeTimers = new Map(); // timerId -> { warnTimeout, finalTimeout, meta }
let nextId = 1;

const TIERS = {
  twig:    { label: '🪵 Twig',         color: 0xcd853f, baseHours: 1,   maxHp: 100  },
  wood:    { label: '🌲 Wood',          color: 0xc4a265, baseHours: 3,   maxHp: 250  },
  stone:   { label: '🧱 Stone',         color: 0xbdc3c7, baseHours: 5,   maxHp: 500  },
  metal:   { label: '🏗️ Sheet Metal',   color: 0x85929e, baseHours: 8,   maxHp: 1000 },
  armored: { label: '🛡️ Armored (HQM)', color: 0x7ec8c8, baseHours: 12,  maxHp: 2000 },
};

export { TIERS };

export function scheduleDecay(client, userId, tier, hp, coords) {
  const t = TIERS[tier];
  const hpPct = Math.max(1, Math.min(hp, t.maxHp)) / t.maxHp;
  const decayMs = t.baseHours * 3600_000 * hpPct;
  const warnMs  = decayMs - 5 * 60_000; // 5 min before
  const decayAt = new Date(Date.now() + decayMs);

  const id = nextId++;
  const meta = {
    id,
    userId,
    tier,
    hp: Math.min(hp, t.maxHp),
    coords: coords || null,
    decayAt,
    decayMs,
    tierLabel: t.label,
  };

  async function sendDm(embedData) {
    try {
      const user = await client.users.fetch(userId);
      await user.send({ embeds: [embedData] });
    } catch (err) {
      console.warn(`[DecayScheduler] Could not DM user ${userId}:`, err.message);
    }
  }

  // 5-minute warning
  let warnTimeout = null;
  if (warnMs > 0) {
    warnTimeout = setTimeout(async () => {
      const { EmbedBuilder } = await import('discord.js');
      const embed = new EmbedBuilder()
        .setColor(0xf39c12)
        .setTitle('⚠️ Decay Warning — 5 Minutes Left!')
        .setDescription(`Your **${t.label}** structure is about to fully decay!`)
        .addFields(
          { name: '🏚️ Structure', value: `${t.label} at **${meta.hp} HP**`, inline: true },
          { name: '⏰ Decays At', value: `<t:${Math.floor(decayAt.getTime() / 1000)}:T>`, inline: true },
          { name: '🆔 Timer ID', value: `\`#${id}\``, inline: true },
        );

      if (coords) {
        embed.addFields({ name: '📍 Coordinates', value: `\`${coords}\``, inline: false });
      }

      embed.setFooter({ text: 'Get there now! Use /decaycancel if you\'ve already sorted it.' });
      await sendDm(embed);
    }, warnMs);
  }

  // Final decay notification
  const finalTimeout = setTimeout(async () => {
    const { EmbedBuilder } = await import('discord.js');
    const embed = new EmbedBuilder()
      .setColor(0xe74c3c)
      .setTitle('💀 Structure Fully Decayed!')
      .setDescription(`Your **${t.label}** structure has reached 0 HP and is gone.`)
      .addFields(
        { name: '🏚️ Structure', value: `${t.label} (was **${meta.hp} HP**)`, inline: true },
        { name: '🆔 Timer ID', value: `\`#${id}\``, inline: true },
      );

    if (coords) {
      embed.addFields({ name: '📍 Was Located At', value: `\`${coords}\``, inline: false });
    }

    embed.setFooter({ text: 'Timer #' + id + ' has been removed.' });
    await sendDm(embed);
    activeTimers.delete(id);
  }, decayMs);

  activeTimers.set(id, { warnTimeout, finalTimeout, meta });
  return { id, decayAt, decayMs, tier: t };
}

export function cancelDecay(id) {
  const entry = activeTimers.get(id);
  if (!entry) return false;
  clearTimeout(entry.warnTimeout);
  clearTimeout(entry.finalTimeout);
  activeTimers.delete(id);
  return entry.meta;
}

export function listDecays(userId) {
  return [...activeTimers.values()]
    .filter(e => e.meta.userId === userId)
    .map(e => e.meta);
}

export function getAllDecays() {
  return [...activeTimers.values()].map(e => e.meta);
}

export function formatTimeLeft(decayAt) {
  const msLeft = decayAt.getTime() - Date.now();
  if (msLeft <= 0) return 'now';
  const totalSecs = Math.floor(msLeft / 1000);
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
