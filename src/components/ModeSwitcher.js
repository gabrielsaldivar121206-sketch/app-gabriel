import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Code, Music } from 'lucide-react-native';
import { useMode } from '../context/ModeContext';

export default function ModeSwitcher() {
  const { mode, toggleMode } = useMode();
  const isTech = mode === 'technical';

  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={toggleMode}
      className="h-10 w-20 bg-surfaceLight rounded-full p-1 flex-row items-center relative"
    >
      <View 
        className={`absolute h-8 w-9 rounded-full bg-[#353545] top-1 ${isTech ? 'left-1' : 'right-1'}`} 
      />
      <View className="flex-1 items-center justify-center z-10">
        <Code size={16} color={isTech ? '#8B93FF' : '#9BA1A6'} />
      </View>
      <View className="flex-1 items-center justify-center z-10">
        <Music size={16} color={!isTech ? '#FF8B93' : '#9BA1A6'} />
      </View>
    </TouchableOpacity>
  );
}
