import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

interface PrioritySelectorProps {
  priority: string;
  setPriority: (priority: string) => void;
  showMenu: boolean;
  toggleMenu: () => void;
}

const PrioritySelector: React.FC<PrioritySelectorProps> = ({ priority, setPriority, showMenu, toggleMenu }) => {
  return (
    <View className="relative mb-2">
      <TouchableOpacity className="bg-gray-200 p-3 rounded-lg flex-row justify-between items-center" onPress={toggleMenu}>
        <Text className="text-gray-800">{priority} Priority</Text>
        <Text className="text-gray-500">▼</Text>
      </TouchableOpacity>
      {showMenu && (
        <View className="absolute top-12 left-0 bg-white shadow-md rounded-lg w-full z-10">
          {["Low", "Medium", "High"].map(level => (
            <TouchableOpacity key={level} className={`p-3 border-b ${priority === level ? "bg-fuchsia-600 text-white" : "bg-white text-gray-800"}`} onPress={() => setPriority(level)}>
              <Text className={priority === level ? "text-white font-bold" : "text-gray-800"}>{level}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default PrioritySelector;
