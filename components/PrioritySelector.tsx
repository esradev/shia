import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { ChevronDown, Check } from "lucide-react-native";

interface PrioritySelectorProps {
  priority: string;
  setPriority: (priority: string) => void;
}

const PrioritySelector: React.FC<PrioritySelectorProps> = ({ priority, setPriority }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handlePrioritySelect = (level: string) => {
    setPriority(level);
    setShowMenu(false);
  };

  return (
    <View className="relative mb-2">
      <TouchableOpacity className="bg-white border border-gray-300 p-3 rounded-lg flex-row justify-between items-center" onPress={() => setShowMenu(!showMenu)}>
        <Text className="text-gray-600">{priority} Priority</Text>
        <ChevronDown size={24} color="gray" />
      </TouchableOpacity>
      {showMenu && (
        <View className="absolute top-12 left-0 bg-white shadow-md rounded-lg w-full z-10">
          {["Low", "Medium", "High"].map(level => (
            <TouchableOpacity key={level} className={`flex-row items-center gap-x-3 p-3 rounded-lg ${priority === level ? "bg-fuchsia-600 text-white" : "bg-white text-gray-800"}`} onPress={() => handlePrioritySelect(level)}>
              {priority === level && <Check size={16} color="white" />}
              <Text className={priority === level ? "text-white font-bold" : "text-gray-800"}>{level}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default PrioritySelector;
