import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

const app = initializeApp({
  projectId: "test",
  appId: "1:123:web:123",
  apiKey: "test"
});
try {
  const db = initializeFirestore(app, {}, "ai-studio-mkgroup-5b76dc0c-2a1b-456a-8b16-162e54df4398");
  console.log("Success with initializeFirestore");
} catch(e) {
  console.log(e);
}
