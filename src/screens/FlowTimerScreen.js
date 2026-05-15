import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Play, Pause, RefreshCw } from 'lucide-react-native';
import { useMode } from '../context/ModeContext';

export default function FlowTimerScreen() {
  const insets = useSafeAreaInsets();
  const { currentConfig } = useMode();
  const [isRunning, setIsRunning] = useState(false);

  return (
    <View className="flex-1 bg-background justify-center items-center px-6" style={{ paddingTop: insets.top }}>
      <View className="items-center mb-16">
        <Text className="text-textMuted text-sm font-bold tracking-widest uppercase mb-4">Flujo Suave</Text>
        <Text className="text-textMain font-medium text-center text-base opacity-70 px-8 leading-relaxed">
          Sin alarmas estresantes. Cuando termines, te lo haremos saber gentilmente.
        </Text>
      </View>
      <View 
        className="w-72 h-72 rounded-full items-center justify-center mb-16 shadow-sm"
        style={{ borderWidth: 8, borderColor: currentConfig.color, backgroundColor: '#FFFFFF' }}
      >
        <Text className="text-textMain font-bold text-7xl tracking-tighter" style={{ color: currentConfig.color }}>
          25:00
        </Text>
      </View>
      <View className="flex-row items-center justify-center w-full px-10">
        <TouchableOpacity className="p-5 bg-surfaceLight rounded-full mx-4 border border-surfaceLight">
          <RefreshCw color="#9BA1A6" size={24} />
        </TouchableOpacity>
        <TouchableOpacity 
          className="p-6 rounded-full mx-4 shadow-sm"
          style={{ backgroundColor: currentConfig.color }}
          onPress={() => setIsRunning(!isRunning)}
        >
          {isRunning ? (
            <Pause color="#FFFFFF" size={32} />
          ) : (
            <Play color="#FFFFFF" size={32} style={{ marginLeft: 4 }} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
