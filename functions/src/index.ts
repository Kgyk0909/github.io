import { onCall, HttpsError, CallableRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as logger from "firebase-functions/logger";

// Firebase Admin SDK の初期化
admin.initializeApp();
const db = admin.firestore(); // db の定義

export const chat = onCall(
  { secrets: ["GEMINI_API_KEY"] }, // シークレットを指定
  async (request: CallableRequest<{ message: string; chatId?: string }>) => {
    // Functions が実行されるランタイム環境で環境変数を取得
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      throw new HttpsError("internal", "Gemini API Key is not set in environment variables.");
    }
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    logger.info("Chat function called!", { structuredData: true });

    if (!request.data.message) {
      throw new HttpsError(
        "invalid-argument",
        "Message is required."
      );
    }

    let currentChatId = request.data.chatId; // request.data から取得
    let chatRef: admin.firestore.DocumentReference;
    let messages: { role: string; parts: { text: string }[] }[] = [];

    // 会話IDがなければ新しいチャットを作成
    if (!currentChatId) {
      chatRef = db.collection("chats").doc();
      currentChatId = chatRef.id;
      // 初回メッセージを追加
      await chatRef.collection("messages").add({
        role: "user",
        parts: [{ text: request.data.message }], // request.data から取得
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
      messages.push({ role: "user", parts: [{ text: request.data.message }] });
    } else {
      // 既存の会話履歴を取得
      chatRef = db.collection("chats").doc(currentChatId);
      const messagesSnapshot = await chatRef
        .collection("messages")
        .orderBy("timestamp", "asc")
        .get();
      messages = messagesSnapshot.docs.map((doc) => ({
        role: doc.data().role,
        parts: doc.data().parts,
      }));

      // 新しいユーザーメッセージを追加
      await chatRef.collection("messages").add({
        role: "user",
        parts: [{ text: request.data.message }], // request.data から取得
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
      messages.push({ role: "user", parts: [{ text: request.data.message }] });
    }

    try {
      const chatSession = model.startChat({
        history: messages, // 過去のメッセージを履歴として渡す
        generationConfig: {
          maxOutputTokens: 200,
        },
      });

      const result = await chatSession.sendMessage(request.data.message); // request.data から取得
      const responseText = result.response.text();

      // AIの応答をFirestoreに保存
      await chatRef.collection("messages").add({
        role: "model", // Gemini APIの応答は 'model' ロール
        parts: [{ text: responseText }],
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      return {
        chatId: currentChatId,
        aiResponse: responseText,
      };
    } catch (error: any) {
      logger.error("Error communicating with Gemini API:", error);
      throw new HttpsError(
        "internal",
        "Failed to get response from AI.",
        error.message
      );
    }
  }
);
