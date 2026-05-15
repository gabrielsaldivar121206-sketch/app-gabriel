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

const seedZen = async () => {
  const misionesRef = collection(db, 'misiones_personalizadas');
  
  // Check if Zen tasks exist
  const q = query(misionesRef, where("stateKey", "==", "Zen"));
  const snap = await getDocs(q);
  
  if (!snap.empty) {
    console.log("Misiones de Zen ya existen.");
    process.exit(0);
  }

  const act = { stateKey: 'Zen', themeColor: '#FDE047', tasks: ['Respiración 4-7-8', 'Meditación Guiada', 'Mindfulness Corto', 'Caminata Consciente', 'Relajación Muscular'] };

  let added = 0;
  for (let i = 0; i < act.tasks.length; i++) {
    await addDoc(misionesRef, {
      title: act.tasks[i],
      sub: '10 mins',
      color: act.themeColor,
      isCustom: true,
      stateKey: act.stateKey
    });
    added++;
  }
  
  console.log(`Se agregaron ${added} misiones a Zen.`);
  process.exit(0);
};

seedZen();
