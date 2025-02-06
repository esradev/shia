import React from "react";
import { View, Text } from "react-native";
import { FolderX } from "lucide-react-native";

const EmptyState = () => {
  return (
    <View className="flex flex-col items-center justify-center h-full rounded-lg border-2 border-dashed border-gray-300 p-6">
      <FolderX size={50} color="#f43f5e" />
      <Text className="text-3xl text-gray-800 font-semibold mb-4 mt-8">No Todos</Text>
      <Text className="text-gray-500 text-lg">No todos yet. Click the + button to add one!</Text>
    </View>
  );
};

export default EmptyState;
