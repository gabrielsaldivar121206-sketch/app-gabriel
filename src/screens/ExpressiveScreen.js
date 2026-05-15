import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mic, Edit3 } from 'lucide-react-native';

export default function ExpressiveScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="px-6 pt-6 pb-6">
        <Text className="text-textMain font-bold text-3xl">Expresión Libre</Text>
        <Text className="text-textMuted mt-2 text-base">Sin presión. Solo captura ideas.</Text>
      </View>

      <ScrollView className="flex-1 px-6">
        
        {/* Quick Voice Note */}
        <TouchableOpacity className="bg-yellow rounded-4xl p-6 mb-5 flex-row items-center shadow-sm">
          <View className="bg-white p-4 rounded-full mr-4">
            <Mic color="#D9A05B" size={26} />
          </View>
          <View className="flex-1">
            <Text className="text-textMain font-bold text-lg mb-1">Grabador Rápido</Text>
            <Text className="text-textMain opacity-70 text-sm">Captura esa melodía ahora</Text>
          </View>
        </TouchableOpacity>

        {/* 1 Min Drawing Challenge */}
        <TouchableOpacity className="bg-surface rounded-4xl p-6 mb-5 flex-row items-center border border-surfaceLight shadow-sm">
          <View className="bg-surfaceLight p-4 rounded-full mr-4">
            <Edit3 color="#FF9E7D" size={26} />
          </View>
          <View className="flex-1">
            <Text className="text-textMain font-bold text-lg mb-1">Reto de 1 Minuto</Text>
            <Text className="text-textMuted text-sm">Rompe el bloqueo visual al instante</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}
