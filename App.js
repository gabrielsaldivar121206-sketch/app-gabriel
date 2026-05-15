import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, StyleSheet, Animated, Easing, Vibration, TextInput, KeyboardAvoidingView, Platform, AppState, Linking } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Sun, Moon, Code, Music, Activity, Sparkles, CheckCircle2, Dumbbell, Mic, BookOpen, Waves, Wind, Play, CircleDot, HeartPulse, Heart, Headphones, Plus, Gamepad2, Pencil, Zap, Clock, Brain, Infinity, Hand, Ear, Eye, Feather, SkipForward } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

import { Audio } from 'expo-av';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBp0dXBhW429ThyjRNuWsKgigCAKzxDbl0",
  projectId: "appersonal-b538b",
  storageBucket: "appersonal-b538b.firebasestorage.app",
  appId: "1:262908882308:android:88437c04d1c4bc293641d1",
  messagingSenderId: "262908882308",
};

let app, db;
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (e) {
  console.log("Firebase init error", e);
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// --------------------------------------------------------
// PREMIUM ANIMATED COMPONENTS
// --------------------------------------------------------

const AnimatedMissionCard = ({ mission, onPress, onDelete, onEdit, completedMissions = [] }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const deleteProgress = useRef(new Animated.Value(0)).current;
  const IconComp = mission.icon || Sparkles;
  const isCompleted = completedMissions.includes(mission.title);
  const lastTap = useRef(0);

  const handleLongPress = () => {
    if (!mission.isCustom) return;
    Vibration.vibrate([100, 100]);
    Animated.timing(deleteProgress, { toValue: 1, duration: 600, useNativeDriver: true }).start(({ finished }) => {
      if (finished) onDelete(mission.id);
    });
  };

  const handlePress = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (mission.isCustom && onEdit) onEdit(mission);
    } else {
      setTimeout(() => {
        if (Date.now() - lastTap.current >= 300) {
          Vibration.vibrate(10);
          onPress();
        }
      }, 300);
    }
    lastTap.current = now;
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handlePress}
      onLongPress={handleLongPress}
      style={{ marginRight: 16 }}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <BlurView intensity={35} tint="dark" style={[styles.glassCard, { overflow: 'hidden' }, isCompleted && { backgroundColor: 'rgba(52,211,153,0.1)', borderColor: 'rgba(52,211,153,0.3)' }]}>
          
          {/* Radial Delete Progress */}
          {mission.isCustom && (
            <Animated.View style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 300, height: 300, borderRadius: 150,
              backgroundColor: mission.color,
              opacity: 0.3,
              transform: [
                { translateX: -150 }, { translateY: -150 },
                { scale: deleteProgress }
              ]
            }} />
          )}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <View style={[styles.iconCircle, { backgroundColor: isCompleted ? 'rgba(52,211,153,0.2)' : `${mission.color}22` }]}>
              <IconComp color={isCompleted ? '#34D399' : mission.color} size={18} strokeWidth={1.5} />
            </View>
            {isCompleted ? <CheckCircle2 color="#34D399" size={14} /> : <Play color="rgba(255,255,255,0.3)" size={14} />}
          </View>
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <Text style={[styles.glassCardTitle, isCompleted && { color: '#34D399' }]} numberOfLines={1}>{mission.title}</Text>
            <Text style={[styles.glassCardSub, isCompleted && { color: '#34D399' }]}>{isCompleted ? 'Completada' : mission.sub}</Text>
          </View>
        </BlurView>
      </Animated.View>
    </TouchableOpacity>
  );
};

const AnimatedMicroAction = ({ action, ThemeColor }) => {
  const [completed, setCompleted] = useState(false);
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    if (completed) return;
    Vibration.vibrate(30);
    Animated.parallel([
      Animated.spring(scale, { toValue: 1.05, speed: 20, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0.4, duration: 300, useNativeDriver: true })
    ]).start(() => {
      Animated.spring(scale, { toValue: 1, speed: 20, useNativeDriver: true }).start();
      setCompleted(true);
    });
  };

  return (
    <TouchableScale onPress={handlePress} disabled={completed}>
      <Animated.View style={[
        styles.microCard, 
        { 
          borderColor: completed ? 'transparent' : `${ThemeColor}44`, 
          opacity, 
          transform: [{ scale }],
          flexDirection: 'row', 
          alignItems: 'center'
        }
      ]}>
        {completed && <CheckCircle2 color="#94A3B8" size={14} strokeWidth={2} style={{ marginRight: 6 }} />}
        <Text style={[styles.microCardText, completed && { color: '#94A3B8', textDecorationLine: 'line-through' }]}>
          {action}
        </Text>
      </Animated.View>
    </TouchableScale>
  );
};

const TouchableScale = ({ onPress, onLongPress, children, style, disabled }) => {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <TouchableOpacity
      activeOpacity={1}
      disabled={disabled}
      onPressIn={() => Animated.spring(scale, { toValue: 0.95, speed: 20, bounciness: 5, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, speed: 20, bounciness: 5, useNativeDriver: true }).start()}
      onPress={() => {
        if (onPress) {
          Vibration.vibrate(10);
          onPress();
        }
      }}
      onLongPress={() => {
        if (onLongPress) {
          Vibration.vibrate(40);
          onLongPress();
        }
      }}
      style={style}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

const AnimatedTaskCard = ({ task, color, isLast }) => {
  const [completed, setCompleted] = useState(false);
  const opacity = useRef(new Animated.Value(1)).current;

  const handleComplete = () => {
    if (completed) return;
    Vibration.vibrate(40);
    Animated.timing(opacity, { toValue: 0.4, duration: 300, useNativeDriver: true }).start(() => setCompleted(true));
  };

  return (
    <View style={{ flexDirection: 'row', marginBottom: 16 }}>
      <View style={{ width: 24, alignItems: 'center', marginRight: 12 }}>
        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: completed ? '#475569' : color, marginTop: 4 }} />
        {!isLast && <View style={{ width: 1, flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginTop: 8 }} />}
      </View>
      <TouchableScale onPress={handleComplete} disabled={completed} style={{ flex: 1 }}>
        <Animated.View style={[styles.agendaCard, { opacity, borderColor: completed ? 'transparent' : 'rgba(255, 255, 255, 0.05)' }]}>
          <View style={styles.agendaContent}>
            <Text style={[styles.agendaTaskTitle, completed && { textDecorationLine: 'line-through', color: '#94A3B8' }]}>{task.title}</Text>
            <Text style={styles.agendaTimeText}>{task.time}</Text>
          </View>
          <CheckCircle2 color={completed ? color : "#475569"} size={20} strokeWidth={1.2} />
        </Animated.View>
      </TouchableScale>
    </View>
  );
};

const CircularProgress = ({ size, strokeWidth, progress, color }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle stroke="rgba(255,255,255,0.1)" fill="none" cx={size/2} cy={size/2} r={radius} strokeWidth={strokeWidth} />
        <Circle stroke={color} fill="none" cx={size/2} cy={size/2} r={radius} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} />
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Text style={{ color: 'white', fontWeight: '800', fontSize: size * 0.25 }}>{progress}%</Text>
      </View>
    </View>
  );
};

const HorizontalBar = ({ label, progress, color }) => (
  <View style={{ marginBottom: 12 }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
      <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '500' }}>{label}</Text>
      <Text style={{ color: 'white', fontSize: 11, fontWeight: '700' }}>{progress}%</Text>
    </View>
    <View style={{ height: 4, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
      <View style={{ width: `${progress}%`, height: '100%', backgroundColor: color, borderRadius: 2 }} />
    </View>
  </View>
);

// --------------------------------------------------------
// DATA MAPPING
// --------------------------------------------------------

const modeData = {
  Sentidos: {
    themeColor: '#14B8A6',
    gradient: ['rgba(20, 184, 166, 0.4)', 'rgba(45, 212, 191, 0.2)'],
    missions: [
      { id: 's1', title: 'Tocar Texturas', sub: '5 mins', icon: Hand, color: '#14B8A6' },
      { id: 's2', title: 'Sonidos Lejanos', sub: '3 mins', icon: Ear, color: '#38BDF8' },
      { id: 's3', title: 'Observar', sub: 'Detalles', icon: Eye, color: '#FDE047' }
    ],
    quickPlay: { title: 'Ambient Nature', artist: 'Earth', color: '#14B8A6', url: 'https://open.spotify.com/playlist/37i9dQZF1DX4PP3DA4J0N8' },
    microActions: ['Toca tu ropa', 'Huele tu café', 'Siente el aire frío', 'Cierra los ojos 10s'],
  },
};

const bodyData = {
  Entrenamiento: {
    themeColor: '#38BDF8',
    gradient: ['rgba(3, 105, 161, 0.4)', 'rgba(56, 189, 248, 0.2)'],
    icon: Dumbbell,
    missions: [
      { id: 'c1', title: 'Estiramiento', sub: '10 mins', icon: Activity, color: '#38BDF8' },
      { id: 'c2', title: 'Fuerza', sub: 'Push ups', icon: Dumbbell, color: '#34D399' }
    ],
    quickPlay: { title: 'Stronger', artist: 'Kanye West', color: '#38BDF8', url: 'https://open.spotify.com/track/4fzsfWzRhPawzqhX8Qt9F3' },
    microActions: ['Ajusta postura', 'Siente el suelo', 'Respiración profunda', 'Estira la espalda'],
  },
  Fútbol: {
    themeColor: '#10B981',
    gradient: ['rgba(4, 120, 87, 0.4)', 'rgba(16, 185, 129, 0.2)'],
    icon: CircleDot,
    missions: [
      { id: 'f1', title: 'Toques de Balón', sub: '15 mins', icon: CircleDot, color: '#10B981' },
      { id: 'f2', title: 'Sprints Cortos', sub: '5 mins', icon: Activity, color: '#FDE047' }
    ],
    quickPlay: { title: 'Sicko Mode', artist: 'Travis Scott', color: '#10B981', url: 'https://open.spotify.com/track/2xLMifQCjDGFmkHkpNLD9h' },
    microActions: ['Estira abductores', 'Hidratación', 'Visualiza el campo', 'Ata tus botines'],
  }
};

const musicData = {
  Guitarra: {
    themeColor: '#A78BFA',
    gradient: ['rgba(109, 40, 217, 0.4)', 'rgba(167, 139, 250, 0.2)'],
    icon: Music,
    missions: [
      { id: 'g1', title: 'Tocar Acordes', sub: '15 mins', icon: Music, color: '#A78BFA' },
      { id: 'g2', title: 'Improvisación', sub: 'Jam', icon: Play, color: '#F472B6' }
    ],
    quickPlay: { title: 'Moonstruck', artist: 'ENHYPEN', color: '#A78BFA', localAudio: require('./assets/moonstruck.m4a') },
    microActions: ['Afina la guitarra', 'Limpia las cuerdas', 'Siente los trastes', 'Estira los dedos'],
  },
  Piano: {
    themeColor: '#F472B6',
    gradient: ['rgba(244, 114, 182, 0.4)', 'rgba(251, 113, 133, 0.2)'],
    icon: Music,
    missions: [
      { id: 'p1', title: 'Ejercicios Hanon', sub: '20 mins', icon: Music, color: '#F472B6' },
      { id: 'p2', title: 'Repertorio', sub: 'Aprender', icon: BookOpen, color: '#A78BFA' }
    ],
    quickPlay: { title: 'Fatal Trouble', artist: 'ENHYPEN', color: '#F472B6', localAudio: require('./assets/fatal_trouble.m4a') },
    microActions: ['Calienta las manos', 'Siente las teclas', 'Corrige postura', 'Respira'],
  },
  Canto: {
    themeColor: '#FDE047',
    gradient: ['rgba(253, 224, 71, 0.4)', 'rgba(250, 204, 21, 0.2)'],
    icon: Mic,
    missions: [
      { id: 'c1', title: 'Calentamiento', sub: '10 mins', icon: Mic, color: '#FDE047' },
      { id: 'c2', title: 'Grabar Demo', sub: 'Voz Principal', icon: Play, color: '#38BDF8' }
    ],
    quickPlay: { title: 'Dangerously', artist: 'Charlie Puth', color: '#FDE047', url: 'https://open.spotify.com/track/28drn30iB0FMmFoByZHDkk' },
    microActions: ['Bebe té', 'Relaja mandíbula', 'Trinos de labios', 'Postura recta'],
  }
};

// --------------------------------------------------------
// MAIN APP
// --------------------------------------------------------

const MainApp = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Música'); // Default to Music
  const [musicSubTab, setMusicSubTab] = useState('Guitarra');
  const [bodySubTab, setBodySubTab] = useState('Entrenamiento');
  
  // Custom Missions State
  const [customMissions, setCustomMissions] = useState({ Dev: [] });
  const [isAddingMission, setIsAddingMission] = useState(false);
  const [editingMissionId, setEditingMissionId] = useState(null);
  const [showRuedaVida, setShowRuedaVida] = useState(false);
  const [newMissionName, setNewMissionName] = useState('');
  const [newMissionTime, setNewMissionTime] = useState('');
  const [isNewMissionSeconds, setIsNewMissionSeconds] = useState(false);
  
  // Reminders
  const [reminders, setReminders] = useState([]);
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [newReminderText, setNewReminderText] = useState('');
  const [newReminderTime, setNewReminderTime] = useState('08:00');
  
  // Morning/Night routine
  const [showRoutine, setShowRoutine] = useState(null); // 'morning' | 'night' | null
  const [routineChecks, setRoutineChecks] = useState({});

  // States
  const [focusTask, setFocusTask] = useState(null); 
  const [focusTimeLeft, setFocusTimeLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [panicState, setPanicState] = useState('off'); // 'off' | 'breathing' | 'journaling'
  const [crisisJournal, setCrisisJournal] = useState('');
  const emergencySoundRef = useRef(null);
  const [breathPhase, setBreathPhase] = useState('Inhala...');
  const breathScaleAnim = useRef(new Animated.Value(1)).current;
  const breathInterval = useRef(null);
  
  // App UX States
  const [isAppReady, setIsAppReady] = useState(false);
  const splashAnim = useRef(new Animated.Value(0)).current;
  const [isBlackout, setIsBlackout] = useState(false);

  // Dynamic UI Stats
  const [dbStats, setDbStats] = useState({ racha: 0, energia: 0, mente: 0, pasion: 0, cuerpo: 0 });
  const [globalStats, setGlobalStats] = useState({ energia: 0, mente: 0, pasion: 0, cuerpo: 0 });

  const [completedToday, setCompletedToday] = useState([]);
  
  const affirmationsList = [
    "Respiro. Soy capaz. Soy luz.",
    "Cada pequeño paso es progreso.",
    "Mi mente es un refugio de paz.",
    "Tengo el control de mi tiempo y energía.",
    "Me permito descansar y florecer."
  ];
  const dailyAffirmation = affirmationsList[new Date().getDate() % affirmationsList.length];

  // Internal Audio for Quick Play
  const ENHYPEN_PLAYLIST = [
    { title: 'Moonstruck', artist: 'ENHYPEN', url: require('./assets/moonstruck.m4a') },
    { title: 'Fatal Trouble', artist: 'ENHYPEN', url: require('./assets/fatal_trouble.m4a') },
    { title: 'Like', artist: 'BTS', url: require('./assets/like_bts.m4a') },
    { title: 'No Way Back', artist: 'ENHYPEN', url: require('./assets/no_way_back.m4a') },
    { title: 'XO (Only If You Say Yes)', artist: 'ENHYPEN', url: require('./assets/xo.m4a') },
  ];
  
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(null);
  const [isQuickPlaying, setIsQuickPlaying] = useState(false);

  const toggleQuickPlay = async (audioSource, forcePlay = false) => {
    try {
      if (isQuickPlaying && audioRef.current && !forcePlay) {
        await audioRef.current.pauseAsync();
        setIsQuickPlaying(false);
      } else {
        if (audioRef.current) {
          await audioRef.current.stopAsync();
          await audioRef.current.unloadAsync();
        }
        const source = typeof audioSource === 'string' ? { uri: audioSource } : audioSource;
        const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: true, isLooping: true });
        audioRef.current = sound;
        setIsQuickPlaying(true);
      }
    } catch (e) { console.log("Audio Error", e); }
  };

  const playNextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % ENHYPEN_PLAYLIST.length;
    setCurrentTrackIndex(nextIndex);
    if (isQuickPlaying) {
      toggleQuickPlay(ENHYPEN_PLAYLIST[nextIndex].url, true);
    }
  };

  const fetchStats = async () => {
    try {
      if (db) {
        const querySnapshot = await getDocs(collection(db, 'registros_bienestar'));
        
        let t_energia = 0, t_mente = 0, t_pasion = 0, t_cuerpo = 0;
        let h_energia = 0, h_mente = 0, h_pasion = 0, h_cuerpo = 0;
        
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        
        let completedTodayList = [];
        let daysActive = new Set();
        
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const docTime = data.timestamp ? (data.timestamp.toDate ? data.timestamp.toDate().getTime() : data.timestamp) : Date.now();
          const isToday = docTime >= startOfToday;
          
          daysActive.add(new Date(docTime).toLocaleDateString());
          
          if (data.tipo === 'Refugio' || data.tipo === 'Zen') { h_mente += 20; h_energia += 10; }
          if (data.tipo === 'Música') { h_pasion += 25; h_energia += 15; }
          if (data.tipo === 'Cuerpo') { h_cuerpo += 30; h_energia += 20; }
          if (data.tipo === 'Sentidos') { h_mente += 15; h_energia += 10; }

          if (isToday) {
            if (data.tarea) completedTodayList.push(data.tarea);
            if (data.tipo === 'Refugio' || data.tipo === 'Zen') { t_mente += 20; t_energia += 10; }
            if (data.tipo === 'Música') { t_pasion += 25; t_energia += 15; }
            if (data.tipo === 'Cuerpo') { t_cuerpo += 30; t_energia += 15; }
            if (data.tipo === 'Sentidos') { t_mente += 15; t_energia += 10; }
          }
        });
        
        // Calculate Streak
        const sortedDays = Array.from(daysActive).map(d => new Date(d).getTime()).sort((a,b) => b - a);
        let currentStreak = 0;
        let expectedTime = startOfToday;
        
        for (let i = 0; i < sortedDays.length; i++) {
           const diff = Math.abs(expectedTime - sortedDays[i]);
           if (diff === 0 || diff <= 86400000 * 1.5) { 
              currentStreak++;
              expectedTime -= 86400000;
           } else {
              if (i === 0 && (startOfToday - sortedDays[0]) > 86400000 * 1.5) break; 
              else if (i > 0) break;
           }
        }

        setCompletedToday(completedTodayList);
        setDbStats({
          racha: currentStreak, 
          energia: Math.min(t_energia, 100), 
          mente: Math.min(t_mente, 100), 
          pasion: Math.min(t_pasion, 100), 
          cuerpo: Math.min(t_cuerpo, 100)
        });
        setGlobalStats({
          energia: Math.min(h_energia, 100), 
          mente: Math.min(h_mente, 100), 
          pasion: Math.min(h_pasion, 100), 
          cuerpo: Math.min(h_cuerpo, 100)
        });
      }
    } catch (e) {}
  };

  const getTabProgress = () => {
    switch (activeTab) {
      case 'Música': return dbStats.pasion;
      case 'Cuerpo': return dbStats.cuerpo;
      case 'Sentidos': return dbStats.mente;
      case 'Zen': return dbStats.energia;
      default: return dbStats.energia;
    }
  };

  const fetchGratitudes = async () => {
    try {
      if (db) {
        const querySnapshot = await getDocs(collection(db, 'gratitudes'));
        const list = [];
        querySnapshot.forEach((docSnap) => {
          const d = docSnap.data();
          const time = d.timestamp ? (d.timestamp.toDate ? d.timestamp.toDate().getTime() : d.timestamp) : Date.now();
          const dateStr = new Date(time).toLocaleDateString([], { month: 'short', day: 'numeric' });
          list.push({ texto: d.texto, date: dateStr, timeMs: time });
        });
        list.sort((a,b) => b.timeMs - a.timeMs);
        setGratitudes(list);
      }
    } catch(e) {}
  };

  useEffect(() => {
    fetchStats();
    fetchGratitudes();
  }, [panicState, focusAnim]);

  useEffect(() => {
    Animated.sequence([
      Animated.delay(800),
      Animated.timing(splashAnim, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
    ]).start(() => setIsAppReady(true));
  }, []);
  
  // Zen State
  const [zenTime, setZenTime] = useState(0);
  const [isZenActive, setIsZenActive] = useState(false);
  const [gratitudeText, setGratitudeText] = useState('');
  const [gratitudes, setGratitudes] = useState([]);
  
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const focusAnim = useRef(new Animated.Value(0)).current;
  const heartbeatAnim = useRef(new Animated.Value(1)).current;
  const emergencyInterval = useRef(null);

  const handleTabSwitch = (newTab) => {
    if (newTab === activeTab) return;
    Vibration.vibrate(10);
    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      setActiveTab(newTab);
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();
    });
  };

  const handleSubTabSwitch = (newSubTab, isBody = false) => {
    const currentSubTab = isBody ? bodySubTab : musicSubTab;
    if (newSubTab === currentSubTab) return;
    Vibration.vibrate(15);
    Animated.timing(fadeAnim, { toValue: 0, duration: 100, useNativeDriver: true }).start(() => {
      if (isBody) setBodySubTab(newSubTab);
      else setMusicSubTab(newSubTab);
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();
    });
  };

  useEffect(() => {
    let interval;
    if (isZenActive) {
      interval = setInterval(() => {
        setZenTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isZenActive]);

  const appState = useRef(AppState.currentState);
  const targetEndTime = useRef(null);

  useEffect(() => {
    // Request Notification Permissions
    const requestPermissions = async () => {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') console.log('Notification permissions denied');
      } catch (e) {}
    };
    requestPermissions();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        if (isTimerRunning && targetEndTime.current) {
          const now = Date.now();
          const remaining = Math.max(0, Math.floor((targetEndTime.current - now) / 1000));
          setFocusTimeLeft(remaining);
          if (remaining === 0) {
            setIsTimerRunning(false);
            targetEndTime.current = null;
            Vibration.vibrate([500, 500, 500, 500, 500]);
          }
        }
      }
      appState.current = nextAppState;
    });
    return () => subscription.remove();
  }, [isTimerRunning]);

  useEffect(() => {
    let interval;
    if (isTimerRunning && focusTimeLeft > 0) {
      targetEndTime.current = Date.now() + focusTimeLeft * 1000;
      
      Notifications.cancelAllScheduledNotificationsAsync().then(() => {
        Notifications.scheduleNotificationAsync({
          content: {
            title: '✨ Misión Completada',
            body: `Has terminado. ¡Buen trabajo! Respira profundo.`,
            sound: true,
          },
          trigger: { seconds: focusTimeLeft },
        });
      });

      interval = setInterval(() => {
        setFocusTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isTimerRunning) {
      targetEndTime.current = null;
      Notifications.cancelAllScheduledNotificationsAsync();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Auto-complete when timer reaches 0
  useEffect(() => {
    if (focusTimeLeft === 0 && focusTask && isTimerRunning) {
      Vibration.vibrate([500, 500, 500, 500, 500]);
      setIsTimerRunning(false);
      targetEndTime.current = null;
      
      if (db) {
        addDoc(collection(db, 'registros_bienestar'), {
          tipo: activeTab,
          tarea: focusTask,
          timestamp: serverTimestamp()
        }).then(() => fetchStats()).catch(() => {});
      }
      setCompletedToday(prev => [...prev, focusTask]);
      setTimeout(() => {
        Animated.timing(focusAnim, { toValue: 0, duration: 400, useNativeDriver: true }).start(() => {
          setFocusTask(null);
        });
        Notifications.cancelAllScheduledNotificationsAsync();
      }, 1500);
    }
  }, [focusTimeLeft]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const startFocusMode = async (taskTitle, taskTimeText) => {
    const timeMatch = taskTimeText.match(/\d+/);
    const amount = timeMatch ? parseInt(timeMatch[0]) : 25;
    const isSeconds = taskTimeText.toLowerCase().includes('seg');
    
    setFocusTimeLeft(isSeconds ? amount : amount * 60);
    setIsTimerRunning(false);
    setFocusTask(taskTitle);
    Animated.timing(focusAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  };

  const handleQuickComplete = () => {
    setIsTimerRunning(false);
    targetEndTime.current = null;
    Vibration.vibrate([200, 200, 200]);
    if (db) {
      addDoc(collection(db, 'registros_bienestar'), {
        tipo: activeTab,
        tarea: focusTask,
        timestamp: serverTimestamp()
      }).then(() => fetchStats()).catch(() => {});
    }
    // optimistic
    setCompletedToday(prev => [...prev, focusTask]);
    endFocusMode();
  };

  const endFocusMode = async () => {
    setIsTimerRunning(false);
    Animated.timing(focusAnim, { toValue: 0, duration: 400, useNativeDriver: true }).start(() => {
      setFocusTask(null);
    });
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  const triggerEmergencyAnchor = async () => {
    setPanicState('breathing');
    setBreathPhase('Inhala...');
    
    // Play internal ambient sound
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3' }, // Nature/Lofi ambient placeholder
        { isLooping: true, volume: 0.8 }
      );
      emergencySoundRef.current = sound;
      await sound.playAsync();
    } catch (e) {
      console.log('Audio error', e);
    }

    // Breathing animation
    const breathCycle = () => Animated.sequence([
      Animated.timing(breathScaleAnim, { toValue: 1.8, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.timing(breathScaleAnim, { toValue: 1.8, duration: 2000, useNativeDriver: true }), // hold
      Animated.timing(breathScaleAnim, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    ]);
    Animated.loop(breathCycle()).start();

    // Phase labels
    const phases = ['Inhala...', 'Inhala...', 'Inhala...', 'Inhala...', 'Mantén', 'Mantén', 'Exhala...', 'Exhala...', 'Exhala...', 'Exhala...'];
    let i = 0;
    breathInterval.current = setInterval(() => {
      setBreathPhase(phases[i % phases.length]);
      i++;
    }, 1000);

    // Haptic heartbeat
    let beat = 0;
    emergencyInterval.current = setInterval(() => {
      beat++;
      if (beat % 2 !== 0) Vibration.vibrate(40);
      else setTimeout(() => Vibration.vibrate(30), 150);
    }, 1000);

    Animated.loop(
      Animated.sequence([
        Animated.timing(heartbeatAnim, { toValue: 1.3, duration: 200, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(heartbeatAnim, { toValue: 1, duration: 200, easing: Easing.in(Easing.ease), useNativeDriver: true }),
        Animated.delay(100),
        Animated.timing(heartbeatAnim, { toValue: 1.1, duration: 150, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(heartbeatAnim, { toValue: 1, duration: 200, easing: Easing.in(Easing.ease), useNativeDriver: true }),
        Animated.delay(800)
      ])
    ).start();
  };

  const stopEmergencyAnchor = async () => {
    setPanicState('journaling');
    heartbeatAnim.stopAnimation();
    breathScaleAnim.stopAnimation();
    if (emergencyInterval.current) clearInterval(emergencyInterval.current);
    if (breathInterval.current) clearInterval(breathInterval.current);
    
    if (emergencySoundRef.current) {
      await emergencySoundRef.current.stopAsync();
      await emergencySoundRef.current.unloadAsync();
      emergencySoundRef.current = null;
    }
  };

  const saveCrisisJournal = async () => {
    setPanicState('off');
    
    // Guardado nativo en Firebase
    try {
      if (db) {
        await addDoc(collection(db, 'registros_bienestar'), {
          tipo: 'Refugio',
          duracion: 0, 
          timestamp: serverTimestamp(),
          sentimiento_post: crisisJournal
        });
        console.log("Registro de crisis guardado en Firebase");
      }
    } catch (e) {
      console.log('Error saving to Firebase', e);
    }
    
    try {
      // Local Backup
      const record = {
        id: Date.now().toString(),
        tipo: 'Refugio',
        duracion: 0, 
        timestamp: new Date().toISOString(),
        sentimiento_post: crisisJournal
      };
      
      const historyStr = await AsyncStorage.getItem('registros_bienestar');
      const history = historyStr ? JSON.parse(historyStr) : [];
      history.push(record);
      await AsyncStorage.setItem('registros_bienestar', JSON.stringify(history));
    } catch (e) {
      console.log('Error saving local backup', e);
    }

    setCrisisJournal('');
    Vibration.vibrate(50);
  };

  const hour = new Date().getHours();
  let greeting = 'Buenas noches';
  let TimeIcon = Moon;
  let energyLevel = 'baja';

  if (hour >= 5 && hour < 12) {
    greeting = 'Buenos días';
    TimeIcon = Sun;
    energyLevel = 'alta';
  } else if (hour >= 12 && hour < 19) {
    greeting = 'Buenas tardes';
    TimeIcon = Sun;
    energyLevel = hour < 15 ? 'alta' : 'media';
  }

  // Smart Suggestion Engine
  const getSmartSuggestion = () => {
    if (hour >= 6 && hour < 10) return { icon: Zap, text: 'Energía alta — ideal para tareas difíciles', color: '#34D399', mission: 'Deep Work' };
    if (hour >= 10 && hour < 13) return { icon: Brain, text: 'Pico cognitivo — perfecto para estudiar o crear', color: '#A78BFA', mission: 'Crear' };
    if (hour >= 13 && hour < 15) return { icon: Wind, text: 'Post-almuerzo — tareas ligeras o Zen', color: '#38BDF8', mission: 'Descanso' };
    if (hour >= 15 && hour < 18) return { icon: Code, text: 'Segundo aire — bueno para programar', color: '#34D399', mission: 'Código' };
    if (hour >= 18 && hour < 21) return { icon: Music, text: 'Hora creativa — practica tu instrumento', color: '#F472B6', mission: 'Música' };
    return { icon: Moon, text: 'Hora de cerrar — journaling o desconexión', color: '#FDE047', mission: 'Descanso' };
  };
  const smartSuggestion = getSmartSuggestion();

  // Wellness Tips (random by time)
  const morningTips = ['¿Ya tomaste agua? 💧', '¿Tendiste tu cama? 🛏️', 'Estírate un momento 🙆', '¿Tu escritorio está limpio? ✨', 'Lávate la cara con agua fría 🧊'];
  const afternoonTips = ['No olvides lavar tus servicios 🍽️', '¿Ya almorzaste? Come algo nutritivo 🥗', 'Descansa la vista 5 mins 👀', 'Hidrátate, llevas rato sin agua 💧', '¿Ya te moviste hoy? Camina un poco 🚶'];
  const nightTips = ['Prepara tu ropa de mañana 👔', 'Apaga pantallas 30 min antes de dormir 📵', '¿Cepillaste tus dientes? 🪥', 'Escribe 3 cosas buenas de hoy ✍️', 'Estira antes de dormir 🧘'];
  const currentTips = hour < 12 ? morningTips : hour < 18 ? afternoonTips : nightTips;
  const currentWellnessTip = currentTips[Math.floor(Date.now() / 300000) % currentTips.length];

  // Morning/Night Routines
  const morningRoutine = ['Tender la cama', 'Lavarse la cara', 'Cepillarse los dientes', 'Tomar agua', 'Estirar el cuerpo', 'Desayunar'];
  const nightRoutine = ['Lavar servicios', 'Organizar escritorio', 'Preparar ropa', 'Cepillarse los dientes', 'Skincare', 'Reflexión del día'];

  useEffect(() => { fetchReminders(); }, []);

  const currentData = activeTab === 'Música' 
    ? musicData[musicSubTab] 
    : activeTab === 'Cuerpo' 
      ? bodyData[bodySubTab] 
      : (modeData[activeTab] || modeData['Sentidos']);
      
  const ThemeColor = activeTab === 'Zen' ? '#FDE047' : currentData.themeColor;
  
  // Determine correct state array key
  const stateKey = activeTab === 'Música' ? `Música_${musicSubTab}` : activeTab === 'Cuerpo' ? `Cuerpo_${bodySubTab}` : activeTab;
  // Ensure array exists
  const safeCustomMissions = customMissions[stateKey] || [];
  const allMissions = activeTab !== 'Zen' ? [...safeCustomMissions] : [];
  const filteredReminders = reminders.filter(r => r.actividad === stateKey);

  // Reminder functions
  const fetchReminders = async () => {
    try {
      if (db) {
        const snap = await getDocs(collection(db, 'recordatorios'));
        const list = [];
        snap.forEach(d => list.push({ id: d.id, ...d.data() }));
        setReminders(list);
      }
    } catch(e) {}
  };

  const addReminder = async () => {
    if (!newReminderText.trim()) return;
    const reminderData = { texto: newReminderText, hora: newReminderTime, actividad: stateKey };
    try {
      if (db) {
        const ref = await addDoc(collection(db, 'recordatorios'), { ...reminderData, createdAt: serverTimestamp() });
        setReminders(prev => [...prev, { id: ref.id, ...reminderData }]);
      }
      // Schedule notification
      const [rH, rM] = newReminderTime.split(':').map(Number);
      const now = new Date();
      let triggerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), rH, rM, 0);
      if (triggerDate <= now) triggerDate.setDate(triggerDate.getDate() + 1);
      const secs = Math.floor((triggerDate.getTime() - now.getTime()) / 1000);
      if (secs > 0) {
        Notifications.scheduleNotificationAsync({
          content: { title: '🔔 Recordatorio', body: newReminderText, sound: true },
          trigger: { seconds: secs },
        });
      }
    } catch(e) { console.log('Reminder error', e); }
    setNewReminderText('');
    setNewReminderTime('08:00');
    setIsAddingReminder(false);
  };

  const deleteReminder = async (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    try { if (db) await deleteDoc(doc(db, 'recordatorios', id)); } catch(e) {}
  };

  useEffect(() => {
    const loadMissions = async () => {
      if (!db) return;
      try {
        const querySnapshot = await getDocs(collection(db, 'misiones_personalizadas'));
        const loaded = {};
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const key = data.stateKey;
          if (!loaded[key]) loaded[key] = [];
          loaded[key].push({ ...data, id: docSnap.id });
        });
        setCustomMissions(loaded);
      } catch (e) {}
    };
    loadMissions();
  }, []);

  const handleAddMission = async () => {
    if (!newMissionName.trim() || !newMissionTime.trim()) return;
    
    if (editingMissionId) {
       try {
         // Optimistic
         setCustomMissions(prev => ({
           ...prev,
           [stateKey]: prev[stateKey].map(m => m.id === editingMissionId ? { ...m, title: newMissionName, sub: newMissionTime + (isNewMissionSeconds ? ' segs' : ' mins') } : m)
         }));
         if (db) {
           updateDoc(doc(db, 'misiones_personalizadas', editingMissionId), {
             title: newMissionName,
             sub: newMissionTime + (isNewMissionSeconds ? ' segs' : ' mins')
           }).catch(() => {});
         }
       } catch (e) {}
    } else {
      const newMission = {
        title: newMissionName,
        sub: newMissionTime + (isNewMissionSeconds ? ' segs' : ' mins'),
        color: ThemeColor,
        isCustom: true,
        stateKey: stateKey
      };

      try {
        if (db) {
          const docRef = await addDoc(collection(db, 'misiones_personalizadas'), newMission);
          newMission.id = docRef.id;
        }
      } catch (e) {
        newMission.id = Date.now().toString();
      }

      setCustomMissions(prev => ({
        ...prev,
        [stateKey]: [ ...(prev[stateKey] || []), newMission ]
      }));
    }
    
    setNewMissionName('');
    setNewMissionTime('');
    setEditingMissionId(null);
    setIsAddingMission(false);
  };

  const handleDeleteMission = async (id) => {
    setCustomMissions(prev => ({
      ...prev,
      [stateKey]: (prev[stateKey] || []).filter(m => m.id !== id)
    }));
    try {
      if (db) await deleteDoc(doc(db, 'misiones_personalizadas', id));
    } catch (e) {}
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Background Organic Blurs */}
      <View style={[styles.organicBlur, { top: -100, left: -100, backgroundColor: activeTab === 'Música' ? '#4C1D95' : '#064E3B', width: 300, height: 300 }]} />
      <View style={[styles.organicBlur, { top: '40%', right: -150, backgroundColor: activeTab === 'Zen' ? '#854D0E' : '#1E3A8A', width: 400, height: 400 }]} />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {/* TOP: Greeting Card */}
        <BlurView intensity={25} tint="dark" style={styles.greetingCard}>
          <View style={{ flex: 1 }}>
            <View style={styles.greetingRow}>
              <Text style={styles.greetingText}>{greeting}, Gabriel</Text>
              <TouchableOpacity onPress={() => setShowRoutine('morning')} style={{ marginLeft: 6, padding: 4 }}>
                <Sun color="#FDE047" size={18} strokeWidth={1.5} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowRoutine('night')} style={{ marginLeft: 4, padding: 4 }}>
                <Moon color="#A78BFA" size={16} strokeWidth={1.5} />
              </TouchableOpacity>
            </View>
            <Text style={styles.subGreetingText}>Tu energía actual está equilibrada.</Text>
          </View>
          <View style={{ marginLeft: 16 }}>
             <CircularProgress size={54} strokeWidth={4} progress={getTabProgress()} color={ThemeColor} />
          </View>
        </BlurView>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [15, 0] }) }] }}>
          
          {/* Smart Suggestion Banner */}
          {activeTab !== 'Zen' && (
            <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
              <TouchableScale>
                <LinearGradient colors={[`${smartSuggestion.color}15`, 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: `${smartSuggestion.color}30` }}>
                  <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: `${smartSuggestion.color}20`, alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                    <smartSuggestion.icon color={smartSuggestion.color} size={18} strokeWidth={2} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: smartSuggestion.color, fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 3 }}>SUGERENCIA INTELIGENTE</Text>
                    <Text style={{ color: '#CBD5E1', fontSize: 13, fontWeight: '500' }}>{smartSuggestion.text}</Text>
                  </View>
                </LinearGradient>
              </TouchableScale>
            </View>
          )}

          {/* INSTRUMENT SUB-NAVIGATION (ONLY FOR MUSIC TAB) */}
          {activeTab === 'Música' && (
            <View style={{ marginHorizontal: 20, marginBottom: 24, flexDirection: 'row', borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.04)', padding: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              {['Guitarra', 'Piano', 'Canto'].map(sub => {
                const isActive = musicSubTab === sub;
                return (
                  <TouchableScale key={sub} onPress={() => handleSubTabSwitch(sub, false)} style={{ flex: 1 }}>
                    <View style={{ paddingVertical: 10, borderRadius: 16, backgroundColor: isActive ? musicData[sub].themeColor : 'transparent', alignItems: 'center' }}>
                      <Text style={{ color: isActive ? '#020617' : '#94A3B8', fontWeight: isActive ? '800' : '500', fontSize: 13 }}>{sub}</Text>
                    </View>
                  </TouchableScale>
                );
              })}
            </View>
          )}

          {/* BODY SUB-NAVIGATION */}
          {activeTab === 'Cuerpo' && (
            <View style={{ marginHorizontal: 20, marginBottom: 24, flexDirection: 'row', borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.04)', padding: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              {['Entrenamiento', 'Fútbol'].map(sub => {
                const isActive = bodySubTab === sub;
                return (
                  <TouchableScale key={sub} onPress={() => handleSubTabSwitch(sub, true)} style={{ flex: 1 }}>
                    <View style={{ paddingVertical: 10, borderRadius: 16, backgroundColor: isActive ? bodyData[sub].themeColor : 'transparent', alignItems: 'center' }}>
                      <Text style={{ color: isActive ? '#020617' : '#94A3B8', fontWeight: isActive ? '800' : '500', fontSize: 13 }}>{sub}</Text>
                    </View>
                  </TouchableScale>
                );
              })}
            </View>
          )}

          {/* MODO ZEN (Desconexión Pura) */}
          {activeTab === 'Zen' ? (
            <View style={{ width: '100%', paddingBottom: 100 }}>
              
              <View style={{ alignItems: 'center', paddingHorizontal: 20, marginTop: 20, marginBottom: 40 }}>
                <BlurView intensity={isZenActive ? 40 : 20} tint="dark" style={[styles.offscreenWidget, isZenActive && { borderColor: '#FDE047', borderWidth: 2 }]}>
                  <Wind color="#FDE047" size={32} style={{ marginBottom: 12 }} />
                  <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '700', letterSpacing: 2 }}>
                    {isZenActive ? 'DESCONECTADO AHORA' : 'TIEMPO DESCONECTADO'}
                  </Text>
                  
                  <Text style={{ color: 'white', fontSize: 64, fontWeight: '200', fontVariant: ['tabular-nums'], marginVertical: 16 }}>
                    {formatTime(zenTime)}
                  </Text>

                  <TouchableOpacity 
                    onPress={() => {
                       Vibration.vibrate(isZenActive ? 50 : 100);
                       setIsZenActive(!isZenActive);
                    }} 
                    style={{ paddingHorizontal: 24, paddingVertical: 14, borderRadius: 24, backgroundColor: isZenActive ? 'rgba(239,68,68,0.2)' : 'rgba(253,224,71,0.2)' }}
                  >
                    <Text style={{ color: isZenActive ? '#EF4444' : '#FDE047', fontWeight: '800', fontSize: 14 }}>
                      {isZenActive ? 'Detener Sesión' : 'Iniciar Desconexión'}
                    </Text>
                  </TouchableOpacity>
                </BlurView>
              </View>

              {/* Zen Missions - Rituales */}
              <View style={{ marginBottom: 32 }}>
                <Text style={[styles.sectionTitle, { paddingHorizontal: 20 }]}>Rituales de Conexión</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselContainer}>
                  <AnimatedMissionCard mission={{ id: 'z1', title: 'Meditación', sub: '10 mins', icon: Sparkles, color: '#FDE047', isCustom: false }} onPress={() => startFocusMode('Meditación Guiada', '10 mins')} />
                  <AnimatedMissionCard mission={{ id: 'z2', title: 'Journaling', sub: '15 mins', icon: BookOpen, color: '#F472B6', isCustom: false }} onPress={() => startFocusMode('Journaling', '15 mins')} />
                  <AnimatedMissionCard mission={{ id: 'z3', title: 'Silencio Total', sub: '5 mins', icon: Moon, color: '#38BDF8', isCustom: false }} onPress={() => startFocusMode('Silencio Total', '5 mins')} />
                </ScrollView>
              </View>

              {/* Pasiones / Hobbies */}
              <View style={{ marginBottom: 32 }}>
                <Text style={[styles.sectionTitle, { paddingHorizontal: 20 }]}>Pasiones &amp; Hobbies</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselContainer}>
                  <AnimatedMissionCard mission={{ id: 'h1', title: 'Videojuegos', sub: '30 mins', icon: Gamepad2, color: '#A78BFA', isCustom: false }} onPress={() => startFocusMode('Videojuegos', '30 mins')} />
                  <AnimatedMissionCard mission={{ id: 'h2', title: 'Dibujar', sub: '20 mins', icon: Pencil, color: '#F472B6', isCustom: false }} onPress={() => startFocusMode('Sesion de Dibujo', '20 mins')} />
                  <AnimatedMissionCard mission={{ id: 'h3', title: 'Escuchar Álbum', sub: 'Completo', icon: Headphones, color: '#38BDF8', isCustom: false }} onPress={() => startFocusMode('Escuchar Álbum', '45 mins')} />
                </ScrollView>
              </View>

              {/* Modo Ojos Cerrados */}
              <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
                <TouchableScale onPress={() => setIsBlackout(true)}>
                  <BlurView intensity={25} tint="dark" style={{ borderRadius: 24, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', alignItems: 'center' }}>
                    <Moon color="#94A3B8" size={24} style={{ marginBottom: 12 }} />
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginBottom: 4 }}>Modo Ojos Cerrados</Text>
                    <Text style={{ color: '#64748B', fontSize: 13, textAlign: 'center' }}>Blackout total. Solo audio y paz.</Text>
                  </BlurView>
                </TouchableScale>
              </View>

              {/* Anclajes Rápidos */}
              <View style={{ marginBottom: 32 }}>
                <Text style={[styles.sectionTitle, { paddingHorizontal: 20 }]}>Anclajes Rápidos</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
                  {['Respira profundo 3x', 'Suelta la mandíbula', 'Siente tus pies', 'Agradece algo hoy', 'Sonríe ligeramente'].map((action, idx) => (
                    <AnimatedMicroAction key={idx} action={action} ThemeColor="#FDE047" />
                  ))}
                </ScrollView>
              </View>

              {/* Afirmación del Día */}
              <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
                <Text style={styles.sectionTitle}>Afirmación del Día</Text>
                <BlurView intensity={25} tint="dark" style={{ borderRadius: 24, padding: 24, borderWidth: 1, borderColor: 'rgba(253,224,71,0.15)', overflow: 'hidden' }}>
                  <Text style={{ color: '#FDE047', fontSize: 11, fontWeight: '700', letterSpacing: 2, marginBottom: 12 }}>REPITE EN VOZ ALTA</Text>
                  <Text style={{ color: 'white', fontSize: 20, fontWeight: '300', lineHeight: 32, fontStyle: 'italic' }}>
                    "{dailyAffirmation}"
                  </Text>
                </BlurView>
              </View>

              {/* Diario de Gratitud */}
              <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
                <Text style={styles.sectionTitle}>Diario de Gratitud</Text>
                <BlurView intensity={25} tint="dark" style={{ borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <View style={{ flexDirection: 'row', gap: 12, marginBottom: gratitudes.length > 0 ? 16 : 0 }}>
                    <TextInput 
                      style={{ flex: 1, color: 'white', fontSize: 15, fontWeight: '400', paddingVertical: 12, paddingHorizontal: 16, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16 }}
                      placeholder="Hoy agradezco..."
                      placeholderTextColor="rgba(255,255,255,0.25)"
                      value={gratitudeText}
                      onChangeText={setGratitudeText}
                    />
                    <TouchableScale onPress={() => {
                      if (gratitudeText.trim()) {
                        if (db) {
                          addDoc(collection(db, 'gratitudes'), {
                            texto: gratitudeText.trim(),
                            timestamp: serverTimestamp()
                          }).catch(() => {});
                        }
                        const dateStr = new Date().toLocaleDateString([], { month: 'short', day: 'numeric' });
                        setGratitudes(prev => [{ texto: gratitudeText.trim(), date: dateStr, timeMs: Date.now() }, ...prev]);
                        setGratitudeText('');
                      }
                    }}>
                      <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: '#FDE047', alignItems: 'center', justifyContent: 'center' }}>
                        <Plus color="#020617" size={20} strokeWidth={2.5} />
                      </View>
                    </TouchableScale>
                  </View>
                  {gratitudes.map((g, i) => (
                    <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderTopWidth: i > 0 ? 1 : 0, borderTopColor: 'rgba(255,255,255,0.04)' }}>
                      <Heart color="#F472B6" size={14} strokeWidth={2} />
                      <Text style={{ color: '#CBD5E1', fontSize: 14, fontWeight: '400', flex: 1 }}>{g.texto}</Text>
                      <Text style={{ color: '#64748B', fontSize: 11 }}>{g.date}</Text>
                    </View>
                  ))}
                </BlurView>
              </View>

            </View>
          ) : (
            <>
              {/* MODOS ACTIVOS (Dev, Música, Cuerpo) */}
              
              {/* Misiones (Deep Work) */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselContainer}>
                {/* BOTÓN AÑADIR MISIÓN (PRIMERO) */}
                <TouchableScale onPress={() => { setEditingMissionId(null); setIsAddingMission(true); }}>
                  <View style={[styles.glassCard, { justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'transparent' }]}>
                    <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: 12 }]}>
                      <Plus color="white" size={24} strokeWidth={1.5} />
                    </View>
                    <Text style={{ color: 'white', fontSize: 13, fontWeight: '600' }}>Nueva Tarea</Text>
                  </View>
                </TouchableScale>

                {allMissions.map((mission) => (
                  <AnimatedMissionCard 
                    key={mission.id} 
                    mission={mission}
                    completedMissions={completedToday}
                    onPress={() => startFocusMode(mission.title, mission.sub)}
                    onDelete={handleDeleteMission}
                    onEdit={(m) => {
                       setNewMissionName(m.title);
                       setNewMissionTime(m.sub.replace(/\D/g, ''));
                       setIsNewMissionSeconds(m.sub.includes('segs'));
                       setEditingMissionId(m.id);
                       setIsAddingMission(true);
                    }}
                  />
                ))}
              </ScrollView>

              {/* Quick Play (Música Integrada) */}
              <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
                <TouchableScale onPress={() => toggleQuickPlay(ENHYPEN_PLAYLIST[currentTrackIndex].url)}>
                  <BlurView intensity={25} tint="dark" style={styles.quickPlayCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                      <LinearGradient colors={[`${ThemeColor}40`, `${ThemeColor}15`]} style={[styles.musicIconBg, { backgroundColor: 'transparent' }]}>
                        <Headphones color={ThemeColor} size={18} strokeWidth={1.5} />
                      </LinearGradient>
                      <View>
                        <Text style={styles.musicTitle}>{ENHYPEN_PLAYLIST[currentTrackIndex].title}</Text>
                        <Text style={styles.musicSub}>{ENHYPEN_PLAYLIST[currentTrackIndex].artist} · Playlist</Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                      <TouchableOpacity onPress={(e) => { e.stopPropagation(); playNextTrack(); }} style={{ padding: 8 }}>
                        <SkipForward color="rgba(255,255,255,0.5)" size={20} />
                      </TouchableOpacity>
                      
                      <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: isQuickPlaying ? 'transparent' : ThemeColor, borderWidth: isQuickPlaying ? 2 : 0, borderColor: ThemeColor, alignItems: 'center', justifyContent: 'center' }}>
                        {isQuickPlaying ? <View style={{ width: 12, height: 12, backgroundColor: ThemeColor, borderRadius: 2 }} /> : <Play color="#020617" size={16} strokeWidth={2.5} />}
                      </View>
                    </View>
                  </BlurView>
                </TouchableScale>
              </View>

              {/* Bloque Unificado: Equilibrio y Racha */}
              <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
                <BlurView intensity={25} tint="dark" style={styles.unifiedBlock}>
                  <Text style={styles.blockTitle}>HOY: ESTADO ACTUAL</Text>
                  <View style={{ flexDirection: 'row', gap: 24 }}>
                    <View style={{ flex: 1 }}>
                      <HorizontalBar label="Mente" progress={dbStats.mente} color="#34D399" />
                      <HorizontalBar label="Pasión" progress={dbStats.pasion} color="#A78BFA" />
                      <HorizontalBar label="Cuerpo" progress={dbStats.cuerpo} color="#38BDF8" />
                    </View>
                    <LinearGradient colors={currentData.gradient} style={styles.rachaInnerWidget} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                      <Text style={styles.rachaTitle}>RACHA ZEN</Text>
                      <Text style={styles.rachaNumber}>{dbStats.racha}</Text>
                      <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '600' }}>DÍAS</Text>
                    </LinearGradient>
                  </View>
                </BlurView>
              </View>



              {/* Wellness Tip */}
              <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
                <BlurView intensity={20} tint="dark" style={{ borderRadius: 20, padding: 16, borderWidth: 1, borderColor: 'rgba(253,224,71,0.15)', overflow: 'hidden', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(253,224,71,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles color="#FDE047" size={16} />
                  </View>
                  <Text style={{ color: '#FDE047', fontSize: 13, fontWeight: '500', flex: 1 }}>{currentWellnessTip}</Text>
                </BlurView>
              </View>

              {/* Micro-acciones (Sensoriales y Tácticas) */}
              <View style={{ marginBottom: 32 }}>
                <Text style={[styles.sectionTitle, { paddingHorizontal: 20 }]}>Micro-acciones</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
                  {currentData.microActions.map((action, idx) => (
                    <AnimatedMicroAction key={idx} action={action} ThemeColor={ThemeColor} />
                  ))}
                </ScrollView>
              </View>

              {/* Recordatorios */}
              <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <Text style={styles.sectionTitle}>Recordatorios</Text>
                  <TouchableOpacity onPress={() => setIsAddingReminder(!isAddingReminder)}>
                    <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: `${ThemeColor}25`, alignItems: 'center', justifyContent: 'center' }}>
                      <Plus color={ThemeColor} size={16} strokeWidth={2.5} />
                    </View>
                  </TouchableOpacity>
                </View>
                
                {isAddingReminder && (
                  <BlurView intensity={25} tint="dark" style={{ borderRadius: 20, padding: 16, borderWidth: 1, borderColor: `${ThemeColor}30`, overflow: 'hidden', marginBottom: 16 }}>
                    <TextInput
                      style={{ color: 'white', fontSize: 15, paddingVertical: 10, paddingHorizontal: 14, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, marginBottom: 12 }}
                      placeholder="Ej: Practicar escalas de piano"
                      placeholderTextColor="rgba(255,255,255,0.2)"
                      value={newReminderText}
                      onChangeText={setNewReminderText}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <Text style={{ color: '#94A3B8', fontSize: 13, fontWeight: '600' }}>Hora:</Text>
                      <TextInput
                        style={{ color: 'white', fontSize: 16, fontWeight: '600', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, width: 80, textAlign: 'center' }}
                        placeholder="08:00"
                        placeholderTextColor="rgba(255,255,255,0.2)"
                        value={newReminderTime}
                        onChangeText={setNewReminderTime}
                      />
                      <View style={{ flex: 1 }} />
                      <TouchableOpacity onPress={addReminder} style={{ backgroundColor: ThemeColor, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 14 }}>
                        <Text style={{ color: '#020617', fontWeight: '700', fontSize: 13 }}>Guardar</Text>
                      </TouchableOpacity>
                    </View>
                  </BlurView>
                )}

                {filteredReminders.length === 0 && !isAddingReminder && (
                  <Text style={{ color: '#475569', fontSize: 13, fontStyle: 'italic' }}>Sin recordatorios para esta actividad</Text>
                )}
                {filteredReminders.map((r) => (
                  <View key={r.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)', gap: 12 }}>
                    <Clock color={ThemeColor} size={16} />
                    <Text style={{ color: 'white', fontSize: 14, flex: 1, fontWeight: '500' }}>{r.texto}</Text>
                    <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '600' }}>{r.hora}</Text>
                    <TouchableOpacity onPress={() => deleteReminder(r.id)} style={{ padding: 4 }}>
                      <Text style={{ color: '#EF4444', fontSize: 11, fontWeight: '700' }}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

            </>
          )}

        </Animated.View>
      </ScrollView>

      {/* ---------------------------------------------------- */}
      {/* EMERGENCY ANCHOR OVERLAY */}
      {panicState !== 'off' && (
        <Animated.View style={[styles.emergencyOverlay, { opacity: 1 }]}>
          <LinearGradient colors={['#080010', '#0A0015', '#020617']} style={StyleSheet.absoluteFillObject} />
          
          {/* Ambient particles */}
          <View style={{ position: 'absolute', top: '20%', left: '15%', width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(244,114,182,0.3)' }} />
          <View style={{ position: 'absolute', top: '30%', right: '20%', width: 3, height: 3, borderRadius: 1.5, backgroundColor: 'rgba(167,139,250,0.25)' }} />
          <View style={{ position: 'absolute', top: '65%', left: '25%', width: 5, height: 5, borderRadius: 2.5, backgroundColor: 'rgba(244,114,182,0.15)' }} />
          <View style={{ position: 'absolute', top: '70%', right: '15%', width: 3, height: 3, borderRadius: 1.5, backgroundColor: 'rgba(253,224,71,0.15)' }} />
          
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              
              {panicState === 'breathing' ? (
                <>
                  {/* Breathing orb system */}
                  <Animated.View style={{ position: 'absolute', width: 300, height: 300, borderRadius: 150, borderWidth: 0.5, borderColor: 'rgba(167,139,250,0.08)', transform: [{ scale: breathScaleAnim }] }} />
                  <Animated.View style={{ position: 'absolute', width: 220, height: 220, borderRadius: 110, borderWidth: 0.5, borderColor: 'rgba(244,114,182,0.1)', transform: [{ scale: breathScaleAnim }] }} />
                  <Animated.View style={{ position: 'absolute', width: 160, height: 160, borderRadius: 80, overflow: 'hidden', transform: [{ scale: breathScaleAnim }] }}>
                    <LinearGradient colors={['rgba(244,114,182,0.25)', 'rgba(167,139,250,0.2)', 'rgba(56,189,248,0.1)', 'transparent']} locations={[0, 0.3, 0.6, 1]} style={StyleSheet.absoluteFillObject} />
                  </Animated.View>
                  <Animated.View style={{ position: 'absolute', width: 80, height: 80, borderRadius: 40, overflow: 'hidden', transform: [{ scale: heartbeatAnim }] }}>
                    <LinearGradient colors={['rgba(244,114,182,0.6)', 'rgba(244,114,182,0.2)']} style={StyleSheet.absoluteFillObject} />
                  </Animated.View>
                  <Animated.View style={{ transform: [{ scale: heartbeatAnim }] }}>
                    <Infinity color="white" size={32} strokeWidth={1} />
                  </Animated.View>

                  {/* Content below the orb */}
                  <View style={{ position: 'absolute', bottom: '15%', alignItems: 'center', width: '100%', paddingHorizontal: 40 }}>
                    <Text style={{ color: 'rgba(244,114,182,0.9)', fontSize: 40, fontWeight: '100', letterSpacing: 12, marginBottom: 32 }}>{breathPhase}</Text>

                    {/* Breathing progress dots */}
                    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 40 }}>
                      {[0,1,2,3,4,5,6,7,8,9].map(i => {
                        const phases = ['Inhala...','Inhala...','Inhala...','Inhala...','Mantén','Mantén','Exhala...','Exhala...','Exhala...','Exhala...'];
                        const isActive = phases[i] === breathPhase;
                        return <View key={i} style={{ width: isActive ? 20 : 6, height: 6, borderRadius: 3, backgroundColor: isActive ? '#F472B6' : 'rgba(255,255,255,0.08)' }} />;
                      })}
                    </View>

                    <Text style={{ color: '#F472B6', fontSize: 13, textAlign: 'center', lineHeight: 22, fontWeight: '600', marginBottom: 6 }}>
                      Toma agua y siente la textura de tu mandarina.
                    </Text>
                    <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textAlign: 'center', lineHeight: 22 }}>
                      Estás a salvo. Siente cada respiración.
                    </Text>

                    <TouchableOpacity onPress={stopEmergencyAnchor} style={{ marginTop: 30, paddingHorizontal: 40, paddingVertical: 16, borderRadius: 99 }}>
                      <Text style={{ color: 'rgba(244,114,182,0.7)', fontSize: 15, fontWeight: '500', letterSpacing: 1 }}>Estoy mejor</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                /* Journaling Pos-Crisis */
                <View style={{ width: '100%', paddingHorizontal: 30, alignItems: 'center' }}>
                  <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(244,114,182,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 24, borderWidth: 1, borderColor: 'rgba(244,114,182,0.2)' }}>
                    <Feather color="#F472B6" size={28} strokeWidth={1.5} />
                  </View>
                  <Text style={{ color: 'white', fontSize: 24, fontWeight: '600', marginBottom: 12 }}>¿Cómo te sientes ahora?</Text>
                  <Text style={{ color: '#94A3B8', fontSize: 14, textAlign: 'center', marginBottom: 32, lineHeight: 22 }}>
                    Escribe lo que necesites sacar. Este espacio es completamente tuyo y seguro.
                  </Text>
                  
                  <BlurView intensity={20} tint="light" style={{ width: '100%', borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
                    <TextInput
                      style={{ color: 'white', fontSize: 16, minHeight: 120, padding: 20, textAlignVertical: 'top' }}
                      placeholder="Soltar..."
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      multiline
                      value={crisisJournal}
                      onChangeText={setCrisisJournal}
                      autoFocus
                    />
                  </BlurView>

                  <TouchableOpacity onPress={saveCrisisJournal} style={{ marginTop: 40, backgroundColor: 'rgba(244,114,182,0.2)', paddingHorizontal: 40, paddingVertical: 16, borderRadius: 24, borderWidth: 1, borderColor: '#F472B6' }}>
                    <Text style={{ color: '#F472B6', fontSize: 15, fontWeight: '700', letterSpacing: 0.5 }}>Guardar y Cerrar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      )}

      {/* ---------------------------------------------------- */}
      {/* ADD NEW MISSION OVERLAY (IOS PREMIUM BOTTOM SHEET) */}
      {/* ---------------------------------------------------- */}
      {isAddingMission && (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.emergencyOverlay}>
          <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFillObject} />
          <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={() => setIsAddingMission(false)} />
          
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <BlurView intensity={80} tint="dark" style={styles.bottomSheet}>
              {/* Drag Indicator */}
              <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)', alignSelf: 'center', marginBottom: 24 }} />
              
              <Text style={{ color: 'white', fontSize: 24, fontWeight: '800', marginBottom: 32 }}>Nueva Misión</Text>
              
              {/* iOS Style Grouped Inputs */}
              <View style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 20, overflow: 'hidden' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' }}>
                  <Text style={{ color: '#94A3B8', fontSize: 14, fontWeight: '600', width: 90 }}>Nombre</Text>
                  <TextInput 
                    style={{ flex: 1, color: 'white', fontSize: 16, fontWeight: '500' }}
                    placeholder="Ej. Revisar Base de Datos" 
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    value={newMissionName}
                    onChangeText={setNewMissionName}
                    autoFocus
                  />
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 18 }}>
                  <Text style={{ color: '#94A3B8', fontSize: 14, fontWeight: '600', width: 90 }}>Tiempo</Text>
                  <TextInput 
                    style={{ flex: 1, color: 'white', fontSize: 16, fontWeight: '500' }}
                    placeholder={isNewMissionSeconds ? "45" : "25"} 
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    keyboardType="numeric"
                    value={newMissionTime}
                    onChangeText={setNewMissionTime}
                  />
                  <TouchableOpacity onPress={() => setIsNewMissionSeconds(!isNewMissionSeconds)} style={{ paddingHorizontal: 12, paddingVertical: 8, backgroundColor: isNewMissionSeconds ? ThemeColor : 'rgba(255,255,255,0.1)', borderRadius: 12 }}>
                    <Text style={{ color: isNewMissionSeconds ? '#020617' : 'white', fontSize: 12, fontWeight: '700' }}>
                      {isNewMissionSeconds ? 'Segundos' : 'Minutos'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity onPress={handleAddMission} style={[styles.recordBtnActive, { backgroundColor: ThemeColor, width: '100%', height: 56, borderRadius: 20, marginTop: 32, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}>
                <Text style={{ color: '#020617', fontWeight: '800', fontSize: 16 }}>Añadir a la Agenda</Text>
              </TouchableOpacity>
            </BlurView>
          </View>
        </KeyboardAvoidingView>
      )}

      {/* DEEP FOCUS OVERLAY */}
      {focusTask && (
        <Animated.View style={[styles.focusOverlay, { opacity: focusAnim }]}>
          <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFillObject} />
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#64748B', fontSize: 14, fontWeight: '600', letterSpacing: 2, marginBottom: 16 }}>ENFOQUE PROFUNDO</Text>
            <Text style={{ color: 'white', fontSize: 24, fontWeight: '800', marginBottom: 40 }}>{focusTask}</Text>
            
            <TouchableScale onPress={() => setIsTimerRunning(!isTimerRunning)}>
              <View style={[styles.timerCircle, isTimerRunning && { borderColor: ThemeColor }]}>
                <Text style={styles.timerText}>{formatTime(focusTimeLeft)}</Text>
                <Text style={{ color: isTimerRunning ? ThemeColor : '#64748B', fontSize: 14, fontWeight: '700', marginTop: 12 }}>
                  {isTimerRunning ? 'PAUSAR' : 'INICIAR'}
                </Text>
              </View>
            </TouchableScale>
          </View>
        </Animated.View>
      )}

      {/* ---------------------------------------------------- */}
      {/* FLOATING TAB BAR WITH CENTRAL ANCHOR */}
      {/* ---------------------------------------------------- */}
      <View style={[styles.floatingTabBarWrap, { bottom: insets.bottom > 0 ? insets.bottom : 16 }]}>
        {/* Floating heart button ABOVE the bar */}
        <TouchableScale 
          onPress={triggerEmergencyAnchor} 
          onLongPress={() => setShowRuedaVida(true)}
          style={{ position: 'absolute', top: -28, zIndex: 10 }}
        >
          <LinearGradient colors={['#F472B6', '#C084FC']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.centerHeartGradient}>
            <Infinity color="white" size={26} strokeWidth={2.5} />
          </LinearGradient>
        </TouchableScale>

        <View style={styles.floatingTabBar}>
          <BlurView intensity={90} tint="dark" style={[StyleSheet.absoluteFillObject, { borderRadius: 28 }]} />

          {[  
            { key: 'Música', icon: Music, color: '#A78BFA' },
            { key: 'Cuerpo', icon: Dumbbell, color: '#38BDF8' },
            { key: 'Sentidos', icon: Hand, color: '#14B8A6' },
            { key: 'Zen', icon: Sparkles, color: '#FDE047' },
          ].map(({ key, icon: Icon, color }) => {
            const isActive = activeTab === key;
            return (
              <TouchableScale key={key} onPress={() => handleTabSwitch(key)} style={{ flex: 1 }}>
                <View style={[styles.navItem, isActive && styles.navItemActive]}>
                  {isActive && <LinearGradient colors={[`${color}25`, `${color}08`]} style={[StyleSheet.absoluteFillObject, { borderRadius: 20 }]} />}
                  <Icon color={isActive ? color : '#475569'} size={20} strokeWidth={isActive ? 2.2 : 1.3} />
                  {isActive && <Text style={[styles.navLabel, { color }]}>{key}</Text>}
                </View>
              </TouchableScale>
            );
          })}

        </View>
      </View>

      {/* RUEDA DE VIDA MODAL */}
      {showRuedaVida && (
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(2,6,23,0.97)', zIndex: 1500, justifyContent: 'center', alignItems: 'center' }]}>
          <TouchableOpacity onPress={() => setShowRuedaVida(false)} style={{ position: 'absolute', top: 60, right: 30, padding: 20, zIndex: 10 }}>
            <Text style={{ color: '#94A3B8', fontSize: 16, fontWeight: '600' }}>Cerrar</Text>
          </TouchableOpacity>
          
          <Text style={{ color: 'white', fontSize: 22, fontWeight: '700', marginBottom: 8 }}>Rueda de Vida</Text>
          <Text style={{ color: '#64748B', fontSize: 13, marginBottom: 40 }}>Equilibrio histórico global</Text>

          <View style={{ width: 260, height: 260, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={260} height={260}>
              {/* Background circles */}
              <Circle cx="130" cy="130" r="120" stroke="rgba(255,255,255,0.05)" strokeWidth="18" fill="none" />
              <Circle cx="130" cy="130" r="95" stroke="rgba(255,255,255,0.05)" strokeWidth="18" fill="none" />
              <Circle cx="130" cy="130" r="70" stroke="rgba(255,255,255,0.05)" strokeWidth="18" fill="none" />
              <Circle cx="130" cy="130" r="45" stroke="rgba(255,255,255,0.05)" strokeWidth="18" fill="none" />
              {/* Mente */}
              <Circle cx="130" cy="130" r="120" stroke="#34D399" strokeWidth="18" fill="none"
                strokeDasharray={`${2 * Math.PI * 120 * globalStats.mente / 100} ${2 * Math.PI * 120}`}
                strokeDashoffset={0} strokeLinecap="round" rotation="-90" origin="130, 130" opacity={0.85} />
              {/* Pasión */}
              <Circle cx="130" cy="130" r="95" stroke="#A78BFA" strokeWidth="18" fill="none"
                strokeDasharray={`${2 * Math.PI * 95 * globalStats.pasion / 100} ${2 * Math.PI * 95}`}
                strokeDashoffset={0} strokeLinecap="round" rotation="-90" origin="130, 130" opacity={0.85} />
              {/* Cuerpo */}
              <Circle cx="130" cy="130" r="70" stroke="#38BDF8" strokeWidth="18" fill="none"
                strokeDasharray={`${2 * Math.PI * 70 * globalStats.cuerpo / 100} ${2 * Math.PI * 70}`}
                strokeDashoffset={0} strokeLinecap="round" rotation="-90" origin="130, 130" opacity={0.85} />
              {/* Energía */}
              <Circle cx="130" cy="130" r="45" stroke="#FDE047" strokeWidth="18" fill="none"
                strokeDasharray={`${2 * Math.PI * 45 * globalStats.energia / 100} ${2 * Math.PI * 45}`}
                strokeDashoffset={0} strokeLinecap="round" rotation="-90" origin="130, 130" opacity={0.85} />
            </Svg>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 20, marginTop: 40, paddingHorizontal: 30 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#34D399' }} />
              <Text style={{ color: '#CBD5E1', fontSize: 13 }}>Mente {globalStats.mente}%</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#A78BFA' }} />
              <Text style={{ color: '#CBD5E1', fontSize: 13 }}>Pasión {globalStats.pasion}%</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#38BDF8' }} />
              <Text style={{ color: '#CBD5E1', fontSize: 13 }}>Cuerpo {globalStats.cuerpo}%</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#FDE047' }} />
              <Text style={{ color: '#CBD5E1', fontSize: 13 }}>Energía {globalStats.energia}%</Text>
            </View>
          </View>

          <Text style={{ color: '#475569', fontSize: 11, marginTop: 30, fontWeight: '600', letterSpacing: 1 }}>RACHA ACTUAL: {dbStats.racha} DÍAS</Text>
        </View>
      )}

      {/* MORNING/NIGHT ROUTINE MODAL */}
      {showRoutine && (
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(2,6,23,0.97)', zIndex: 1600, justifyContent: 'center', alignItems: 'center' }]}>
          <TouchableOpacity onPress={() => { setShowRoutine(null); setRoutineChecks({}); }} style={{ position: 'absolute', top: 60, right: 30, padding: 20, zIndex: 10 }}>
            <Text style={{ color: '#94A3B8', fontSize: 16, fontWeight: '600' }}>Cerrar</Text>
          </TouchableOpacity>
          
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: showRoutine === 'morning' ? 'rgba(253,224,71,0.15)' : 'rgba(167,139,250,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            {showRoutine === 'morning' ? <Sun color="#FDE047" size={28} /> : <Moon color="#A78BFA" size={28} />}
          </View>
          <Text style={{ color: 'white', fontSize: 24, fontWeight: '700', marginBottom: 6 }}>
            {showRoutine === 'morning' ? 'Rutina Mañanera ☀️' : 'Rutina Nocturna 🌙'}
          </Text>
          <Text style={{ color: '#64748B', fontSize: 13, marginBottom: 40 }}>
            Marca cada paso al completarlo
          </Text>

          <View style={{ width: '80%' }}>
            {(showRoutine === 'morning' ? morningRoutine : nightRoutine).map((item, idx) => {
              const checked = routineChecks[`${showRoutine}_${idx}`];
              return (
                <TouchableOpacity key={idx} onPress={() => {
                  Vibration.vibrate(20);
                  setRoutineChecks(prev => ({ ...prev, [`${showRoutine}_${idx}`]: !prev[`${showRoutine}_${idx}`] }));
                }} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)', gap: 16 }}>
                  <View style={{ width: 28, height: 28, borderRadius: 8, borderWidth: 2, borderColor: checked ? '#34D399' : 'rgba(255,255,255,0.15)', backgroundColor: checked ? 'rgba(52,211,153,0.2)' : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                    {checked && <CheckCircle2 color="#34D399" size={16} />}
                  </View>
                  <Text style={{ color: checked ? '#34D399' : 'white', fontSize: 16, fontWeight: '500', textDecorationLine: checked ? 'line-through' : 'none', opacity: checked ? 0.6 : 1 }}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ marginTop: 40, alignItems: 'center' }}>
            <Text style={{ color: '#475569', fontSize: 12, fontWeight: '600' }}>
              {Object.values(routineChecks).filter(Boolean).length} / {(showRoutine === 'morning' ? morningRoutine : nightRoutine).length} completadas
            </Text>
          </View>
        </View>
      )}

      {/* BLACKOUT MODE */}
      {isBlackout && (
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'black', zIndex: 2000, justifyContent: 'center', alignItems: 'center' }]}>
          <TouchableOpacity onPress={() => setIsBlackout(false)} style={{ position: 'absolute', top: 60, right: 30, padding: 20 }}>
            <Text style={{ color: '#444', fontSize: 16 }}>Salir</Text>
          </TouchableOpacity>
          <Text style={{ color: '#222', fontSize: 48, fontWeight: '100', marginBottom: 60, fontVariant: ['tabular-nums'] }}>{formatTime(zenTime)}</Text>
          <View style={{ flexDirection: 'row', gap: 40, alignItems: 'center' }}>
            <Play color="#111" size={40} />
          </View>
        </View>
      )}

      {/* SPLASH SCREEN */}
      {!isAppReady && (
        <Animated.View pointerEvents={isAppReady ? 'none' : 'auto'} style={[StyleSheet.absoluteFillObject, { backgroundColor: '#020617', zIndex: 3000, justifyContent: 'center', alignItems: 'center', opacity: splashAnim.interpolate({ inputRange: [0, 0.8, 1], outputRange: [1, 1, 0] }) }]}>
          <Animated.View style={{
            transform: [
              { translateY: splashAnim.interpolate({ inputRange: [0, 1], outputRange: [0, height / 2 - 60] }) },
              { scale: splashAnim.interpolate({ inputRange: [0, 1], outputRange: [3, 1] }) }
            ]
          }}>
            <LinearGradient colors={['#F472B6', '#C084FC']} start={{x:0,y:0}} end={{x:1,y:1}} style={[styles.centerHeartGradient, { width: 80, height: 80, borderRadius: 40, borderWidth: 0 }]}>
              <Infinity color="white" size={40} strokeWidth={2} />
            </LinearGradient>
          </Animated.View>
        </Animated.View>
      )}
      
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <MainApp />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  organicBlur: { position: 'absolute', borderRadius: 999, opacity: 0.25, transform: [{ scale: 1.5 }] },
  
  greetingCard: { marginHorizontal: 20, marginBottom: 24, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', flexDirection: 'row', alignItems: 'center' },
  greetingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  greetingText: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.5 },
  subGreetingText: { fontSize: 13, color: '#94A3B8', fontWeight: '400' },
  
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 16, letterSpacing: 0.5 },
  
  carouselContainer: { paddingHorizontal: 20, gap: 12, marginBottom: 24 },
  glassCard: {
    width: 130, height: 110, backgroundColor: 'rgba(255, 255, 255, 0.03)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 20, padding: 14, overflow: 'hidden'
  },
  iconCircle: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  glassCardTitle: { fontSize: 13, fontWeight: '600', color: '#FFFFFF', marginBottom: 2, lineHeight: 18 },
  glassCardSub: { fontSize: 11, color: '#64748B', fontWeight: '500' },

  quickPlayCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  musicIconBg: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  musicTitle: { color: 'white', fontSize: 13, fontWeight: '600' },
  musicSub: { color: '#64748B', fontSize: 11, fontWeight: '500' },

  unifiedBlock: { borderRadius: 24, padding: 20, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  blockTitle: { color: 'white', fontSize: 12, fontWeight: '800', letterSpacing: 1, marginBottom: 16 },
  
  rachaInnerWidget: { width: 80, borderRadius: 16, alignItems: 'center', justifyContent: 'center', padding: 12 },
  rachaTitle: { color: 'rgba(255,255,255,0.8)', fontSize: 9, fontWeight: '800', letterSpacing: 0.5, marginBottom: 4 },
  rachaNumber: { fontSize: 28, fontWeight: '900', color: 'white', marginBottom: 2 },

  microCard: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1 },
  microCardText: { color: '#E2E8F0', fontSize: 12, fontWeight: '500' },

  agendaSection: { paddingHorizontal: 20 },
  agendaCard: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  agendaContent: { flex: 1 },
  agendaTaskTitle: { fontSize: 14, fontWeight: '600', color: '#FFFFFF', marginBottom: 2 },
  agendaTimeText: { fontSize: 12, color: '#64748B', fontWeight: '500' },

  offscreenWidget: { width: '100%', paddingVertical: 40, alignItems: 'center', borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },

  floatingTabBarWrap: { position: 'absolute', left: 20, right: 20, alignItems: 'center', zIndex: 100 },
  floatingTabBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 28, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', paddingHorizontal: 6, paddingVertical: 8, width: '100%' },
  navItem: { alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6, paddingVertical: 10, borderRadius: 20, overflow: 'hidden' },
  navItemActive: {},
  navLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  
  centerHeartGradient: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#020617', shadowColor: '#F472B6', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.6, shadowRadius: 16, elevation: 10 },

  emergencyOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 200, elevation: 10 },
  heartPulseCircle: { width: 200, height: 200, borderRadius: 100, position: 'absolute', zIndex: -1, overflow: 'hidden' },

  focusOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 200, elevation: 10 },
  timerCircle: { width: 240, height: 240, borderRadius: 120, borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 60 },
  timerText: { color: 'white', fontSize: 64, fontWeight: '300', fontVariant: ['tabular-nums'] },
  endFocusBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20, borderWidth: 1, backgroundColor: 'rgba(0,0,0,0.3)' },

  bottomSheet: {
    padding: 32, paddingBottom: 60,
    borderTopLeftRadius: 40, borderTopRightRadius: 40,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderBottomWidth: 0
  }
});
