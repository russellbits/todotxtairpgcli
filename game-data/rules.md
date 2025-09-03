# TodoTxtAiRPG Documentation

## Overview

TodoTxtAiRPG is a gamified productivity system that extends the standard todo.txt format with RPG elements. It maintains full compatibility with existing todo.txt tools while adding character progression, experience points, and attribute building to make task completion feel like an adventure.

## Core Philosophy

The system transforms real-world productivity into a role-playing game where:
- Completing tasks earns Experience Points (XP)
- Different types of work build different character attributes
- Projects become epic quests with completion bonuses
- Daily habits become recurring adventures
- Progress tracking becomes achievement hunting

## Standard Todo.txt Compatibility

All RPG extensions use characters and formatting that standard todo.txt parsers will ignore:
- `#hashtags` appear as normal text
- `!points` appear as normal text  
- Emoji appear as normal text or are safely ignored
- All standard todo.txt syntax remains valid (priorities, dates, contexts, projects, key:value pairs)

This ensures your gamified todo list works with existing todo.txt applications and workflows.

## Character System

### Character Stats
Every player has:
- **Species & Class**: Flavor text for personalization
- **Class Level**: Determined by total XP earned
- **Experience Points**: Earned by completing tasks
- **Health Points & Mana Points**: RPG flavor stats
- **Six Attributes**: Strength, Intelligence, Wisdom, Dexterity, Constitution, Charisma

### Attribute Building
Tasks can boost specific attributes using emoji indicators:
- **Strength (💪)**: Physical tasks, exercise, manual work
- **Intelligence (🧠)**: Learning, coding, analysis, problem-solving
- **Wisdom (🦉)**: Meditation, reflection, reading, research
- **Dexterity (🤹)**: Skill-based tasks, crafts, design work
- **Constitution (❤️)**: Health tasks, endurance activities
- **Charisma (🌟)**: Social tasks, writing, presentations

Multiple emoji can be used on a single task to build multiple attributes.

## Task Types & Point System

### Regular Tasks
Standard todo.txt tasks can include:
- **Simple Points**: `!50` awards 50 XP on completion
- **Attribute Emoji**: Build character stats while earning XP

Example: `2025-08-30 Morning workout @health !15 💪❤️`

### Recurring Tasks (`#recur`)
Tasks that repeat either on time intervals or immediately upon completion:

#### Time-Based Recurring
- **Format**: `#recur !points unit:interval`
- **Behavior**: When completed, task is marked done AND recreated for the next time interval
- **Use Case**: Habits, schedules, maintenance, reviews

Examples:
- `2025-08-30 Meditate @health #recur !10 unit:daily 🦉` (daily habit)
- `2025-08-30 Weekly review @planning #recur !25 unit:weekly 🦉` (weekly routine)
- `2025-08-30 Take vitamins @health #recur !5 unit:hourly ❤️` (hourly reminder)

#### Completion-Based Recurring
- **Format**: `#recur !points` (no unit specified)
- **Behavior**: When completed, task is marked done AND immediately recreated for next completion
- **Use Case**: Ongoing processes, iterative work, endless productive activities

Examples:
- `2025-08-31 1 Pomodoro writing anything @writing #recur !50 🌟` (write another pomodoro when ready)
- `2025-08-31 Do 10 pushups @fitness #recur !15 💪` (do another set when ready)
- `2025-08-31 Make 1 sales call @work #recur !25 🌟` (make another call when ready)

### Count Tasks (`#count`)
Progress tracking toward numerical goals:
- **Format**: `#count !multiplier|target total:current`
- **Optional**: `unit:description` key-value pair for clarity
- **Behavior**: Track incremental progress, award points based on progress made
- **Use Case**: Reading pages, exercise reps, study hours, creative output

Examples:
- `2025-08-30 Reading "Nexus" @reading #count !1|400 total:31 unit:pages 🦉`
- `2025-08-30 Practice guitar @music #count !2|100 total:15 unit:minutes 🤹`
- `2025-08-30 Pushups challenge @fitness #count !1|1000 total:50 unit:reps 💪`

### Project Tasks (`#project`)
Multi-task endeavors with completion bonuses:
- **Format**: `#project !individual&completion`
- **Behavior**: Earn individual XP per task + bonus XP when entire project completes
- **Use Case**: Complex projects, creative works, major goals

Example: `2025-08-30 Write Chapter 39 +brotherdustfish #project !25&1000 🦉`
- Earn 25 XP for completing this task
- Earn 1000 XP bonus when all +brotherdustfish project tasks are complete

## Syntax Reference

### New Special Characters
- `#` = Task type indicator (`#recur`, `#count`, `#project`)
- `!` = Points system (various formats depending on task type)
- Emoji = Attribute boosters
- `unit:` = Key-value pair for specifying time intervals (optional for `#recur`)

### Point System Formats
- `!50` = Simple 50 XP reward
- `!10 unit:daily` = Time-based recurring task worth 10 XP (used with `#recur`)
- `!50` = Completion-based recurring task worth 50 XP (used with `#recur`, no unit)
- `!1|400 unit:pages` = Count task worth 1 XP per page, target 400 (used with `#count`)
- `!25&1000` = Project task worth 25 XP individual + 1000 XP project bonus (used with `#project`)

### Task Type Behaviors

| Type | Format | Completion Behavior | Point Award |
|------|--------|-------------------|-------------|
| Regular | `!points` | Mark complete | Simple XP award |
| Time Recurring | `#recur !points unit:interval` | Mark complete + recreate next interval | XP award + task resets |
| Completion Recurring | `#recur !points` | Mark complete + recreate immediately | XP award + task resets |
| Count | `#count !mult\|target total:X unit:description` | Update progress counter | Multiplier × progress made |
| Project | `#project !ind&bonus` | Mark complete + track project progress | Individual XP + bonus when project done |

## Character Progression

### Experience Points
- Earned by completing any task with a point value
- Determine class level advancement
- Provide sense of overall progress and achievement

### Attribute Advancement
- Built by completing tasks with relevant emoji
- Each attribute levels independently
- Provide specialization and character development
- Visual feedback through emoji and progress tracking

### Class Levels
- Advance based on total XP thresholds
- Provide milestone achievements
- Offer flavor text and personalization (e.g., "Level 1 - Purveyor of Cool")

## Display Format

### Character YAML Example
```
# TODOTXTAIRPG Character Sheet
# This file tracks all character progression, stats, and inventory
# Keep separate from the todo.txt task list

character:
  # Basic Identity
  name: "Ruz El"
  title: "Ranger of the Endless Tasks"
  species: "Elf"
  class: "Ranger"
  class_level: 1
  class_title: "Purveyor of Cool"
  
  # Core Stats
  experience_points: 631
  xp_to_next_level: 370
  health_points: 12
  max_health: 12
  mana_points: 8
  max_mana: 8

  # RPG Attributes
  attributes:
    strength:
      current_level: 10
      towards_next: 62.5
    intelligence:
      current_level: 10
      towards_next: 0
    wisdom:
      current_level: 10
      towards_next: 0
    dexterity:
      current_level: 10
      towards_next: 0
    constitution:
      current_level: 10
      towards_next: 0
    charisma:
      current_level: 10
      towards_next: 0

# Currency & Resources
treasure:
  type: gold coins
  amount: 127

  type: bitcoin
  amount: 0.00002

# Inventory System
inventory:
  - Arrows (20)
  - Bow
  - Leather Armor

# Special Items & Artifacts
artifacts:
  - name: "Keyboard of Swift Typing"
    description: "A mystical keyboard that boosts coding productivity"
    effect: "+2 Intelligence when used on @coding tasks"
    rarity: "Common"
    acquired_date: "2025-08-15"
  
  - name: "Tome of Productivity Wisdom"
    description: "Ancient knowledge of task management"
    effect: "+1 Wisdom for completed #project tasks"
    rarity: "Uncommon"
    acquired_date: "2025-08-20"

# Metadata
version: "1.0.0"
created_date: "2025-08-28"
last_updated: "2025-08-30"
```

### Todo List
- Always numbered when displayed but do not write line numbers to the todo.txt file.
- Standard todo.txt format maintained
- Completed tasks marked with `x`
- Active tasks sorted by priority and date

### Project Progress Tracking
Optional summary showing:
- Project name
- Tasks completed / total tasks
- Potential bonus XP available

## Design Benefits

### For Productivity
- **Motivation**: XP and progression provide immediate reward feedback
- **Habit Formation**: Daily tasks encourage consistency
- **Goal Tracking**: Count and project tasks provide clear progress visibility
- **Prioritization**: RPG elements make important tasks feel more engaging

### For Flexibility
- **Tool Agnostic**: Works with any todo.txt application
- **Backwards Compatible**: Standard todo.txt features remain unchanged
- **Extensible**: New task types and mechanics can be added
- **Customizable**: Points, attributes, and progression can be adjusted per user

### For Long-term Engagement
- **Character Development**: Attributes provide specialization paths
- **Achievement System**: Projects and levels create milestone goals
- **Narrative Elements**: RPG theming makes mundane tasks feel epic
- **Progress Visibility**: Multiple progression systems maintain interest

## Current Implementation Status

This system is currently being developed and tested through collaborative design, with mechanics being refined based on real-world usage and feedback. The core framework is functional, with ongoing iterations on balance, user experience, and feature completeness.