//const axios = require('axios');
//import * as https from "https";

const CLIENT_ID = "479289013154-2l1m68f7pc3dp21o1voscge1h82cqeqe.apps.googleusercontent.com"
const CLIENT_SECRET = "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"
const REFRESH_TOKEN = "1//04vn2T0NTYgeICgYIARAAGAQSNwF-L9IruSUiN7scF9ODyB8naxyb1mxjQOJy6OtQ9B8aCsqQHC_yulFDEyhikpwEJgtqJhxCR_o"
const SCRIPT_ID = "AKfycbwGhfPrq3DeBK60vtPsBa5EIDXX4sGMk4YgH6dSYgyoZD_m0DKxhp4dqStpMYrre7Vo3g"
const TOKEN_URL = "https://www.googleapis.com/oauth2/v4/token"
/**
 * メイン関数
 * @return string
 */
async function main() {
  try {
    // アクセストークンを取得する
    //const accessToken = await getAccessToken();
    //document.getElementById('domainIdField').textContent = "YKK?";
     // GASを実行
     
     const headers = {
  //     Authorization: `Bearer ${accessToken}`,
         Authorization: `Bearer "ya29.a0AfB_byBrmgsQva0wNPjOYUSrRhxnsVzcFQYiMyCcqR17FlLQGSOoJPxdGxWR8wJco7cJ1Y_G1AuJ_6eT8WuOr5aL3Vg0slDyFe3DO5y6ctaz8JL6jIlfCCUhPTjPlMh5zbIkPQXMAncvlUQIVGtcTx0OPF6hoHZB9rHFaCgYKAawSARISFQGOcNnCLRet0uudwDvgyZYmuLrpCw0171"`,
     };

    const payload = {
      function: 'helloworld',
      parameters: ['OKKKKKKKKKK']
    };

     // リクエストオプションを設定
    const requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload), // 送信するデータをJSON形式に変換
    };

     // リクエスト
     const url = `https://script.googleapis.com/v1/scripts/${SCRIPT_ID}:run`;
     //const instance = axios.create({ headers });
     //const response = await instance.post(url, payload);

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
      let apiResponse = data.response.result;
      document.getElementById('domainIdField').textContent = apiResponse;
      console.log("APIレスポンス",apiResponse);
    })
    .catch(error => {
      console.error("エラー:", error);
    });

     //document.getElementById('domainIdField').textContent = "B";
    //  if (response.status !== 200 || !response.data || response.data.error) {
    //      throw new Error('Failed to run google apps script.');
    //  }
    //  const { result } = response.data.response;
    //  console.log(result);

  } catch (e) {
     throw e;
  } 
}

/**
 * アクセストークンを取得する関数
 * @return string
 */
async function getAccessToken(){
  return new Promise(function (resolve) {
    
    const data = JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type: 'refresh_token',
    });
    
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };
    
    // const reque = https.request(TOKEN_URL, options, (res)=>{
    //   // console.log(res)
    //   res.on('data', (chunk) => {
    //     let access_token = JSON.parse(chunk.toString())
    //     resolve(access_token.access_token)
    //   })
    // })
    document.getElementById('domainIdField').textContent = "YYKKK?";
    reque.write(data)
    reque.end()
  })
}

async function test() {
  document.getElementById('domainIdField').textContent = "OYYY?";
}

//test()
main()

