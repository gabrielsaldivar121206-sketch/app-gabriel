import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

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
  const snap = await getDocs(misionesRef);
  if (!snap.empty) {
    console.log("Ya hay misiones en la base de datos.");
    // We could delete them or just add if we want specific ones. 
    // The user asked to add 5 per activity.
  }

  const activities = [
    { stateKey: 'Música_Guitarra', themeColor: '#A78BFA', tasks: ['Afinar Guitarra', 'Practicar Acordes', 'Escala Pentatónica', 'Tocar Canción Favorita', 'Improvisación libre'] },
    { stateKey: 'Música_Piano', themeColor: '#A78BFA', tasks: ['Escalas de Hanon', 'Progresión de Acordes', 'Lectura a primera vista', 'Tocar Pieza Clásica', 'Componer melodía'] },
    { stateKey: 'Cuerpo_Entrenamiento', themeColor: '#38BDF8', tasks: ['Calentamiento', 'Flexiones', 'Abdominales', 'Sentadillas', 'Estiramiento final'] },
    { stateKey: 'Sentidos', themeColor: '#14B8A6', tasks: ['Observar detalles', 'Escuchar sonidos lejanos', 'Saborear con atención', 'Tocar texturas', 'Aromaterapia breve'] }
  ];

  let added = 0;
  for (const act of activities) {
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
  }
  console.log(`Se agregaron ${added} misiones.`);
  process.exit(0);
};

seed();
