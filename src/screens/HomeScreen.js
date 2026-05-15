import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMode } from '../context/ModeContext';
import { Compass, Code, Mic, Dumbbell, Gamepad2, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn, Layout } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const modeIcons = {
  technical: Code,
  expressive: Mic,
  physical: Dumbbell,
  pause: Gamepad2,
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { mode, setMode, modesConfig, currentConfig } = useMode();
  const [rouletteSuggestion, setRouletteSuggestion] = useState(null);

  const spinRoulette = () => {
    const suggestions = {
      technical: ['Crea un botón bonito', 'Refactoriza esa función fea', 'Lee un artículo sobre UX'],
      expressive: ['Graba un tarareo improvisado', 'Dibuja lo que tienes a tu izquierda', 'Escribe 3 líneas sin pensar'],
      physical: ['Haz 15 sentadillas ahora', 'Estiramiento de cuello 2 mins', 'Toma un vaso de agua grande'],
      pause: ['Cierra los ojos 3 minutos', 'Pon tu canción favorita a tope', 'Acaricia a tu mascota o respira']
    };
    const list = suggestions[mode];
    const random = list[Math.floor(Math.random() * list.length)];
    setRouletteSuggestion(random);
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      
      {/* Header Profile Area */}
      <Animated.View entering={FadeIn.duration(600)} className="px-6 pt-4 mb-6">
        <Text className="text-textMuted text-sm font-bold tracking-widest uppercase mb-1">Ecosistema Gabriel</Text>
        <Text className="text-textMain font-black text-3xl tracking-tight">¿Hacia dónde vamos?</Text>
      </Animated.View>

      {/* Dynamic Context Selector */}
      <View className="px-6 mb-8 flex-row justify-between">
        {Object.keys(modesConfig).map((key, index) => {
          const isActive = mode === key;
          const Config = modesConfig[key];
          const Icon = modeIcons[key];
          return (
            <Animated.View key={key} entering={FadeInDown.delay(index * 100).duration(400)}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => { setMode(key); setRouletteSuggestion(null); }}
                className={`items-center justify-center p-3 rounded-[32px] ${isActive ? 'bg-white shadow-lg' : ''}`}
                style={{ width: (width - 48) / 4.3, elevation: isActive ? 10 : 0, shadowColor: Config.color, shadowOpacity: isActive ? 0.3 : 0, shadowRadius: 15 }}
              >
                {isActive ? (
                  <LinearGradient
                    colors={Config.colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="w-14 h-14 rounded-full items-center justify-center mb-3"
                  >
                    <Icon color="#FFFFFF" size={24} />
                  </LinearGradient>
                ) : (
                  <View className="w-14 h-14 rounded-full bg-surfaceLight items-center justify-center mb-3 border border-surfaceLight">
                    <Icon color="#A0AEC0" size={24} />
                  </View>
                )}
                <Text className={`text-xs font-bold ${isActive ? 'text-textMain' : 'text-textMuted'}`}>
                  {Config.title}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        
        {/* Roulette of Decision */}
        <Animated.View layout={Layout.springify()} entering={FadeInDown.delay(300).duration(500)}>
          <LinearGradient
            colors={currentConfig.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-[40px] p-7 mb-8 shadow-2xl"
            style={{ shadowColor: currentConfig.color, shadowOpacity: 0.4, shadowRadius: 20, shadowOffset: { width: 0, height: 10 } }}
          >
            <View className="flex-row items-center mb-5">
              <View className="bg-white/30 p-2 rounded-2xl mr-3">
                <Compass color="#FFFFFF" size={28} />
              </View>
              <Text className="text-white font-black text-2xl">¿Qué fluye hoy?</Text>
            </View>
            
            <View className="bg-white/20 rounded-[28px] p-5 mb-6 min-h-[90px] justify-center border border-white/30">
              {rouletteSuggestion ? (
                <Text className="text-white font-bold text-lg text-center leading-tight">
                  {rouletteSuggestion}
                </Text>
              ) : (
                <Text className="text-white/90 text-base text-center leading-snug font-medium">
                  Si hay parálisis por análisis, deja que el sistema decida por ti.
                </Text>
              )}
            </View>

            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={spinRoulette}
              className="bg-white rounded-full py-4 items-center justify-center flex-row shadow-lg"
            >
              <Text className="font-black text-base mr-2" style={{ color: currentConfig.color }}>
                {rouletteSuggestion ? 'Girar de nuevo' : 'Girar la brújula'}
              </Text>
              <ArrowRight color={currentConfig.color} size={20} strokeWidth={3} />
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        <View className="h-36" />
      </ScrollView>
    </View>
  );
}
