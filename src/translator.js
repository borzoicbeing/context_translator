const URL = "https://api.openai.com/v1/chat/completions";

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  chrome.storage.sync.get(
    { openaiApikey: "", openaiModel: "gpt-3.5-turbo", language: "Japanese" },
    (items) => {
      if (items.openaiApikey == "" || items.openaiModel == "") {
        window.alert(
          "API key or Model not set. Please check extension settings page."
        );
        return;
      }
      var context = [];
      document
        .querySelectorAll("*:not(:has(*)):not(script):not(style)")
        .forEach((v) => {
          v.innerText
            ?.split("\n")
            .map((v) => v.trim())
            .filter((v) => v != "")
            .forEach((v) => context.push(v));
        });
      var subcontextIndexes = context
        .map((v, i) => (v?.includes(message.params.searchText) ? i : -1))
        .filter((i) => i >= 0)
        .map((v) => [v-4,v-3,v - 2, v - 1, v, v + 1, v + 2,v+3,v+4])
        .reduce((prev, curr) => prev.concat(...curr), []);
      var subcontext = context.filter((v,i)=>subcontextIndexes.includes(i)).join('\n')
      console.log(subcontext)
      if (message.function == "translateByOpenAI") {
        translateByOpenAI(
          message.params.searchText,
          subcontext,
          items.language,
          items.openaiModel,
          items.openaiApikey
        );
        sendResponse("done!");
      }
    }
  );
});

function translateByOpenAI(searchText, context, language, openaiModel, openaiApikey) {
  var text = `what does '${searchText}' mean in the following context? please answer in ${language}. If the word or sentence on the context means differrent from one in gerenal use, please explain the difference. The context is: ${context}`;
  async function getResponse() {
    try {
      fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApikey}`,
        },
        body: JSON.stringify({
          model: openaiModel,
          messages: [{ role: "user", content: text }],
        }),
      })
        .then((res) =>
          res.json().then((response) => {
            window.alert(
              response.choices?.[0].message.content || response.error?.message
            );
          })
        )
        .catch((err) => {
          window.alert(err);
        });
      // $("#response_text").val(chatgpt_response);
    } catch (error) {
      window.alert(error);
    }
  }
  getResponse();
}
