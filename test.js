const SCRIPT_ID = "AKfycbwGhfPrq3DeBK60vtPsBa5EIDXX4sGMk4YgH6dSYgyoZD_m0DKxhp4dqStpMYrre7Vo3g";

// POSTリクエストを送信する関数
function sendPostRequest(url, data) {
    // リクエストヘッダーを設定
    const headers = new Headers();
    //headers.append("Content-Type", "application/json");
    //headers.append("authorization", "Bearer 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");
    headers.append("authorization", "Bearer ya29.a0AfB_byDu9k0u2aNSRigLP12I88vo8gUWMYl-1jyJSWieFxG62Tvr4P9H2hQVF-jOcmP2IA1YqUDLeZZ88A3dK5WieQsmGlEYBDsx9p3LMyDYos1zQzPg4lgMJ4iESLtTPrWQGCjuHM2ce_hp-pef4Fa367u2jwgNmelGaCgYKASUSARISFQGOcNnC6gIVHkxpfcbUUYuhiNLgXw0171");

    // リクエストオプションを設定
    const requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data), // 送信するデータをJSON形式に変換
    };
  
    // Fetch APIを使用してPOSTリクエストを送信
    fetch(url, requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTPエラー! ステータスコード: ${response.status}`);
        }
        return response.json(); // レスポンスをJSONとして解釈
      })
      .then(data => {
        //console.log("POSTリクエストのレスポンスデータ:", data);
        // ここでデータを処理または表
        console.log("APIレスポンス",data.response.result)
      })
      .catch(error => {
        console.error("エラー:", error);
      });
}
  
const postData = {
  function : "helloworld",
  parameters : ["Everything OKK!!!"]
};
const apiUrl = "https://script.googleapis.com/v1/scripts/"+SCRIPT_ID+":run";
sendPostRequest(apiUrl,postData);

  // 使用例
//   const postData = {
//     "model":"gpt-3.5-turbo",
//     "messages": [{"role": "user", "content": "トマトは野菜ですか？果物ですか？"}],
//     "temperature": 0.7
//   };
//   console.log("test");
  
//   const apiUrl = "https://api.openai.com/v1/chat/completions"; // POSTを送信するAPIのエンドポイント

  