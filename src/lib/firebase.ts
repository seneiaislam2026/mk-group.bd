import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, deleteDoc, query, orderBy, onSnapshot, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBDeb4k7UEI8w_cbc1KE5vX-F1pr2eh9u4",
  authDomain: "turnkey-dock-q6tp2.firebaseapp.com",
  projectId: "turnkey-dock-q6tp2",
  storageBucket: "turnkey-dock-q6tp2.firebasestorage.app",
  messagingSenderId: "441494044485",
  appId: "1:441494044485:web:b6b12d8b757466bc0ac82c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-mkgroup-5b76dc0c-2a1b-456a-8b16-162e54df4398");

// Helper functions for common collections
export const ordersCollection = collection(db, "orders");
export const productsCollection = collection(db, "products");
export const courierHistoryCollection = collection(db, "courierHistory");
export const notificationsCollection = collection(db, "notifications");
export const staffCollection = collection(db, "staff");
export const attendanceCollection = collection(db, "attendance");
