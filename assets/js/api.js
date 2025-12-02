import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable, useFunctionsEmulator } from "firebase/functions";
import { getAuth, signInAnonymously } from "firebase/auth";

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
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app, "us-central1"); // Functions のリージョンを設定

// ローカル開発環境でのみFunctionsエミュレータを使用
// if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
//   useFunctionsEmulator(functions, "http://127.0.0.1:5001");
// }

const auth = getAuth(app);

// 匿名認証でFunctionsを呼び出せるようにする
signInAnonymously(auth)
  .then(() => {
    console.log("Signed in anonymously to Firebase.");
  })
  .catch((error) => {
    console.error("Error signing in anonymously:", error);
  });

// chat Functions を呼び出す関数
export async function callChatFunction(message, chatId = null) {
  try {
    const chatFunction = httpsCallable(functions, 'chat');
    const result = await chatFunction({ message, chatId });
    return result.data; // Functions の戻り値は result.data に含まれる
  } catch (error) {
    console.error("Error calling chat function:", error);
    throw error;
  }
}