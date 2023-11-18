import { woffId, SCRIPT_ID } from './params.js'
import { getAccessToken,sendApiRequest } from './funcs.js'

const url = `https://script.googleapis.com/v1/scripts/${SCRIPT_ID}:run`

//// 質問送信フォーム
    // ボタン要素を取得
    const sendButton = document.getElementById('send-button');
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
      })
      //let accessToken = accessTokenRes.access_token;
      // console.log("accessToken",accessToken);
      // document.getElementById('accessTokenField').textContent = accessToken;

      //// 質問を送信
      //textInput = "こここここｋ";
      //secretNo = `1234`;
      //secretNo = "1234";
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

      //送信完了のメッセージを表示する
      sendProgressMessage = "";
      document.getElementById('send-progress').textContent = sendProgressMessage;

    });