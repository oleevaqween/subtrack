import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, onValue, off } from 'firebase/database'

// You'll replace these with your own Firebase project config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
}

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

/**
 * Generate a consistent database path from a passphrase.
 * This acts as a simple "account" — anyone with the same passphrase shares data.
 */
async function hashPassphrase(passphrase) {
  const encoder = new TextEncoder()
  const data = encoder.encode(passphrase.trim().toLowerCase())
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Save all user data to Firebase under their hashed passphrase key.
 */
export async function syncToFirebase(passphrase, data) {
  const hash = await hashPassphrase(passphrase)
  const dataRef = ref(db, `users/${hash}`)
  await set(dataRef, {
    subscriptions: data.subscriptions || [],
    exchangeRate: data.exchangeRate || '1600',
    updatedAt: new Date().toISOString(),
  })
}

/**
 * Subscribe to real-time changes from Firebase.
 * Returns an unsubscribe function.
 */
export async function subscribeToFirebase(passphrase, onData) {
  const hash = await hashPassphrase(passphrase)
  const dataRef = ref(db, `users/${hash}`)

  onValue(dataRef, (snapshot) => {
    const val = snapshot.val()
    if (val) {
      onData(val)
    }
  })

  // Return unsubscribe function
  return () => off(dataRef)
}

/**
 * Check if Firebase is configured (has a database URL).
 */
export function isFirebaseConfigured() {
  return Boolean(firebaseConfig.databaseURL)
}
