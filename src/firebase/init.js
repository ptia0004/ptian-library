// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBFjQQrnwd54aJh0TbUXSUnO-mfy3mQoCE',
  authDomain: 'fit5032-ef8e5.firebaseapp.com',
  projectId: 'fit5032-ef8e5',
  storageBucket: 'fit5032-ef8e5.firebasestorage.app',
  messagingSenderId: '587023100872',
  appId: '1:587023100872:web:6e1e0e64511d2e38c3eefd'
}

const firebaseApp = initializeApp(firebaseConfig)

// Initialize Firebase
const db = getFirestore(firebaseApp)
export default db

export const auth = getAuth(firebaseApp)
