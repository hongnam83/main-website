import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json' assert { type: "json" };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function run() {
  try {
    const cred = await createUserWithEmailAndPassword(auth, 'sonnt.credit@gmail.com', '12345678');
    await setDoc(doc(db, 'admins', cred.user.uid), { email: 'sonnt.credit@gmail.com' });
    console.log('Created admin:', cred.user.uid);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

run();
