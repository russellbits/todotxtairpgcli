#!/usr/bin/env node

// TodoTxtAiRPG CLI with LangChain.js and Ollama
// Usage: node rpg-cli.js "complete task 5" or node rpg-cli.js "add new task: workout"

import { ChatOllama } from "@langchain/ollama"
import { MemoryVectorStore } from "langchain/vectorstores/memory"
import { OllamaEmbeddings } from "@langchain/ollama"
import { Document } from "langchain/document"
import { PromptTemplate } from "@langchain/core/prompts"
import fs from 'fs/promises'
import path from 'path'
import yaml from 'js-yaml'
import readline from 'readline'

class TodoTxtRPGCLI {
  constructor() {
    this.llm = new ChatOllama({
      baseUrl: "http://ada.local:11434",
      model: "llama3-tdm", // or whatever model you prefer
      keep_alive: -1,
      temperature: 0.7,
    })
    
    this.embeddings = new OllamaEmbeddings({
      baseUrl: "http://ada.local:11434",
      model: "nomic-embed-text", // Good embedding model
    })
    
    this.vectorStore = null;
    this.gameData = {
      character: null,
      campaign: null,
      todos: [],
      rules: null
    }
    
    this.dataDir = './game-data'
    this.initializeDirectories()
  }

  async initializeDirectories() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true })
      await fs.mkdir(`${this.dataDir}/memory`, { recursive: true })
    } catch (error) {
      console.log("Directories already exist")
    }
  }

  // Load all game documents and create embeddings
  async loadGameData() {
    console.log("🎮 Loading game data...")
    
    try {
      // Load first *.character.yaml file
      const files = await fs.readdir(this.dataDir);
      const characterFile = files.find(f => f.endsWith(`character.yaml`))
      if (characterFile) {
        const characterData = await fs.readFile(path.join(this.dataDir, characterFile), 'utf8')
        this.gameData.character = yaml.load(characterData)
        console.log('Character file processing...')
      } else {
        console.log('No character file found.')
        this.gameData.character = null
      }

      // Load first *.campaign.yaml file
      const campaignFile = files.find(f => f.endsWith(`campaign.yaml`))
      if (campaignFile) {
        const campaignData = await fs.readFile(path.join(this.dataDir, campaignFile), 'utf8')
        this.gameData.campaign = yaml.load(campaignData)
        console.log('Campaign file processing...')
      } else {
        console.log('No campaign file found.')
        this.gameData.campaign = null
      }
      
      // Load todo.txt
      const todoData = await fs.readFile(`${this.dataDir}/todo.txt`, 'utf8')
      this.gameData.todos = todoData.split('\n').filter(line => line.trim())
      
      // Load rules (if exists)
      try {
        const rulesData = await fs.readFile(`${this.dataDir}/rules.md`, 'utf8')
        this.gameData.rules = rulesData
      } catch (error) {
        console.log("No rules file found, using campaign defaults")
      }
      
      await this.createVectorStore();
      console.log("✅ Game data loaded successfully!")
      
    } catch (error) {
      console.error("❌ Error loading game data:", error.message)
      // await this.initializeNewGame()
    }
  }

  // Create vector embeddings for semantic search
  async createVectorStore() {
    const documents = [
      new Document({
        pageContent: `Character Stats: ${JSON.stringify(this.gameData.character, null, 2)}`,
        metadata: { type: "character", source: "character.yaml" }
      }),
      new Document({
        pageContent: `Campaign Info: ${JSON.stringify(this.gameData.campaign, null, 2)}`,
        metadata: { type: "campaign", source: "campaign.yaml" }
      }),
      new Document({
        pageContent: `Current Todo List:\n${this.gameData.todos.join('\n')}`,
        metadata: { type: "todos", source: "todo.txt" }
      })
    ]

    if (this.gameData.rules) {
      documents.push(new Document({
        pageContent: `Game Rules: ${JSON.stringify(this.gameData.rules, null, 2)}`,
        metadata: { type: "rules", source: "rules.md" }
      }));
    }

    this.vectorStore = await MemoryVectorStore.fromDocuments(
      documents,
      this.embeddings
    );
  }

  // Initialize new game with template files
  /* 
  async initializeNewGame() {
    console.log("🌟 Creating new TodoTxtAiRPG character...")
    
    const characterTemplate = {
      character: {
        name: "New Adventurer",
        species: "Human",
        class: "Beginner",
        class_level: 1,
        class_title: "Fresh Start",
        experience_points: 0,
        xp_to_next_level: 1000,
        health_points: 10,
        max_health: 10,
        mana_points: 5,
        max_mana: 5,
        attributes: {
          strength: { current_level: 10, experience: 0, xp_to_next_level: 10000 },
          intelligence: { current_level: 10, experience: 0, xp_to_next_level: 10000 },
          wisdom: { current_level: 10, experience: 0, xp_to_next_level: 10000 },
          dexterity: { current_level: 10, experience: 0, xp_to_next_level: 10000 },
          constitution: { current_level: 10, experience: 0, xp_to_next_level: 10000 },
          charisma: { current_level: 10, experience: 0, xp_to_next_level: 10000 }
        }
      },
      treasure: { type: "gold coins", amount: 10 },
      inventory: ["Basic Sword", "Leather Vest"],
      artifacts: [],
      achievements: { unlocked: [] },
      version: "1.0.0",
      created_date: new Date().toISOString().split('T')[0],
      last_updated: new Date().toISOString().split('T')[0]
    };

    await fs.writeFile(
      `${this.dataDir}/character.yaml`, 
      yaml.dump(characterTemplate, { indent: 2 })
    );
    
    await fs.writeFile(
      `${this.dataDir}/todo.txt`,
      "2025-09-02 Welcome to your adventure! @start !50 🌟\n"
    );

    console.log("✅ New game created!");
  }
    */

  // Get relevant context for AI prompt
  async getRelevantContext(query) {
    if (!this.vectorStore) {
      await this.createVectorStore();
    }
    
    const relevantDocs = await this.vectorStore.similaritySearch(query, 3);
    return relevantDocs.map(doc => doc.pageContent).join('\n\n');
  }

  // Main AI processing
  async processCommand(userInput) {
    const context = await this.getRelevantContext(userInput);
    
    const prompt = PromptTemplate.fromTemplate(`
You are a TodoTxtAiRPG Game Master managing a gamified todo.txt system.

CURRENT GAME STATE:
{context}

AVAILABLE COMMANDS:
- Add tasks: "add task: [description]" 
- Complete tasks: "complete task [number]" or "done [number]"
- Update progress: "update task [number] progress [amount]"
- Show status: "show stats", "show todos", "show character"
- Modify tasks: "change priority of task [number] to [A-F]"

USER INPUT: {input}

Respond as an epic fantasy game master. If this involves game mechanics:
1. Update the appropriate files (character.yml, todo.txt)
2. Narrate the action using encounter descriptions from the campaign
3. Award XP and treasure as appropriate
4. Show updated character stats if relevant

If this is just a question, answer helpfully in character.

IMPORTANT: Always show line numbers with the todo list for easy reference, but don't put line numbers in todo.txt.
`);

    const formattedPrompt = await prompt.format({
      context: context,
      input: userInput
    });

    const response = await this.llm.invoke(formattedPrompt)
    return response.content;
  }

  // Save updated game data
  async saveGameData() {
    try {
      await fs.writeFile(
        `${this.dataDir}/character.yml`,
        yaml.dump(this.gameData.character, { indent: 2 })
      );
      
      await fs.writeFile(
        `${this.dataDir}/todo.txt`,
        this.gameData.todos.join('\n')
      );
      
      // Update vector store with new data
      await this.createVectorStore()
      
    } catch (error) {
      console.error("❌ Error saving game data:", error.message)
    }
  }

  // Interactive CLI mode
  async startInteractiveMode() {
    console.log("🎮 TodoTxtAiRPG Interactive Mode")
    console.log("Type 'exit' to quit, 'help' for commands\n")
    console.log("Complete tasks to gain XP and level up your character!\n")
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '⚔️ > '
    });

    rl.prompt();

    rl.on('line', async (input) => {
      const trimmed = input.trim();
      
      if (["exit","quit","goodbye","bye"].includes(trimmed.toLowerCase())) {
        console.log("🏰 I bid thee adieu, brave adventurer! Until next time!");
        try {
          const todoData = await fs.readFile(`${this.dataDir}/todo.txt`, 'utf8');
          console.log("\nYour current todo.txt:\n" + todoData);
        } catch (err) {
          console.error("Could not read todo.txt:", err.message);
        }
        rl.close();
        return;
      }
      
      if (trimmed === 'help') {
        console.log(`
📜 AVAILABLE COMMANDS:
- "add task: morning workout @fitness !25 💪"
- "complete task 5" or "done 5"  
- "update task 3 progress 10"
- "show stats" or "show character"
- "show todos" or "list tasks"
- "change priority of task 7 to A"
- "help" - show this help
- "exit" - quit the game
        `)
        rl.prompt()
        return
      }

      try {
        const response = await this.processCommand(trimmed)
        console.log(`\n${response}\n`)
      } catch (error) {
        console.error("❌ Error:", error.message)
      }
      
      rl.prompt();
    });
  }

  // Single command mode
  async runSingleCommand(command) {
    await this.loadGameData();
    const response = await this.processCommand(command);
    console.log(response);
    await this.saveGameData();
  }
}

// Main execution
async function main() {
  const cli = new TodoTxtRPGCLI();
  await cli.loadGameData();
  
  const args = process.argv.slice(2);
  
  if (args.length > 0) {
    // Single command mode
    const command = args.join(' ');
    await cli.runSingleCommand(command);
  } else {
    // Interactive mode
    await cli.startInteractiveMode();
  }
}

// Package.json dependencies needed:
/*
{
  "name": "todotxt-airpg-cli",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "@langchain/ollama": "^0.0.3",
    "langchain": "^0.2.0",
    "js-yaml": "^4.1.0"
  }
}
*/

main().catch(console.error);