// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNJuwQAYobzS3x85WWBsH7enq1biYX7og",
  authDomain: "otp-project-11456.firebaseapp.com",
  projectId: "otp-project-11456",
  storageBucket: "otp-project-11456.appspot.com",
  messagingSenderId: "801228087749",
  appId: "1:801228087749:web:378bc71827c943f46f2bac",
  measurementId: "G-8Q52ZRN2RG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
