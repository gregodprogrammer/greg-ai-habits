# WSL2 — Windows Subsystem for Linux 2

| Field | Value |
|---|---|
| **Purpose** | Guide to setting up and working with WSL2 for this project |
| **Audience** | Windows developers new to Linux-based development |
| **Status** | Active |
| **Owner** | Greg Odi |
| **Maintainer** | Documentation Engineer (Claude Code) |
| **Last Updated** | 2026-08-01 |
| **Related Documents** | [Environment Setup](ENVIRONMENT-SETUP.md) |

---

## What Is WSL2?

WSL2 (Windows Subsystem for Linux 2) lets you run a full Linux environment directly inside
Windows, without a virtual machine or dual boot. This project is developed inside WSL2 (Ubuntu).

**Why use WSL2 for this project?**

- Node.js performs better in Linux than in Windows.
- Shell scripts, Makefiles, and most dev tooling assume a Unix environment.
- Git is faster in WSL2.
- Docker Desktop integrates with WSL2.
- Claude Code runs in a Linux shell environment.

---

## Installation

### 1. Enable WSL2

Open **PowerShell as Administrator** and run:

```powershell
wsl --install
```

This installs WSL2 with Ubuntu as the default distribution. Restart your computer when prompted.

### 2. Verify WSL2 Version

```powershell
wsl --list --verbose
```

You should see `Ubuntu` with `VERSION 2`. If it shows version 1, upgrade:

```powershell
wsl --set-version Ubuntu 2
```

### 3. Open Ubuntu

Search for "Ubuntu" in the Start menu, or run `wsl` in a terminal. Complete the first-time
setup (create a username and password for the Linux environment).

---

## Setting Up the Development Environment Inside WSL2

All commands below run inside the Ubuntu WSL2 terminal.

### Update packages

```bash
sudo apt update && sudo apt upgrade -y
```

### Install build tools

```bash
sudo apt install -y build-essential curl git
```

### Install Node.js via nvm

See [ENVIRONMENT-SETUP.md](ENVIRONMENT-SETUP.md#step-1--install-nodejs-via-nvm) for the nvm installation steps.

---

## File System Notes

WSL2 has two filesystems:

| Location | Performance | When to Use |
|---|---|---|
| `/home/<user>/` (Linux filesystem) | Fast | Always use this for project files |
| `/mnt/c/Users/<user>/` (Windows filesystem) | Slow | Avoid for development; use for accessing Windows files only |

**This project lives at:** `/mnt/c/Users/GREG ODI/Desktop/Greg-AI-Labs/projects/greg-ai-habits`

Note: The project is currently on the Windows filesystem. For best performance, consider
moving it to the Linux filesystem at `/home/<user>/projects/greg-ai-habits` in a future session.

---

## VS Code Integration

Install the **WSL** extension in VS Code. Then, from your WSL2 terminal:

```bash
cd /path/to/greg-ai-habits
code .
```

VS Code opens with the Remote-WSL extension active, meaning all terminal commands run inside WSL2
while the UI stays on Windows.

---

## Claude Code in WSL2

Claude Code runs natively in the WSL2 terminal:

```bash
claude
```

Make sure Claude Code is installed globally:

```bash
npm install -g @anthropic-ai/claude-code
```

---

## Common WSL2 Issues

| Issue | Solution |
|---|---|
| Slow file operations | Move project to `/home/<user>/` Linux filesystem |
| `npm install` permission errors | Run `sudo chown -R $(whoami) ~/.npm` |
| Port 3000 not accessible in browser | Try `localhost:3000` — WSL2 ports are forwarded automatically |
| Git line endings | Run `git config --global core.autocrlf input` |
| `ENOENT` errors with paths | Use forward slashes and avoid spaces in paths |
