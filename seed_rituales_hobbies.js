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

const seedSpecificZen = async () => {
  const misionesRef = collection(db, 'misiones_personalizadas');
  
  // Rituales
  const qR = query(misionesRef, where("stateKey", "==", "Zen_Rituales"));
  const snapR = await getDocs(qR);
  const titles = snapR.docs.map(d => d.data().title);

  const rituales = [
    { title: 'Meditación Guiada', sub: '10 mins', color: '#FDE047' },
    { title: 'Journaling', sub: '15 mins', color: '#F472B6' },
    { title: 'Silencio Total', sub: '5 mins', color: '#38BDF8' }
  ];

  for (const r of rituales) {
    if (!titles.includes(r.title)) {
      await addDoc(misionesRef, { ...r, isCustom: true, stateKey: 'Zen_Rituales' });
      console.log('Agregado:', r.title);
    }
  }

  process.exit(0);
};

seedSpecificZen();
