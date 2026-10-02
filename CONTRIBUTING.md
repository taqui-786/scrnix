# Scrinx Contributor Guide

## Introduction

### What is Scrinx?

Scrinx is an open source and privacy focused alternative to Loom. It's a video messaging tool that allows you to record, edit and share videos in seconds.

The development of Scrinx is still in its early stages, so please bear with us as we build out this guide.

### What is this guide?

This guide is for anyone who wants to contribute to Scrinx. It's a work in progress, and will be updated regularly.

### How can I contribute?

There are many ways to contribute to Scrinx. You can:

- [Report a bug](https://github.com/taqui-786/scrnix/issues/new)
- Suggest a feature (via GitHub Issues or Discussions)
- Submit a PR

## Running Scrinx

### Development Requirements

Before anything else, make sure you have the following installed:

- Node Version 20+
- Rust 1.88.0+
- Bun 1.4.0
- Docker ([OrbStack](https://orbstack.dev/) recommended)

### General Setup

Run `bun install`, then run `bun run env-setup` to generate a `.env` file configured for your environment.
It will ask you which apps you intend to run, whether you'd like to use Docker to run S3 (MinIO) and MySQL locally,
and allow you to provide overrides as needed.

Then run `bun run cap-setup` to install native dependencies such as FFmpeg.

On Windows, llvm, clang, and VCPKG must be installed.
On MacOS, cmake must be installed.
`bun run cap-setup` does not yet install these dependencies for you.

To run both desktop and web together, use `bun run dev`.
To run only one of them, use `bun run dev:desktop` or `bun run dev:web` respectively.

### Desktop app

When running the desktop app from a terminal on macOS,
you will need to grant permissions (screen recording, microphone, etc.) to the terminal, not the app.
For example, if you run `bun run dev:desktop` in the macOS `Terminal.app`,
you will need to grant permissions to it instead of the app bundle.

#### Where are my recordings stored?

You can find your recordings at `~/Library/Application Support/com.scrinx.desktop.dev/recordings` on macOS,
and `%programfiles%/com.scrinx.desktop.dev/recordings` on Windows.

### Web app (scrinx.com website)

When running `bun run dev` or `bun run dev:web`, a MySQL database and MinIO S3 server will also be using Docker.
If you want to _only_ run the web NextJS app, `cd` into `./apps/web` and run `bun run dev`.
