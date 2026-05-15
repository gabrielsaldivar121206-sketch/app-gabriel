import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBp0dXBhW429ThyjRNuWsKgigCAKzxDbl0",
  projectId: "appersonal-b538b",
  storageBucket: "appersonal-b538b.firebasestorage.app",
  appId: "1:262908882308:android:88437c04d1c4bc293641d1",
  messagingSenderId: "262908882308",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const seed = async () => {
  const misionesRef = collection(db, 'misiones_personalizadas');
  
  // Check if Canto tasks exist
  const q = query(misionesRef, where("stateKey", "==", "Música_Canto"));
  const snap = await getDocs(q);
  
  if (!snap.empty) {
    console.log("Misiones de Canto ya existen.");
    process.exit(0);
  }

  const act = { stateKey: 'Música_Canto', themeColor: '#A78BFA', tasks: ['Respiración diafragmática', 'Trino de labios', 'Vocalización Sirena', 'Cantar canción de práctica', 'Ejercicios de Dicción'] };

  let added = 0;
  for (let i = 0; i < act.tasks.length; i++) {
    await addDoc(misionesRef, {
      title: act.tasks[i],
      sub: '5 mins',
      color: act.themeColor,
      isCustom: true,
      stateKey: act.stateKey
    });
    added++;
  }
  
  console.log(`Se agregaron ${added} misiones a Canto.`);
  process.exit(0);
};

seed();
