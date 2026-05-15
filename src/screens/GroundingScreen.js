import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Leaf, Camera, Heart } from 'lucide-react-native';

export default function GroundingScreen() {
  const insets = useSafeAreaInsets();
  const [note, setNote] = useState('');

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <View className="flex-1 justify-center items-center px-6" style={{ paddingTop: insets.top }}>
        <View className="items-center mb-10 w-full">
          <View className="bg-lavender p-5 rounded-full mb-6 shadow-sm">
            <Leaf color="#FFFFFF" size={36} />
          </View>
          <Text className="text-textMain font-bold text-3xl text-center mb-4">Cápsula del Presente</Text>
          <Text className="text-textMuted text-center text-base px-2 leading-relaxed">
            Anclate al aquí y ahora. Registra una sensación física o algo hermoso que estés viendo.
          </Text>
        </View>

        <View className="bg-surface w-full rounded-4xl p-6 shadow-sm mb-6 border border-surfaceLight">
          <TextInput 
            placeholder="Siento la brisa en mis manos..."
            placeholderTextColor="#D1D5DB"
            multiline
            className="text-textMain text-lg h-32"
            textAlignVertical="top"
            value={note}
            onChangeText={setNote}
          />
          <View className="flex-row justify-end mt-4">
            <TouchableOpacity className="bg-surfaceLight p-3 rounded-full">
              <Camera color="#9BA1A6" size={22} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          className="bg-lavender px-8 py-5 rounded-full w-full items-center flex-row justify-center shadow-sm"
        >
          <Heart color="#FFFFFF" size={22} className="mr-2" />
          <Text className="text-white font-bold text-lg">Guardar y Respirar</Text>
        </TouchableOpacity>
        <View className="h-24" />
      </View>
    </KeyboardAvoidingView>
  );
}
