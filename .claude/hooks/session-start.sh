#!/bin/bash
# SessionStart hook: import the GPG signing key from a secret and configure git to
# sign commits, so commits made during remote sessions show up as "Verified" on GitHub.
#
# Required secret (set in the remote environment): GPG_PRIVATE_KEY  (armored private key block)
# Optional secret:                                 GPG_PASSPHRASE   (only if the key has one)
#
# Safe to run repeatedly. Does nothing (and never fails the session) when no key is present
# or when running outside the remote environment.
set -euo pipefail

# Only relevant in the remote (Claude Code on the web) environment; locally you use your own key.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Without a key there is nothing to do — skip quietly instead of erroring.
if [ -z "${GPG_PRIVATE_KEY:-}" ]; then
  echo "session-start: GPG_PRIVATE_KEY not set — skipping commit-signing setup." >&2
  exit 0
fi

export GNUPGHOME="${GNUPGHOME:-$HOME/.gnupg}"
mkdir -p "$GNUPGHOME"
chmod 700 "$GNUPGHOME"

# Import the private key (idempotent — re-importing is a no-op).
printf '%s\n' "$GPG_PRIVATE_KEY" | gpg --batch --import >&2 2>&1 || {
  echo "session-start: gpg import failed." >&2
  exit 0
}

# Determine the signing key id (first secret key).
KEYID="$(gpg --list-secret-keys --keyid-format=long --with-colons | awk -F: '/^sec:/{print $5; exit}')"
if [ -z "$KEYID" ]; then
  echo "session-start: no secret key found after import — skipping." >&2
  exit 0
fi

# Git identity + signing config (global so it applies to every repo in the session).
git config --global user.name "Felitendo"
git config --global user.email "felitendoyt@gmail.com"
git config --global user.signingkey "$KEYID"
git config --global commit.gpgsign true
git config --global tag.gpgsign true

if [ -n "${GPG_PASSPHRASE:-}" ]; then
  # Enable non-interactive (loopback) signing and feed the passphrase via a wrapper.
  echo "allow-loopback-pinentry" >> "$GNUPGHOME/gpg-agent.conf"
  gpgconf --reload gpg-agent >/dev/null 2>&1 || true
  printf '%s' "$GPG_PASSPHRASE" > "$GNUPGHOME/.passphrase"
  chmod 600 "$GNUPGHOME/.passphrase"
  cat > "$GNUPGHOME/git-gpg-sign.sh" <<WRAP
#!/bin/bash
exec gpg --batch --pinentry-mode loopback --passphrase-file "$GNUPGHOME/.passphrase" "\$@"
WRAP
  chmod 700 "$GNUPGHOME/git-gpg-sign.sh"
  git config --global gpg.program "$GNUPGHOME/git-gpg-sign.sh"
else
  git config --global gpg.program gpg
fi

echo "session-start: commit signing configured with key $KEYID." >&2
exit 0
