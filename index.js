import { woffId } from './params.js'

//// プログラム実行
//WOFF On load
window.addEventListener('load', () => {
  console.log(woffId)

  // if(woff.isInClient()){
  if(woffId){
  // // Initialize WOFF
  woff.init({ woffId: woffId })
      .then(() => {
          ///// Get and show LINE WORKS userId
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

          // if(woff.isInClient()){
          //   alert("利用可能です");
          //   // よろず相談API の実行
          //   main();
          // }else{
          //   alert("LINE WORKS アプリ以外からはよろず相談が利用できません。");
          //   //woff.login();
          //   window.location.href = 'https://line.worksmobile.com/jp';
          //   //woff.login();
          // };
      })
      .catch((err) => {
          // Error
          window.alert(err);
          console.error(err)
      });
    }else{
      alert("LINE WORKS アプリ以外からはこのページにアクセスできません。");
      window.location.href = 'https://line.worksmobile.com/jp';
      //woff.login();
    };
});


