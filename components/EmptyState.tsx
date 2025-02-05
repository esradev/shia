import React from "react";
import { View, Text } from "react-native";

const EmptyState = () => {
  return (
    <View className="flex flex-col items-center justify-center h-full rounded-lg border-2 border-dashed border-gray-300 p-6">
      <Text className="text-3xl text-gray-800 font-semibold mb-4">No Todos</Text>
      <Text className="text-gray-500 text-lg">No todos yet. Click the + button to add one!</Text>
    </View>
  );
};

export default EmptyState;
