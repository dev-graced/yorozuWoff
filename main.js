//const axios = require('axios');
import * as https from "https";

const CLIENT_ID = "479289013154-2l1m68f7pc3dp21o1voscge1h82cqeqe.apps.googleusercontent.com"
const CLIENT_SECRET = "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"
const REFRESH_TOKEN = "1//04vn2T0NTYgeICgYIARAAGAQSNwF-L9IruSUiN7scF9ODyB8naxyb1mxjQOJy6OtQ9B8aCsqQHC_yulFDEyhikpwEJgtqJhxCR_o"
const SCRIPT_ID = "1b4ljgunjX9B-Yql8C5fiACUziGNrIe3tGwSD77PUMdDoCdZyc9sf9yiO"
const TOKEN_URL = "https://www.googleapis.com/oauth2/v4/token"
/**
 * メイン関数
 * @return string
 */
async function main() {
  try {
    const url = `https://script.googleapis.com/v1/scripts/${SCRIPT_ID}:run`;
    // アクセストークンを取得する
   
    const accessToken = await getAccessToken();
    //document.getElementById('domainIdField').textContent = "YKK?";
     // GASを実行
     
  //   const headers = {
  //     Authorization: `Bearer ${accessToken}`,
  //   };
  //   const payload = {
  //     function: 'helloworld',
  //     parameters: ['OKKKKKKKKKK']
  //   };
  //   // リクエスト
  //   const instance = axios.create({ headers });
  //   const response = await instance.post(url, payload);
  //   if (response.status !== 200 || !response.data || response.data.error) {
  //       throw new Error('Failed to run google apps script.');
  //   }
  //   const { result } = response.data.response;
  //   console.log(result);

  //   //document.getElementById('domainIdField').textContent = result;
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
    
    const reque = https.request(TOKEN_URL, options, (res)=>{
      // console.log(res)
      res.on('data', (chunk) => {
        let access_token = JSON.parse(chunk.toString())
        resolve(access_token.access_token)
      })
    })
    document.getElementById('domainIdField').textContent = "YYKK?";
    reque.write(data)
    reque.end()
  })
}

async function test() {
  document.getElementById('domainIdField').textContent = "OYYY?";
}

//test()
main()

