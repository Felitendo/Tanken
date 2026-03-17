#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p data
sqlite3 data/app.db < data/schema.sql
echo "Initialized data/app.db"
