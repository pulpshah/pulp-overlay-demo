import Groq from "groq-sdk";

// Initialize the GROQ client
const groq = new Groq();

// Define the schema for claim analysis
const schema = {
  $defs: {
    Claim: {
      properties: {
        substring: { title: "Claim Text", type: "string" },
        type: {
          title: "Claim Type",
          type: "string",
          enum: ["Fact", "Value", "Policy"], // Enum for valid claim types
        },
        color: { title: "Highlight Color", type: "string" },
      },
      required: ["substring", "type", "color"],
      title: "Claim",
      type: "object",
    },
  },
  properties: {
    claims: {
      items: { $ref: "#/$defs/Claim" },
      title: "Claims",
      type: "array",
    },
  },
  required: ["claims"],
  title: "Claim Analysis",
  type: "object",
};

// Analyze text API route
export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid or missing 'text' in request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Pretty printing improves completion results.
    const jsonSchema = JSON.stringify(schema, null, 4);

    // Perform text analysis
    const chat_completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a text analysis tool that identifies claims in text and classifies them.\nYour output must strictly adhere to the following JSON schema: ${jsonSchema}`,
        },
        {
          role: "user",
          content: `Analyze the following text and identify all claims. For each claim, provide:
          - The exact text of the claim.
          - The claim type: "Fact", "Value", or "Policy".
          - A suggestion for a highlight color for each claim type.

          Respond strictly in JSON format as an array of objects:
          [
            { "substring": "Claim text here", "type": "Fact", "color": "yellow" },
            { "substring": "Claim text here", "type": "Value", "color": "lightblue" },
            { "substring": "Claim text here", "type": "Policy", "color": "lightgreen" },
            ...
          ]

          Text: "${text}"`,
        },
      ],
      model: "llama3-8b-8192",
      temperature: 0, // Deterministic output
      stream: false,
      response_format: { type: "json_object" }, // Request a JSON response
    });

    // Parse and return the response
    const result = JSON.parse(chat_completion.choices[0]?.message?.content || "[]");

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error analyzing text:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal Server Error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
