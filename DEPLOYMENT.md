# 🐰 Bunni Bot — Setup & Cloudflare Workers Deployment Guide

---

## ⚠️ Important Note About Cloudflare Workers

Cloudflare Workers **cannot** run a Discord bot the traditional way. Workers are serverless
functions that respond to HTTP requests — they don't stay online 24/7 waiting for Discord events.

**For a proper Discord bot you have two good free options:**

| Option | Best For | Cost |
|--------|----------|------|
| **Railway** | Easiest, stays online always | Free (500hrs/mo) |
| **Render** | Also easy, free tier | Free (spins down after 15min idle) |
| **Your HoboHost VPS** | You already pay for it | $0 extra |
| **Cloudflare Workers** | Only works for HTTP-based bots (more complex) | Free |

**Recommendation: Use Railway or your HoboHost server.**
The Cloudflare Workers approach requires rewriting the bot as an HTTP interactions endpoint
(no autocomplete, no deferred replies) — it's much more work for the same result.

This guide covers **Railway** (easiest) AND **HoboHost VPS** (if you have SSH access).

---

## PART 1 — Create the Discord Bot

### Step 1 — Create a Discord Application

1. Go to **https://discord.com/developers/applications**
2. Click **"New Application"** in the top right
3. Name it **"Bunni Bot"** (or whatever you like) → click **Create**

### Step 2 — Create the Bot User

1. In the left sidebar click **"Bot"**
2. Click **"Add Bot"** → **"Yes, do it!"**
3. Under **"Token"** click **"Reset Token"** → copy and save this token somewhere safe
   > ⚠️ **Never share this token.** Anyone with it controls your bot.
4. Scroll down to **"Privileged Gateway Intents"** — you don't need any for this bot, leave them off
5. Under **"Bot Permissions"** make sure **"Send Messages"** and **"Use Slash Commands"** are on

### Step 3 — Get Your Application (Client) ID

1. Click **"General Information"** in the left sidebar
2. Copy the **"Application ID"** — you'll need this

### Step 4 — Invite the Bot to Your Server

1. Click **"OAuth2"** → **"URL Generator"** in the sidebar
2. Under **Scopes** check: `bot` and `applications.commands`
3. Under **Bot Permissions** check: `Send Messages`, `Embed Links`, `Read Message History`
4. Copy the generated URL at the bottom and open it in your browser
5. Select your server → **Authorize**

---

## PART 2A — Deploy on Railway (Easiest)

### Step 1 — Create a GitHub Repository

1. Go to **https://github.com** → sign in or create an account
2. Click **"New repository"** → name it `rustbunni-bot` → **Create repository**
3. Upload all the bot files (the `rustbunni-bot` folder contents) to the repo
   - You can drag and drop files into the GitHub web interface
   - Make sure `.env` is **NOT** uploaded (it's in .gitignore for a reason)

### Step 2 — Sign Up for Railway

1. Go to **https://railway.app**
2. Click **"Start a New Project"** → sign in with GitHub
3. Click **"Deploy from GitHub repo"**
4. Select your `rustbunni-bot` repository

### Step 3 — Add Environment Variables

1. In your Railway project, click your service
2. Click **"Variables"** tab
3. Add these two variables:
   - `DISCORD_TOKEN` = your bot token from Step 2
   - `CLIENT_ID` = your Application ID from Step 3
4. Railway will automatically redeploy

### Step 4 — Verify It's Running

1. Click the **"Logs"** tab in Railway
2. You should see:
   ```
   Registering slash commands...
   Slash commands registered.
   ✅ Bunni Bot online as Bunni Bot#1234
   ```
3. Go to your Discord server and try `/help`

**That's it. Railway keeps it running 24/7.**

---

## PART 2B — Deploy on HoboHost VPS (if you have SSH/terminal access)

> This only works if your HoboHost plan includes a VPS with SSH access.
> Shared hosting (cPanel only) cannot run a persistent Node.js process.
> If you only have cPanel, use Railway instead.

### Step 1 — SSH Into Your Server

Open a terminal and run:
```bash
ssh username@your-server-ip
```

### Step 2 — Install Node.js 18+

```bash
# Check if Node is already installed
node --version

# If not installed or below v18, install it:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 3 — Upload Your Bot Files

From your local computer, upload the bot folder:
```bash
# Run this on YOUR computer (not the server)
scp -r ./rustbunni-bot username@your-server-ip:~/
```

Or use an FTP client like FileZilla to upload via SFTP.

### Step 4 — Set Up the Bot

SSH back into the server and run:
```bash
cd ~/rustbunni-bot

# Install dependencies
npm install

# Create your .env file
cp .env.example .env
nano .env
```

In the nano editor, fill in your values:
```
DISCORD_TOKEN=your_actual_token_here
CLIENT_ID=your_actual_client_id_here
```
Press `Ctrl+X` → `Y` → `Enter` to save.

### Step 5 — Test It Works

```bash
node src/index.js
```

You should see the bot come online. Press `Ctrl+C` to stop.

### Step 6 — Keep It Running with PM2

PM2 is a process manager that keeps your bot running even after you close the terminal:

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the bot with PM2
pm2 start src/index.js --name "bunni-bot"

# Make it restart automatically if the server reboots
pm2 startup
pm2 save

# Check it's running
pm2 status

# View logs
pm2 logs bunni-bot
```

---

## PART 2C — Cloudflare Workers (Advanced, HTTP-only)

Cloudflare Workers works by receiving HTTP POST requests from Discord instead of
maintaining a persistent WebSocket connection. This requires:

1. Verifying Discord's Ed25519 signatures on every request
2. Responding within **3 seconds** (no long operations)
3. No autocomplete support (different interaction type)
4. No deferred replies for slow operations like `/breed`

**If you still want this approach**, here's the outline:

1. Create a Worker at **https://workers.cloudflare.com**
2. Set your **Interactions Endpoint URL** in the Discord Developer Portal
   (General Information → Interactions Endpoint URL)
3. The Worker must verify requests using `DISCORD_PUBLIC_KEY`
4. Each command returns JSON directly in the same HTTP response

The breed command is the main problem — the algorithm can run in under 3s for small
pools, but Discord requires an immediate ACK response, then a followup. Workers support
this via `type: 5` (deferred) + a second fetch to Discord's webhook URL, but it
adds significant complexity.

**Verdict: Railway or HoboHost VPS is far simpler. Only use Workers if you specifically
need serverless scaling.**

---

## Quick Reference — Bot Commands

| Command | Example | What it does |
|---------|---------|-------------|
| `/raid` | `/raid target:stone-wall qty:2` | All explosive methods + sulfur costs |
| `/ecoraid` | `/ecoraid target:wood-wall players:3` | Melee/shell methods split by player count |
| `/sulfur` | `/sulfur item:rocket qty:15` | Sulfur, GP, charcoal needed to craft |
| `/breed` | `/breed clones:GGYYWX GGWYYY GYGYYY` | Step-by-step path to god clone |
| `/code` | `/code` | Code lock attempt limits & damage info |
| `/help` | `/help` | All commands listed |

---

## Troubleshooting

**Commands not showing up in Discord:**
- Wait 1–2 minutes after first startup (global commands take time)
- Check Railway/PM2 logs for registration errors
- Make sure `CLIENT_ID` is correct (Application ID, not Bot ID)

**"Missing Access" error:**
- Re-invite the bot using the OAuth2 URL with `applications.commands` scope

**Bot goes offline:**
- Railway free tier: Check your usage hours (500/month limit)
- HoboHost VPS: Run `pm2 status` — if stopped, `pm2 restart bunni-bot`

**Breed command takes too long:**
- With 15+ clones the 3-way search can be slow. It still runs fine on Node.js
  but would time out on Cloudflare Workers (another reason to use Railway/VPS)
