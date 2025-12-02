

// Firebase プロジェクト設定
const firebaseConfig = {
  apiKey: "AIzaSyCp_ulru9MutrgoTNVEq1JBUUycfykFkyo",
  authDomain: "amadeuschat-4525e.firebaseapp.com",
  projectId: "amadeuschat-4525e",
  storageBucket: "amadeuschat-4525e.firebasestorage.app",
  messagingSenderId: "695129033716",
  appId: "1:695129033716:web:a9a001bab4cfc8453087a1"
};

// Firebase アプリの初期化
const app = firebase.initializeApp(firebaseConfig); // firebase. を追加
const functions = app.functions("us-central1"); // app.functions を使用

// ローカル開発環境でのみFunctionsエミュレータを使用
if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
  functions.useFunctionsEmulator("http://127.0.0.1:5001"); // functions.useFunctionsEmulator を使用
}

// const auth = app.auth(); // app.auth() を削除

// 匿名認証は不要 // app.auth().signInAnonymously() を削除
// app.auth().signInAnonymously()
//   .then(() => {
//     console.log("Signed in anonymously to Firebase.");
//   })
//   .catch((error) => {
//     console.error("Error signing in anonymously:", error);
//   });

// chat Functions を呼び出す関数
export async function callChatFunction(message, chatId = null) {
  try {
    const chatFunction = functions.httpsCallable('chat'); // functions.httpsCallable を使用
    const result = await chatFunction({ message, chatId });
    return result.data; // Functions の戻り値は result.data に含まれる
  } catch (error) {
    console.error("Error calling chat function:", error);
    throw error;
  }
}