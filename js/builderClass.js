/* ==========================================================================
   HH Goa 2026 Frame Studio — Builder Class Generator
   Goa-flavored builder title / class name randomizer
   ========================================================================== */

const BUILDER_TITLES = [
  "10X BOILERPLATE DESTROYER",
  "CUDA WHISPERER & CAFFEINE CONVERT",
  "PROMPT WIZARD & RUST MAXIMALIST",
  "BEACHSIDE CODE SLINGER",
  "ZERO-KNOWLEDGE ALCHEMIST",
  "SOLANA SPEED DEMON",
  "SHIP FIRST ASK QUESTIONS LATER",
  "FULLSTACK CHAOS ENGINEER",
  "AGENTIC AI ARCHITECT",
  "LLM ORCHESTRATOR & GOA BUILDER",
  "MONSOON-PROOF DEPLOYER",
  "COCONUT-FUELED DEBUGGER",
  "KERNEL PANIC SURFER",
  "SUNSET STANDUP CHAMPION",
  "API WHISPERER & CHAI CONSUMER",
  "PALM TREE PAIR PROGRAMMER",
  "ZERO TO PROD IN ONE TIDE",
  "BEACH SHACK BACKEND LORD",
  "TYPESCRIPT TSUNAMI RIDER",
  "OPEN SOURCE SUNSET SAGE",
  "BLOCKCHAIN BEACH BUM",
  "NEURAL NET NAVIGATOR",
  "GOA TRANCE STATE CODER",
  "DEVOPS DUNE WALKER",
  "PROTOCOL PIRATE OF PANJIM",
  "SERVERLESS SHACK BUILDER",
  "GIT BLAME GRANDMASTER",
  "MVP IN A MONSOON",
  "WEBSOCKET WAVE CATCHER",
  "HACKATHON HEAT SURVIVOR",
  "TROPICAL TURING COMPLETE",
  "MIDNIGHT MERGE MAESTRO",
  "REVERSE PROXY RAJA",
  "DOCKER COMPOSE DRIFTER",
  "STACK OVERFLOW SURF KING",
];

const STACK_PRESETS = [
  ["REACT", "NODE.JS", "SOLANA", "RUST"],
  ["PYTHON", "PYTORCH", "CUDA", "LLAMA"],
  ["NEXT.JS", "SUPABASE", "AI/LLM", "VERCEL"],
  ["SOLIDITY", "HARDHAT", "ETHERS.JS", "IPFS"],
  ["GO", "KUBERNETES", "GRPC", "REDIS"],
  ["SWIFT", "SWIFTUI", "CORE ML", "VAPOR"],
  ["RUST", "WASM", "WEBGPU", "BEVY"],
  ["FLUTTER", "DART", "FIREBASE", "GCP"],
  ["VUE.JS", "NUXT", "PRISMA", "POSTGRES"],
];

/**
 * Returns a random builder title from the pool.
 */
function getRandomBuilderTitle() {
  return BUILDER_TITLES[Math.floor(Math.random() * BUILDER_TITLES.length)];
}

/**
 * Returns a random tech stack preset (array of strings).
 */
function getRandomStackPreset() {
  return STACK_PRESETS[Math.floor(Math.random() * STACK_PRESETS.length)];
}

/**
 * Generates a Goa-flavored builder class string from the tech stack.
 * E.g., "REACT, SOLANA" → "CORAL REEF ARCHITECT"
 */
function generateBuilderClass(stackString) {
  if (!stackString || stackString.trim().length === 0) {
    return getRandomBuilderTitle();
  }

  const stack = stackString.toUpperCase();

  // Stack-aware title generation
  if (stack.includes("RUST")) return "ZERO-COST ABSTRACTION ARTISAN";
  if (stack.includes("SOLANA") || stack.includes("SOLIDITY")) return "ON-CHAIN COCONUT MINER";
  if (stack.includes("AI") || stack.includes("LLM") || stack.includes("ML")) return "NEURAL BEACH NAVIGATOR";
  if (stack.includes("PYTHON")) return "PYTHONIC PALM CODER";
  if (stack.includes("GO") || stack.includes("GOLANG")) return "GOROUTINE GOA GUIDE";
  if (stack.includes("REACT") || stack.includes("NEXT")) return "COMPONENT COAST BUILDER";
  if (stack.includes("DOCKER") || stack.includes("K8S") || stack.includes("KUBERNETES")) return "CONTAINER CURRENT RIDER";
  if (stack.includes("SWIFT")) return "SWIFT SUNSET SHIPPER";
  if (stack.includes("FLUTTER") || stack.includes("DART")) return "CROSS-PLATFORM COAST GUARD";

  return getRandomBuilderTitle();
}

/**
 * Called from the UI randomize button.
 */
function randomizeTitle() {
  const inp = document.getElementById('inpTagline');
  if (inp) {
    inp.value = getRandomBuilderTitle();
    if (typeof renderCanvas === 'function') renderCanvas();
  }
}

/**
 * Called from the UI randomize stack button (if used).
 */
function randomizeStack() {
  const inp = document.getElementById('inpStack');
  if (inp) {
    inp.value = getRandomStackPreset().join(', ');
    if (typeof renderCanvas === 'function') renderCanvas();
  }
}
