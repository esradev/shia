import { Stack } from "expo-router";
import { Text, View, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // You can use any icon library

import "../global.css"; // Ensure NativeWind is working

export default function RootLayout() {
  return (
    <Stack>
      {/* Custom Header */}
      <Stack.Screen
        name="index"
        options={{
          statusBarBackgroundColor: "#f0abfc",
          header: () => (
            <View className="flex-row justify-between items-center p-4 shadow-lg bg-fuchsia-300">
              <Text className="text-xl font-semibold"> M&H Todo App</Text>
              <View className="flex-row items-center">
                {/* <TouchableOpacity className="mr-4">
                  <FontAwesome name="bell" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <FontAwesome name="user" size={24} color="white" />
                </TouchableOpacity> */}
              </View>
            </View>
          )
        }}
      />
    </Stack>
  );
}
