import { woffId, SCRIPT_ID } from './params.js'
import { getAccessToken,sendApiRequest } from './funcs.js'

const url = `https://script.googleapis.com/v1/scripts/${SCRIPT_ID}:run`

async function main() {
  try {

    //// 質問送信フォーム
    // ボタン要素を取得
    const sendButton = document.getElementById('send-button');

    if(sendButton === null){
      console.log("send-button ID の要素がありません");
    }else{

      // ボタンがクリックされたときの処理を追加
      sendButton.addEventListener('click', async function() {

        // テキスト入力フィールドの値を取得
        let textInput = document.getElementById('text-input').value;
        if(!textInput){
          alert("相談内容を入力してください");
          return;
        }
        let secretNo = document.getElementById('secretNo').value;
        if(!secretNo){
          alert("４桁の暗証番号を入力してください");
          return;
        }else{
          let regx = /^[0-9]{4}$/;
          let testInput = regx.test(secretNo);
          if(!testInput){
            alert("暗証番号は「半角数字」を４つ入力してください");
            document.getElementById('secretNo').value = "";
          return;
          }
        }
        //document.getElementById('showInputTextField').textContent = textInput;

        // 送信中のメッセージを表示する
        let sendProgressMessage = "送信中です";
        document.getElementById('send-progress').textContent = sendProgressMessage;

        // アクセストークンを取得する
        let accessToken;
        await getAccessToken()
        .then((accessTokenRes)=>{
          accessToken = accessTokenRes.access_token;
          console.log("accessToken",accessToken);
          //document.getElementById('accessTokenField').textContent = accessToken;
        })
        .catch((error)=>{
          let msg = "エラー: アクセストークンが取得できませんでした";
          alert("エラーが発生しました。原因を調査中です。明日以降でまた試してみてください。");
          console.log(msg);

          sendProgressMessage = "送信エラー";
          document.getElementById('send-progress').textContent = sendProgressMessage;

          // //// エラー発生を管理者に LINE WORKS で通知
          // let apiFunc = { //呼び出す API関数とその引数を設定する
          //   function: 'sendMsgToAdm',
          //   parameters: [msg]
          // };
          // // リクエスト
          // sendApiRequest(url,accessToken,apiFunc);
        });
        //let accessToken = accessTokenRes.access_token;
        // console.log("accessToken",accessToken);
        // document.getElementById('accessTokenField').textContent = accessToken;

        //// 質問を送信
        let apiFunc = { //呼び出す API関数とその引数を設定する
          function: 'receiveQuery',
          parameters: [textInput,secretNo]
        };

        // リクエスト
        let apiResponse = await sendApiRequest(url,accessToken,apiFunc);
        //let apiResponse = await sendPostRequest(url,requestOptions);
        let resultArray = apiResponse.response.result;
        let queryName = resultArray[0];

        // 送信完了ページへ遷移(相談ネームと secretNo 付き)
        window.location.href 
        = 'https://dev-graced.github.io/yorozuWoff/post_complete.html'
        //= 'https://potential-space-sniffle-rq6w7445g66cp7r5-5500.app.github.dev/post_complete.html'
        +'?queryName='+queryName+'&secretNo='+secretNo;
        //document.getElementById('apiResField').textContent = text;
      });
    }
   

    //  if(addQuerySendButton === null){
    //    console.log("addQuery-sendButton ID の要素がありません");
    //    alert("addQuery-sendButton ID の要素がありません")
    //  }

    //// 相談ネームと暗証番号を送信すると、相談履歴と相談ステータスが表示されるフォーム
    // ボタン要素を取得
    const queryInfoSendButton = document.getElementById('queryInfo-sendButton');

    if(queryInfoSendButton === null){
      //alert("queryInfo-sendButton ID の要素がありません");
      console.log("queryInfo-sendButton ID の要素がありません");
    }else{
      // ボタンがクリックされたときの処理を追加
      queryInfoSendButton.addEventListener('click', async function() {

        // テキスト入力フィールドの値を取得
        let queryName = document.getElementById('queryInfo-queryName').value;
        if(!queryName){
          alert("相談ネームを入力してください");
          return;
        }
        let secretNo = document.getElementById('queryInfo-secretNo').value;
        if(!secretNo){
          alert("４桁の暗証番号を入力してください");
          return;
        }else{
          let regx = /^[0-9]{4}$/;
          let testInput = regx.test(secretNo);
          if(!testInput){
            alert("暗証番号は「半角数字」を４つ入力してください");
            document.getElementById('secretNo').value = "";
          return;
          }
        }

        // 送信中のメッセージを表示する
        let sendProgressMessage = "送信中です";
        document.getElementById('queryInfo-sendProgress').textContent = sendProgressMessage;

        // アクセストークンを取得する
        let accessToken;
        await getAccessToken()
        .then((accessTokenRes)=>{
          accessToken = accessTokenRes.access_token;
          console.log("accessToken",accessToken);
          //document.getElementById('accessTokenField').textContent = accessToken;
        })
        .catch((error)=>{
          let msg = "エラー: アクセストークンが取得できませんでした";
          alert("エラーが発生しました。原因を調査中です。明日以降でまた試してみてください。");
          console.log(msg);

          sendProgressMessage = "送信エラー";
          document.getElementById('queryInfo-sendProgress').textContent = sendProgressMessage;

        })

        let apiFunc = { //呼び出す API関数とその引数を設定する
          function: 'requestQueryInfo',
          parameters: [queryName,secretNo]
        };

        // リクエスト
        let apiResponse = await sendApiRequest(url,accessToken,apiFunc);
        //let apiResponse = await sendPostRequest(url,requestOptions);
        let apiResults = apiResponse.response.result;
        //document.getElementById('queryInfo-apiResField').textContent = text;
        //alert(text);
        let queryId = apiResults[0];
        let queryStatus = apiResults[1];
        let queryHistory = apiResults[2];

        // queryHistoryを文字列として整形
        let textQueryHistory = "";
        for(let i=0; i<queryHistory.length; i++){
          textQueryHistory += queryHistory[i][0] + "," + queryHistory[i][1] + "," 
          + queryHistory[i][2] + ";";
        }
        //alert(textQueryHistory);

        // 送信完了ページへ遷移(相談ネームと secretNo 付き)
        window.location.href 
        //= 'https://dev-graced.github.io/yorozuWoff/query_history.html'
        = 'https://potential-space-sniffle-rq6w7445g66cp7r5-5500.app.github.dev/query_history.html'
        +'?queryID='+queryId+'&queryStatus='+queryStatus+'&queryHistory='+textQueryHistory;

        // //送信完了のメッセージを表示する
        // sendPsrogressMessage = "";
        // document.getElementById('queryInfo-sendProgress').textContent = sendProgressMessage;


        // ////相談履歴と相談ステータスの表示

        // // 表示領域要素の取得
        // let messageThread = document.getElementById("queryInfo-messageThread");

        // if(apiResults[3] === ""){

        //   //相談ネームの表示
        //   let messageElement = document.createElement("div");
        //   messageElement.className = "queryInfo";
        //   //messageElement.innerHTML = "<h3>相談ネーム：" + apiResults[0] + "    /    相談状況：" + apiResults[1] + "</h3>";
        //   messageElement.innerHTML = "<p style='font-weight: bold; font-size: 20px'>相談ネーム：" + apiResults[0] + "<br> 相談状況：" + apiResults[1] + "</p>"; 
        //   messageThread = messageThread.appendChild(messageElement);

        //   // //相談ステータスの表示
        //   // messageElement = document.createElement("div");
        //   // messageElement.className = "queryStatus";
        //   // messageElement.innerHTML = "相談状況：" + apiResults[1];
        //   // messageThread = messageThread.appendChild(messageElement);

        //   // タイトル（相談履歴）の表示
        //   let title = document.createElement("div");
        //   title.className = "queryHistoryTitle";
        //   title.innerHTML = "<h3><相談履歴></h3>";
        //   messageThread = messageThread.appendChild(title);

        //   //相談履歴の表示
        //   let queryHistory = apiResults[2];
        //   for(let ii=0;ii<queryHistory.length;ii++){
        //     //　投稿日時と投稿内容の表示
        //     messageElement = document.createElement("div");
        //     messageElement.className = "post";
        //     messageElement.style = "padding-right: 50px";
        //     messageElement.innerHTML = "<b>" + queryHistory[ii][0] +" 投稿</b> <br>" + queryHistory[ii][1];
        //     messageThread.appendChild(messageElement);

        //     // 投稿への返信の表示
        //     if(queryHistory[ii][2]){
        //       messageElement = document.createElement("div");
        //       messageElement.className = "reply";
        //       messageElement.style = "padding-left: 50px";
        //       messageElement.innerHTML = "<b>返信" + ":</b> " + queryHistory[ii][2];
        //       messageThread.appendChild(messageElement);
        //     }
        //   }

        //   // 最後の質問への返信がある場合、追加の質問を投稿するフォームを表示する
        //   if(queryHistory[queryHistory.length-1][2]){
        //     //// 追加質問投稿フォーム
        //     // 説明文
        //     messageElement = document.createElement("div");
        //     messageElement.className = "form";
        //     messageElement.innerHTML = "返信に対して追加の質問がある場合は、<br> 質問内容を入力して送信ボタンを押してください。<br>";
        //     messageThread.appendChild(messageElement);

        //     // 入力欄
        //     messageElement = document.createElement("textarea");
        //     messageElement.id = "addQuery-textInput";
        //     messageElement.rows = "10";
        //     messageElement.cols = "40";
        //     messageThread.appendChild(messageElement);

        //     messageElement = document.createElement("br");
        //     messageThread.appendChild(messageElement);

        //     // 送信ボタン
        //     messageElement = document.createElement("button");
        //     messageElement.id = "addQuery-sendButton";
        //     messageElement.innerHTML = "送信";
        //     messageThread.appendChild(messageElement);

        //     // 送信状態の表示スペース
        //     messageElement = document.createElement("div");
        //     messageElement.id = "addQuery-sendProgress";
        //     messageThread.appendChild(messageElement);
        //   }else{
        //     messageElement = document.createElement("p");
        //     messageElement.style = 'font-weight: bold; font-size: 20px';
        //     messageElement.innerHTML = "よろず相談所から返信が来るまでしばらくお待ち下さい。 <br>（目安は大体１週間です）";
        //     messageThread.appendChild(messageElement);
        //   }

        // }else{ // エラーメッセージの表示
        //   let messageElement = document.createElement("div");
        //   messageElement.className = "errorMessage";
        //   messageElement.innerHTML = apiResults[3];
        //   messageThread = messageThread.appendChild(messageElement);
        // }

        
        //// 追加質問送信フォーム
         // ボタン要素を取得
        const addQuerySendButton = document.getElementById('addQuery-sendButton');
        // ボタンがクリックされたときの処理を追加
        addQuerySendButton.addEventListener('click', async function() {

          // テキスト入力フィールドの値を取得
          let textInput = document.getElementById('addQuery-textInput').value;
          if(!textInput){
            alert("追加の質問内容を入力してください");
            return;
          }

          // 送信中のメッセージを表示する
          let sendProgressMessage = "送信中です";
          document.getElementById('addQuery-sendProgress').textContent = sendProgressMessage;

          // アクセストークンを取得する
          let accessToken;
          await getAccessToken()
          .then((accessTokenRes)=>{
            accessToken = accessTokenRes.access_token;
            console.log("accessToken",accessToken);
            //document.getElementById('accessTokenField').textContent = accessToken;
          })
          .catch((error)=>{
            let msg = "エラー: アクセストークンが取得できませんでした";
            alert("エラーが発生しました。原因を調査中です。明日以降でまた試してみてください。");
            console.log(msg);

            sendProgressMessage = "送信エラー";
            document.getElementById('addQuery-sendProgress').textContent = sendProgressMessage;

          });

          // 相談ネームと暗証番号をフォームから取得する
          let queryName = document.getElementById('queryInfo-queryName').value;
          //alert(queryName);
          let secretNo = document.getElementById('queryInfo-secretNo').value;
          //alert(secretNo);

          //// 質問を送信
          let apiFunc = { //呼び出す API関数とその引数を設定する
            function: 'receiveAddQuery',
            parameters: [queryName,secretNo,textInput]
          };

          // リクエスト
          let apiResponse = await sendApiRequest(url,accessToken,apiFunc);
          //let apiResponse = await sendPostRequest(url,requestOptions);
          let text = apiResponse.response.result;
          //document.getElementById('apiResField').textContent = text;
          //alert(text);

          //送信完了のメッセージを表示する
          sendProgressMessage = text;
          document.getElementById('addQuery-sendProgress').textContent = sendProgressMessage;

          //送信ボタンが再度押されることがないように非表示にする
          sendButton.disabled = true;

        });

      });
    }
  } catch (e) {
    alert("エラーですよ");
    throw e;
  } 
}


// }

// const getProfile = () => {
// // LINE WORKS のユーザー情報を取得
//   woff.getProfile().then((profile) => {
//     // Success
//     console.log(profile)
//     let lwUserId = profile.userId;
//     document.getElementById('userIdProfileField').textContent = lwUserId;
//   })
//   .catch((err) => {
//     // Error
//     console.log(err)
//     window.alert(err);
//   });
// };

// プログラム実行

//WOFF On load
window.addEventListener('load', () => {
  console.log(woffId);

  //if(woff.isInClient()){
  if(woffId){ //woff.isInClient を回避するデバッグ用
  // Initialize WOFF
  woff.init({ woffId: woffId })
      .then(() => {
          //// Get and show LINE WORKS userId
          //getProfile();
          //alert("initialized");

          // if(woff.isLoggedIn()){
          //   alert("OKKKKK");
          //   // よろず相談API の実行
          //   main();
          // }else{
          //   alert("LINE WORKS にログインしていない状態ではこのページにアクセスできません。");
          //   window.location.href = 'https://auth.worksmobile.com/login/login?accessUrl=http%3A%2F%2Fjp2-common.worksmobile.com%2Fproxy%2Fmy';
          //   //woff.login();
          // };

          main();
      })
      .catch((err) => {
          // Error
          alert("エラー");
          window.alert(err);
          //console.error(err)
      });
    }else{
      alert("LINE WORKS アプリ以外からはこのページにアクセスできません。");
      window.location.href = 'https://line.worksmobile.com/jp';
    };
});