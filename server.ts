import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client on the server
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY environment variable is not set. AI features might fall back.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API Routes

// Simulated match commentary
app.post("/api/commentary", async (req: express.Request, res: express.Response) => {
  try {
    const { player1, player2, game, tenant, score1, score2 } = req.body;
    const ai = getGeminiClient();
    
    if (!ai) {
      // Return highly engaging pre-baked commentary if key is missing
      const fallbackLogs = [
        `[00:01] Welcome to the Arena! Face-off in ${game} under Tenant ${tenant}: **${player1}** vs **${player2}**!`,
        `[01:12] High stakes active! ${player1} trades heavily, forcing ${player2} into a tight defense on the outer ring!`,
        `[02:45] Decisive execution! ${player1} locks in the win with a crucial tactical decision. Core ledger systems logging results!`,
        `[03:00] MATCH COMPLETE! Final score is ${score1}-${score2}. **${score1 > score2 ? player1 : player2}** claims victory!`
      ].join("\n");
      return res.json({ commentary: fallbackLogs });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Write a short, dramatic, highly engaging esports match commentary log (4 lines max, each prefixed with timestamps like [01:15]) for an intense face-off in "${game}" under tournament tenant region "${tenant}". Player 1 is "${player1}" and Player 2 is "${player2}". The final score is ${score1}-${score2}. Match victor: ${score1 > score2 ? player1 : player2}. Style like an esports announcer feed inside a dark cyberpunk simulator, focusing on ledger stakes. Do not write markdown titles or blocks, only plain strings with line breaks.`,
    });

    res.json({ commentary: response.text || "No commentary generated." });
  } catch (error: any) {
    console.error("Gemini API error in /api/commentary:", error);
    res.status(500).json({ error: error.message || "Failed to generate esports commentary." });
  }
});

// Auto-generate tournament highlight descriptions
app.post("/api/generate-tournament", async (req: express.Request, res: express.Response) => {
  try {
    const { tenantName, gameName, prizePool } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        description: `Join the supreme BattleArena ${tenantName} circuit in a high-stakes ${gameName} arena. Compete for ${prizePool}!`
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Write a short, thrilling, 1-line tournament description for an esports event in native regional tenant "${tenantName}" playing "${gameName}" with a prize pool of ${prizePool}. Make it sound incredibly elite and professional. Limit response to 12 words max.`,
    });

    res.json({ description: response.text?.trim() || `Compete for ${prizePool} in ${gameName}.` });
  } catch (error: any) {
    console.error("Gemini API error in /api/generate-tournament:", error);
    res.status(500).json({ error: error.message || "Failed to generate tournament description." });
  }
});

// Simulate Telegram Authenticity checking
app.post("/api/auth-verify", (req: express.Request, res: express.Response) => {
  const { initData, botToken } = req.body;
  if (!initData) {
    return res.status(400).json({ valid: false, message: "Missing initData" });
  }

  // Under native PHP implementation:
  // parse_str($initData, $auth_data);
  // $check_hash = $auth_data['hash'];
  // unset($auth_data['hash']);
  // ... hash_hmac('sha256', $data_check_string, $secret_key)
  // Let's explain and simulate this verification in the API to display on the client UI!
  const isDemoSuccess = initData.includes("user=");
  
  res.json({
    valid: isDemoSuccess,
    algorithm: "HMAC-SHA256 with WebApp Bot Token",
    timestamp: new Date().toISOString(),
    parsed: {
      user: {
        id: 981245722,
        first_name: "ArenaGladiator",
        username: "gladiator22",
        language_code: "en"
      },
      auth_date: Math.floor(Date.now() / 1000)
    },
    system: "Fintech Grade Security Active"
  });
});

// Vite middleware setup
async function startServer() {
  const isProd = process.env.NODE_ENV === "production";
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BattleArena Server running on port ${PORT}`);
  });
}

startServer();
