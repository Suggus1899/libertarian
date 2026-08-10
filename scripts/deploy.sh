#!/bin/bash
set -e
LOG=/var/log/libertarian-deploy.log
echo "=== Deploy started at $(date) ===" >> "$LOG"
cd /var/www/libertarian
git pull >> "$LOG" 2>&1
pnpm build >> "$LOG" 2>&1
pm2 restart libertarian >> "$LOG" 2>&1
echo "=== Deploy finished at $(date) ===" >> "$LOG"
