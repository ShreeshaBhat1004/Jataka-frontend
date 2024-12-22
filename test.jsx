const Groq = require("groq-sdk");

const groq = new Groq();
async function main() {
  const chatCompletion = await groq.chat.completions.create({
    messages: [],
    model: "llama3-groq-70b-8192-tool-use-preview",
    temperature: 0.5,
    max_tokens: 1024,
    top_p: 0.65,
    stream: true,
    stop: null,
  });

  for await (const chunk of chatCompletion) {
    process.stdout.write(chunk.choices[0]?.delta?.content || "");
  }
}

main();
