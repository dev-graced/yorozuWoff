import { woffId } from './params.js'

const CLIENT_ID = "479289013154-2l1m68f7pc3dp21o1voscge1h82cqeqe.apps.googleusercontent.com"
const CLIENT_SECRET = "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"
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const AUTHORIZATION_CODE = '4/0AfJohXkQA7gUkvNjAhHN9OQMA8HYYN9vLF_lEnPj6IPpS4HImNMnYrhPFvNXUS3C4lcNBg'; // リダイレクトURIから取得した認証コード
const REFRESH_TOKEN = "1//04hTkjHAHV8LbCgYIARAAGAQSNwF-L9IrvfsiVGj-YKMSOic16EMTIgNTsTZvV2_6K3z37x41O-IKSxgeSp_udijrjFvZ3p-Js6Y"
const TOKEN_URL = "https://accounts.google.com/o/oauth2/token"
//const SCRIPT_ID = "AKfycbwGhfPrq3DeBK60vtPsBa5EIDXX4sGMk4YgH6dSYgyoZD_m0DKxhp4dqStpMYrre7Vo3g" //本番用
const SCRIPT_ID = "AKfycbz2d8acJnBkhwaHrplkaBCAqe4FqMiBong648t6FAAQ" //テスト用
const url = `https://script.googleapis.com/v1/scripts/${SCRIPT_ID}:run`

async function main() {
  try {
    // アクセストークンを取得する
    let accessTokenRes = await getAccessToken();
    let accessToken = accessTokenRes.access_token;
    //document.getElementById('accessTokenField').textContent = accessToken;
     
    // //// yorozuAPI を叩く
    // // リクエストオプションを設定
    // const headers = {
    //   authorization: `Bearer ${accessToken}`
    // };
    // let payload = {
    //   function: 'helloworld',
    //   parameters: ['こんばんはdesu']
    // };
    // let requestOptions = {
    //   method: "POST",
    //   headers: headers,
    //   body: JSON.stringify(payload), // 送信するデータをJSON形式に変換
    // };

    //  //リクエスト
    //  let apiResponse = await sendPostRequest(url,requestOptions);
    //  let text = apiResponse.response.result

    //  //alert(text);
    //  //console.log(response);
    //  //API の戻り値をテーブルに記入
    //  document.getElementById('apiResField').textContent = text;

    //// 質問送信フォーム

    // ボタン要素を取得
    const sendButton = document.getElementById('send-button');
    // ボタンがクリックされたときの処理を追加
    sendButton.addEventListener('click', async function() {

      // テキスト入力フィールドの値を取得
      let textInput = document.getElementById('text-input').value;
      let secretNo = document.getElementById('secretNo').value;
      document.getElementById('showInputTextField').textContent = textInput;

      //// 質問を送信
      let apiFunc = { //呼び出す API関数とその引数を設定する
        function: 'receiveQuery',
        parameters: [textInput,secretNo]
      };

      // リクエスト
      let apiResponse = await sendApiRequest(url,accessToken,apiFunc);
      //let apiResponse = await sendPostRequest(url,requestOptions);
      let text = apiResponse.response.result;
      document.getElementById('apiResField').textContent = text;
      //alert(text);
    });

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
      alert("sendPostRequest エラー:");
    });
  })
}

// APIリクエストを送信する関数
function sendApiRequest(url,accessToken,payload) {
  return new Promise((resolve) => {
    
    //ヘッダーの定義
    let header = {
      authorization: `Bearer ${accessToken}`
    };
    
    // リクエストオプションの設定
    let requestOptions = {
      method: "POST",
      headers: header,
      body: JSON.stringify(payload), // 送信するデータをJSON形式に変換
    };

    //リクエストの送信
    let response = sendPostRequest(url,requestOptions);
    resolve(response);
  })
}

const getProfile = () => {
// LINE WORKS のユーザー情報を取得
  woff.getProfile().then((profile) => {
    // Success
    console.log(profile)
    let lwUserId = profile.userId;
    document.getElementById('userIdProfileField').textContent = lwUserId;
  })
  .catch((err) => {
    // Error
    console.log(err)
    window.alert(err);
  });
};

// プログラム実行

//WOFF On load
window.addEventListener('load', () => {
  console.log(woffId)

  // 外部ブラウザからのアクセスの場合はLINE WORKS ID でのログインを要求する
  // if(woff.isInClient();
  // alert("result?",result);
  // if(!result){
  //   woff.login();
  // }

  // Initialize WOFF
  woff.init({ woffId: woffId })
      .then(() => {
          // Success
          //woff.login();
          // Button handler
          //registerButtonHandlers();
          // Get and show LINE WORKS userId
          //getProfile();
          alert("initialized");
          if(woff.isLoggedIn()){
            alert("OKKKKK");
            // よろず相談API の実行
            main();
          }else{
            alert("LINE WORKS にログインしていない状態ではこのページにアクセスできません。");
            window.location.href = 'https://auth.worksmobile.com/login/login?accessUrl=http%3A%2F%2Fjp2-common.worksmobile.com%2Fproxy%2Fmy';
            //woff.login();
          };

      })
      .catch((err) => {
          // Error
          window.alert(err);
          console.error(err)
      });
});

woff.ready().then(() => {
  if(woff.isLoggedIn()){
    alert("OKKKKK");
    // よろず相談API の実行
    main();
  }else{
    //alert("LINE WORKS にログインしていない状態ではこのページにアクセスできません。");
    window.location.href = 'https://developers.worksmobile.com/jp/docs/woff-api#woff-isinclient';
    //woff.login();
  };
})


