import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { Plus } from "lucide-react-native";

interface FABProps {
  onPress: () => void;
}

const FloatingActionButton: React.FC<FABProps> = ({ onPress }) => {
  return (
    <TouchableOpacity className="absolute bottom-28 right-6 bg-fuchsia-600 w-16 h-16 rounded-full items-center justify-center shadow-lg" onPress={onPress}>
      <Text className="text-white text-3xl">
        <Plus size={30} color="white" />
      </Text>
    </TouchableOpacity>
  );
};

export default FloatingActionButton;
