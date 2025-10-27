import db from "./dbConnect.js";
 
export const Bot = async (req, res) => {
  const { message } = req.body;
 const base_url="https://openrouter.ai/api/v1/chat/completions"; 
const model="minimax/minimax-m2:free"
  try {
     const intentResponse = await fetch(base_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: `Classify this message as one of the following intents:
            "product_search", "navigation", "faq", or "other".
            Respond ONLY with the intent name.`,
          },
          { role: "user", content: message },
        ],
      }),
    });
    const intentData = await intentResponse.json();
let intentRaw = intentData.choices?.[0]?.message?.content?.trim()?.toLowerCase() || "";
intentRaw = intentRaw.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
console.log(intentRaw);
const intent = intentRaw.split(/\s+/)[0] || "";



    let reply = {};
    let content = "";

     if (intent === "product_search") {
      const [products] = await db.query(
        "SELECT products_name, weight_ml, price, stock FROM products"
      );
      content = await getAIResponse(message, products);
      reply = { category: "product_search", content };
    } 
    else if (intent === "navigation") {
      const navResponse = await fetch(base_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: "system",
              content:
`You are a route classifier for Yogoblast, an e-commerce website for yoghurts and milk products.

Given a user's message, respond with the most relevant site path from this list:
/home, /cart, /contact, /login, /signup, /search

Rules:
- Respond ONLY with one of the above paths (e.g., "/cart"), nothing else.
- Choose "/home" for general browsing, or unclear requests.
- Choose "/search" if the user is asking about a product or looking for something to buy.
- Choose "/cart" if the user mentions checkout, buying, payment, or their shopping cart.
- Choose "/contact" if the user wants to talk to support, get help, or reach the company.
- Choose "/login" or "/signup" if the message involves account access or creating an account.
- If none fit, return "/home".`},
            { role: "user", content: message },
          ],
        }),
      });

      const siteResult = await navResponse.json();
     let site = siteResult.choices?.[0]?.message?.content?.trim();
      site = site.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
      const intent = site.split(/\s+/)[0];
      reply = { category: "navigation", content: intent };
    } 
    else if (intent === "faq") {
      content = "You can contact us via the Contact page or email yogoblast@support.com.";
      reply = { category: "info", content };
    } 
    else if(intent==="other"){
          const response = await fetch(base_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
           model: model,
          messages: [
            {
              role: "system",
              content:`You are YogoBot, a friendly and polite assistant for Yogoblast — an e-commerce platform for yoghurt and milk products.

When users send casual, unclear, or general messages (like greetings, compliments, or small talk), reply naturally and briefly.

Guidelines:
- Keep responses under 20 words.
- Use a warm and conversational tone.
- If appropriate, mention Yogoblast casually (e.g., “Welcome to Yogoblast!” or “Happy to help!”).
- Avoid robotic or repetitive language.
- Do not classify messages — just respond as a helpful assistant would.`,
            },
            { role: "user", content: message },
          ],
        }),
      })
        const data = await response.json();
     let site = data.choices?.[0]?.message?.content?.trim();
        site = site.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    const content = site.split(/\s+/)[0];
    // console.log(content);

        reply = { category: "info", content };
    }
    else {
      content =
        "Sorry, I’m not sure how to help with that. Try asking about products or site navigation!";
      reply = { category: "info", content };
    }

    res.json({ reply });
  } catch (error) {
    console.error("❌ Bot error:", error);
    res.status(500).json({ reply: { category: "error", content: "Internal server error" } });
  }
};

async function getAIResponse(message, products) {
  const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model:  "minimax/minimax-m2:free",
      messages: [
        { role: "system", content: `You are YogoBot, a helpful and friendly assistant for Yogoblast — an e-commerce website that sells yoghurts and milk products.

When users ask about products, use the provided product data to answer their questions accurately.

Guidelines:
- Refer only to the available products listed in the provided data.
- If the user asks about a product not in the list, politely say it's not available.
- Mention key details like product name, flavor, size (in ml), and price when relevant.
- Be brief, clear, and conversational — not robotic.
 - Keep responses under 40 words.
- If unsure, encourage the user to browse or ask for more details.` },
        { role: "user", content: message },
        { role: "system", content: `Product data: ${JSON.stringify(products)}` },
      ],
    }),
  });

  const dataResponse = await aiResponse.json();
let intentRaw = dataResponse.choices?.[0]?.message?.content?.trim();
  intentRaw = intentRaw.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
 return intentRaw;
}
