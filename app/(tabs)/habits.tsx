import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { CheckCircle, PlusCircle, Circle } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Habits() {
  const [habits, setHabits] = useState<{ id: string; text: string; completed: boolean }[]>([]);
  const [habitText, setHabitText] = useState("");

  useEffect(() => {
    loadHabits();
  }, []);

  useEffect(() => {
    saveHabits();
  }, [habits]);

  const loadHabits = async () => {
    try {
      const storedHabits = await AsyncStorage.getItem("habits");
      if (storedHabits) {
        setHabits(JSON.parse(storedHabits));
      }
    } catch (error) {
      console.error("Failed to load habits:", error);
    }
  };

  const saveHabits = async () => {
    try {
      await AsyncStorage.setItem("habits", JSON.stringify(habits));
    } catch (error) {
      console.error("Failed to save habits:", error);
    }
  };

  const addHabit = () => {
    if (habitText.trim() !== "") {
      const newHabits = [...habits, { id: Date.now().toString(), text: habitText, completed: false }];
      setHabits(newHabits);
      setHabitText("");
    }
  };

  const toggleHabit = (id: string) => {
    const updatedHabits = habits.map(habit => (habit.id === id ? { ...habit, completed: !habit.completed } : habit));
    setHabits(updatedHabits);
  };

  return (
    <View className="flex-1 bg-fuchsia-100 p-4">
      <Text className="text-xl font-bold text-fuchsia-600 mb-4">Habit Tracker</Text>
      <View className="flex-row items-center mb-4">
        <TextInput className="flex-1 bg-white p-3 rounded-lg shadow-sm" placeholder="Enter a new habit" value={habitText} onChangeText={setHabitText} />
        <TouchableOpacity onPress={addHabit} className="ml-3">
          <PlusCircle size={32} color="#c026d3" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={habits}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View className="flex-row items-center justify-between bg-white p-3 rounded-lg shadow-sm mb-2">
            <Text className={`text-lg ${item.completed ? "text-gray-400 line-through" : "text-black"}`}>{item.text}</Text>
            <TouchableOpacity onPress={() => toggleHabit(item.id)}>{item.completed ? <CheckCircle size={24} color="#10b981" /> : <Circle size={24} color="#f87171" />}</TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
