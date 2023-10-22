const CLIENT_ID = "479289013154-2l1m68f7pc3dp21o1voscge1h82cqeqe.apps.googleusercontent.com"
const CLIENT_SECRET = "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"
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const AUTHORIZATION_CODE = '4/0AfJohXkQA7gUkvNjAhHN9OQMA8HYYN9vLF_lEnPj6IPpS4HImNMnYrhPFvNXUS3C4lcNBg'; // リダイレクトURIから取得した認証コード
const REFRESH_TOKEN = "1//04hTkjHAHV8LbCgYIARAAGAQSNwF-L9IrvfsiVGj-YKMSOic16EMTIgNTsTZvV2_6K3z37x41O-IKSxgeSp_udijrjFvZ3p-Js6Y"
const TOKEN_URL = "https://accounts.google.com/o/oauth2/token"
const SCRIPT_ID = "AKfycbwGhfPrq3DeBK60vtPsBa5EIDXX4sGMk4YgH6dSYgyoZD_m0DKxhp4dqStpMYrre7Vo3g"

async function main() {
  try {
    // アクセストークンを取得する
    let accessTokenRes = await getAccessToken();
    let accessToken = accessTokenRes.access_token;
    document.getElementById('accessTokenField').textContent = accessToken;
     
    //// yorozuAPI を叩く
    // リクエストオプションを設定
    const headers = {
      authorization: `Bearer ${accessToken}`
    };
    const payload = {
      function: 'helloworld',
      parameters: ['こんばんはdesu']
    };
    const requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload), // 送信するデータをJSON形式に変換
    };

     // リクエスト
     const url = `https://script.googleapis.com/v1/scripts/${SCRIPT_ID}:run`;
     let apiResponse = await sendPostRequest(url,requestOptions);
     let text = apiResponse.response.result
     //console.log(response);

     //API の戻り値をテーブルに記入
     document.getElementById('domainIdField').textContent = text;

  } catch (e) {
     throw e;
  } 
}

/**
 * refresh_token or authorization_code から google API のアクセストークンを取得する関数
 */
 async function getAccessToken(){
   return new Promise(function (resolve) {
    
    const data = {
      //code: AUTHORIZATION_CODE,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      refresh_token: REFRESH_TOKEN,
      grant_type: 'refresh_token'
      //grant_type: 'authorization_code'
    };
    
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };

    let response = sendPostRequest(TOKEN_URL,options);
    resolve(response);
  })
 }

// POSTリクエストを送信する関数
function sendPostRequest(url,requestOptions) {
  return new Promise((resolve) => {
    // Fetch APIを使用してPOSTリクエストを送信
    fetch(url,requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTPエラー! ステータスコード: ${response.status}`);
      }
      resolve(response.json());
    })
    .catch(error => {
      result = error;
      console.error("エラー:", error);
    });
  })
}

async function test() {
  document.getElementById('domainIdField').textContent = "OYYY?";
}

//test()
main()

