import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, StyleSheet, Animated, Easing, Vibration, TextInput, KeyboardAvoidingView, Platform, Linking } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Sun, Moon, Code, Music, Activity, Sparkles, CheckCircle2, Dumbbell, Mic, BookOpen, Waves, Wind, Play, CircleDot, HeartPulse, Heart, Headphones, Plus, Gamepad2, Pencil, Zap, Clock, Brain } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// --------------------------------------------------------
// PREMIUM ANIMATED COMPONENTS
// --------------------------------------------------------

const AnimatedMissionCard = ({ mission, onPress, onDelete }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const deleteProgress = useRef(new Animated.Value(0)).current;
  const IconComp = mission.icon;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.95, speed: 20, useNativeDriver: true }).start();
    if (mission.isCustom) {
      Animated.timing(deleteProgress, {
        toValue: 1,
        duration: 800, // 800ms hold to delete
        useNativeDriver: false
      }).start();
    }
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, speed: 20, useNativeDriver: true }).start();
    if (mission.isCustom) {
      deleteProgress.stopAnimation((value) => {
        if (value >= 1) {
          Vibration.vibrate(50);
          onDelete(mission.id);
        } else {
          Animated.timing(deleteProgress, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false
          }).start();
        }
      });
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      delayLongPress={800}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLongPress={() => {}} // dummy to prevent normal onPress when holding
      onPress={() => {
        Vibration.vibrate(10);
        onPress();
      }}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <BlurView intensity={35} tint="dark" style={[styles.glassCard, { overflow: 'hidden' }]}>
          
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
            <View style={[styles.iconCircle, { backgroundColor: `${mission.color}22` }]}>
              <IconComp color={mission.color} size={18} strokeWidth={1.5} />
            </View>
            <Play color="rgba(255,255,255,0.3)" size={14} />
          </View>
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <Text style={styles.glassCardTitle} numberOfLines={1}>{mission.title}</Text>
            <Text style={styles.glassCardSub}>{mission.sub}</Text>
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
  Dev: {
    themeColor: '#34D399',
    gradient: ['rgba(4, 120, 87, 0.4)', 'rgba(52, 211, 153, 0.2)'],
    missions: [
      { id: 'd1', title: 'Revisa Java', sub: '15 mins', icon: Code, color: '#34D399' },
      { id: 'd2', title: 'Docs React', sub: 'Leer', icon: BookOpen, color: '#38BDF8' }
    ],
    quickPlay: { title: 'Blinding Lights', artist: 'The Weeknd', color: '#34D399', url: 'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b' },
    microActions: ['Bebe agua', 'Estira muñecas', 'Siente el aire', 'Mira lejos 20s'],
    agenda: [
      { id: 'a1', title: 'Refactorización Java', time: '18:00 - 19:30' },
      { id: 'a2', title: 'Revisión de PRs', time: '19:30 - 20:00' }
    ]
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
    agenda: [
      { id: 'a6', title: 'Rutina HIIT Pecho', time: '17:00 - 17:45' },
      { id: 'a7', title: 'Ducha Fría', time: '17:45 - 18:00' }
    ]
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
    agenda: [
      { id: 'f_a1', title: 'Calentamiento Dinámico', time: '18:00 - 18:15' },
      { id: 'f_a2', title: 'Partido / Práctica', time: '18:15 - 19:30' }
    ]
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
    quickPlay: { title: 'Moonstruck', artist: 'ENHYPEN', color: '#A78BFA', url: 'https://open.spotify.com/track/5sdQOyqq2IDhvmx2lHOpwd' },
    microActions: ['Afina la guitarra', 'Limpia las cuerdas', 'Siente los trastes', 'Estira los dedos'],
    agenda: [
      { id: 'g_a1', title: 'Práctica de Escalas', time: '20:00 - 20:30' },
      { id: 'g_a2', title: 'Estudiar Teoría', time: '20:30 - 21:00' }
    ]
  },
  Piano: {
    themeColor: '#F472B6',
    gradient: ['rgba(244, 114, 182, 0.4)', 'rgba(251, 113, 133, 0.2)'],
    icon: Music,
    missions: [
      { id: 'p1', title: 'Ejercicios Hanon', sub: '20 mins', icon: Music, color: '#F472B6' },
      { id: 'p2', title: 'Repertorio', sub: 'Aprender', icon: BookOpen, color: '#A78BFA' }
    ],
    quickPlay: { title: 'Clair de Lune', artist: 'Debussy', color: '#F472B6', url: 'https://open.spotify.com/track/1DFixLWqPDqsBYTnUrPnVi' },
    microActions: ['Calienta las manos', 'Siente las teclas', 'Corrige postura', 'Respira'],
    agenda: [
      { id: 'p_a1', title: 'Lectura a primera vista', time: '19:00 - 19:30' },
      { id: 'p_a2', title: 'Práctica de Repertorio', time: '19:30 - 20:30' }
    ]
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
    agenda: [
      { id: 'c_a1', title: 'Ejercicios de Respiración', time: '18:00 - 18:20' },
      { id: 'c_a2', title: 'Afinación y Escalas', time: '18:20 - 19:00' }
    ]
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
  const [newMissionName, setNewMissionName] = useState('');
  const [newMissionTime, setNewMissionTime] = useState('');

  // States
  const [focusTask, setFocusTask] = useState(null); 
  const [focusTimeLeft, setFocusTimeLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Inhala...');
  const breathScaleAnim = useRef(new Animated.Value(1)).current;
  const breathInterval = useRef(null);
  
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

  useEffect(() => {
    let interval;
    if (isTimerRunning && focusTimeLeft > 0) {
      interval = setInterval(() => {
        setFocusTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (focusTimeLeft === 0 && isTimerRunning) {
      Vibration.vibrate([500, 500, 500, 500, 500]);
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, focusTimeLeft]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const startFocusMode = (taskTitle, taskTimeText) => {
    const minsMatch = taskTimeText.match(/\d+/);
    const initialMins = minsMatch ? parseInt(minsMatch[0]) : 25;
    
    setFocusTimeLeft(initialMins * 60);
    setIsTimerRunning(false);
    setFocusTask(taskTitle);
    Animated.timing(focusAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  };

  const endFocusMode = () => {
    setIsTimerRunning(false);
    Animated.timing(focusAnim, { toValue: 0, duration: 400, useNativeDriver: true }).start(() => {
      setFocusTask(null);
    });
  };

  const triggerEmergencyAnchor = () => {
    setIsEmergency(true);
    setBreathPhase('Inhala...');

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

  const stopEmergencyAnchor = () => {
    setIsEmergency(false);
    heartbeatAnim.stopAnimation();
    breathScaleAnim.stopAnimation();
    if (emergencyInterval.current) clearInterval(emergencyInterval.current);
    if (breathInterval.current) clearInterval(breathInterval.current);
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

  const currentData = activeTab === 'Música' 
    ? musicData[musicSubTab] 
    : activeTab === 'Cuerpo' 
      ? bodyData[bodySubTab] 
      : (modeData[activeTab] || modeData['Dev']);
      
  const ThemeColor = activeTab === 'Zen' ? '#FDE047' : currentData.themeColor;
  
  // Determine correct state array key
  const stateKey = activeTab === 'Música' ? `Música_${musicSubTab}` : activeTab === 'Cuerpo' ? `Cuerpo_${bodySubTab}` : activeTab;
  // Ensure array exists
  const safeCustomMissions = customMissions[stateKey] || [];
  const allMissions = activeTab !== 'Zen' ? [...currentData.missions, ...safeCustomMissions] : [];

  const handleAddMission = () => {
    if (!newMissionName.trim() || !newMissionTime.trim()) return;
    setCustomMissions(prev => ({
      ...prev,
      [stateKey]: [
        ...(prev[stateKey] || []), 
        { id: Date.now().toString(), title: newMissionName, sub: newMissionTime + ' mins', icon: currentData.icon || Sparkles, color: ThemeColor, isCustom: true }
      ]
    }));
    setNewMissionName('');
    setNewMissionTime('');
    setIsAddingMission(false);
  };

  const handleDeleteMission = (id) => {
    setCustomMissions(prev => ({
      ...prev,
      [stateKey]: (prev[stateKey] || []).filter(m => m.id !== id)
    }));
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
              <TimeIcon color="#FDE047" size={18} strokeWidth={1.5} style={{ marginLeft: 6 }} />
            </View>
            <Text style={styles.subGreetingText}>Tu energía actual está equilibrada.</Text>
          </View>
          <View style={{ marginLeft: 16 }}>
             <CircularProgress size={54} strokeWidth={4} progress={33} color={ThemeColor} />
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
                    "Merezco este descanso. Mi valor no depende de mi productividad."
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
                        setGratitudes(prev => [...prev, gratitudeText.trim()]);
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
                      <Text style={{ color: '#CBD5E1', fontSize: 14, fontWeight: '400', flex: 1 }}>{g}</Text>
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
                <TouchableScale onPress={() => setIsAddingMission(true)}>
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
                    onPress={() => startFocusMode(mission.title, mission.sub)}
                    onDelete={handleDeleteMission}
                  />
                ))}
              </ScrollView>

              {/* Quick Play (Música Integrada) */}
              <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
                <TouchableScale onPress={() => { if (currentData.quickPlay.url) Linking.openURL(currentData.quickPlay.url); }}>
                  <BlurView intensity={25} tint="dark" style={styles.quickPlayCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                      <LinearGradient colors={[`${ThemeColor}40`, `${ThemeColor}15`]} style={[styles.musicIconBg, { backgroundColor: 'transparent' }]}>
                        <Headphones color={ThemeColor} size={18} strokeWidth={1.5} />
                      </LinearGradient>
                      <View>
                        <Text style={styles.musicTitle}>{currentData.quickPlay.title}</Text>
                        <Text style={styles.musicSub}>{currentData.quickPlay.artist} · Spotify</Text>
                      </View>
                    </View>
                    <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: ThemeColor, alignItems: 'center', justifyContent: 'center' }}>
                      <Play color="#020617" size={16} strokeWidth={2.5} />
                    </View>
                  </BlurView>
                </TouchableScale>
              </View>

              {/* Bloque Unificado: Equilibrio y Racha */}
              <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
                <BlurView intensity={25} tint="dark" style={styles.unifiedBlock}>
                  <Text style={styles.blockTitle}>ESTADO ACTUAL</Text>
                  <View style={{ flexDirection: 'row', gap: 24 }}>
                    <View style={{ flex: 1 }}>
                      <HorizontalBar label="Mente" progress={80} color="#34D399" />
                      <HorizontalBar label="Pasión" progress={65} color="#A78BFA" />
                      <HorizontalBar label="Cuerpo" progress={40} color="#38BDF8" />
                    </View>
                    <LinearGradient colors={currentData.gradient} style={styles.rachaInnerWidget} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                      <Text style={styles.rachaTitle}>RACHA ZEN</Text>
                      <Text style={styles.rachaNumber}>5</Text>
                      <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '600' }}>DÍAS</Text>
                    </LinearGradient>
                  </View>
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

              {/* Agenda (Timeline Visual) */}
              <View style={styles.agendaSection}>
                <Text style={styles.sectionTitle}>Flujo de Trabajo</Text>
                <View style={{ marginTop: 8 }}>
                  {currentData.agenda.map((task, index) => (
                    <AnimatedTaskCard 
                      key={task.id} 
                      task={task} 
                      color={ThemeColor} 
                      isLast={index === currentData.agenda.length - 1} 
                    />
                  ))}
                </View>
              </View>
            </>
          )}

        </Animated.View>
      </ScrollView>

      {/* ---------------------------------------------------- */}
      {/* EMERGENCY ANCHOR OVERLAY */}
      {isEmergency && (
        <Animated.View style={[styles.emergencyOverlay, { opacity: 1 }]}>
          <LinearGradient colors={['#080010', '#0A0015', '#020617']} style={StyleSheet.absoluteFillObject} />
          
          {/* Ambient particles */}
          <View style={{ position: 'absolute', top: '20%', left: '15%', width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(244,114,182,0.3)' }} />
          <View style={{ position: 'absolute', top: '30%', right: '20%', width: 3, height: 3, borderRadius: 1.5, backgroundColor: 'rgba(167,139,250,0.25)' }} />
          <View style={{ position: 'absolute', top: '65%', left: '25%', width: 5, height: 5, borderRadius: 2.5, backgroundColor: 'rgba(244,114,182,0.15)' }} />
          <View style={{ position: 'absolute', top: '70%', right: '15%', width: 3, height: 3, borderRadius: 1.5, backgroundColor: 'rgba(253,224,71,0.15)' }} />
          
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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
              <Heart color="white" size={32} strokeWidth={1} />
            </Animated.View>

            {/* Content below the orb */}
            <View style={{ position: 'absolute', bottom: '18%', alignItems: 'center', width: '100%', paddingHorizontal: 40 }}>
              <Text style={{ color: 'rgba(244,114,182,0.9)', fontSize: 40, fontWeight: '100', letterSpacing: 12, marginBottom: 32 }}>{breathPhase}</Text>

              {/* Breathing progress dots */}
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 40 }}>
                {[0,1,2,3,4,5,6,7,8,9].map(i => {
                  const phases = ['Inhala...','Inhala...','Inhala...','Inhala...','Mantén','Mantén','Exhala...','Exhala...','Exhala...','Exhala...'];
                  const isActive = phases[i] === breathPhase;
                  return <View key={i} style={{ width: isActive ? 20 : 6, height: 6, borderRadius: 3, backgroundColor: isActive ? '#F472B6' : 'rgba(255,255,255,0.08)' }} />;
                })}
              </View>

              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textAlign: 'center', lineHeight: 22 }}>
                Estás a salvo. Siente cada respiración.
              </Text>

              <TouchableOpacity onPress={stopEmergencyAnchor} style={{ marginTop: 40, paddingHorizontal: 40, paddingVertical: 16, borderRadius: 99 }}>
                <Text style={{ color: 'rgba(244,114,182,0.7)', fontSize: 15, fontWeight: '500', letterSpacing: 1 }}>Estoy mejor</Text>
              </TouchableOpacity>
            </View>
          </View>
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
                  <Text style={{ color: '#94A3B8', fontSize: 14, fontWeight: '600', width: 90 }}>Minutos</Text>
                  <TextInput 
                    style={{ flex: 1, color: 'white', fontSize: 16, fontWeight: '500' }}
                    placeholder="25" 
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    keyboardType="numeric"
                    value={newMissionTime}
                    onChangeText={setNewMissionTime}
                  />
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

            <TouchableOpacity onPress={endFocusMode} style={[styles.endFocusBtn, { borderColor: ThemeColor }]}>
              <Text style={{ color: ThemeColor, fontWeight: '700', fontSize: 14 }}>Terminar Sesión</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* ---------------------------------------------------- */}
      {/* FLOATING TAB BAR WITH CENTRAL ANCHOR */}
      {/* ---------------------------------------------------- */}
      <View style={[styles.floatingTabBarWrap, { bottom: insets.bottom > 0 ? insets.bottom : 16 }]}>
        {/* Floating heart button ABOVE the bar */}
        <TouchableScale onPress={triggerEmergencyAnchor} style={{ position: 'absolute', top: -28, zIndex: 10 }}>
          <LinearGradient colors={['#F472B6', '#C084FC']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.centerHeartGradient}>
            <HeartPulse color="white" size={22} strokeWidth={2} />
          </LinearGradient>
        </TouchableScale>

        <View style={styles.floatingTabBar}>
          <BlurView intensity={90} tint="dark" style={[StyleSheet.absoluteFillObject, { borderRadius: 28 }]} />

          {[  
            { key: 'Música', icon: Music, color: '#A78BFA' },
            { key: 'Cuerpo', icon: Dumbbell, color: '#38BDF8' },
            { key: 'Dev', icon: Code, color: '#34D399' },
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
