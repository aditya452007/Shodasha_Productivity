# Project Overview

## Overview

Shodasha is a personal time-management desktop app for Windows. It passively tracks which applications and windows you use, lets you manage tasks on a configurable kanban board, and tracks daily habits with a monthly calendar heatmap. Everything is local — no cloud, no accounts, no HTTP calls.

## Goals

1. Give a clear daily picture of where time went (apps, tasks, habits)
2. Make task management frictionless with kanban drag & drop
3. Encourage habit consistency with calendar heatmap + streaks
4. Connect the dots: which tasks got done, which habits were kept, how much focus time

## Core User Flow

1. User opens Shodasha, sees today's dashboard (tasks, habits, tracked time)
2. Jumps to Board to arrange tasks in kanban columns
3. Works on Windows — apps are tracked silently in background
4. Checks off habits from Habits tab (or dashboard quick-toggle)
5. Reviews Timeline to see how their day/week breaks down
6. Adjusts settings (poll interval, app categories)

## Target Audience

General Windows users who want a lightweight, local-only productivity tracker. Not team/enterprise. Not power analysts. Just someone who wants to see where their time went and stay on top of habits and tasks.

## Success Metrics

- App loads and is usable within 2 seconds
- Activity tracking captures >95% of foreground window switches
- No data loss on app restart (SQLite persistence verified)
- Build passes with zero errors
