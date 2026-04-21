const Bytez = require('bytez.js');

const key = "865f35894d989fe8186c8b00f6db23c9";
const sdk = new Bytez(key);

const model = sdk.model("deepseek-ai/DeepSeek-R1");

async function test() {
  const { error, output } = await model.run([
    {
      "role": "user",
      "content": "Hello"
    }
  ]);
  
  console.log("Error:", error);
  console.log("Output TYPE:", typeof output);
  console.log("Output Content:", output);
}

test();
