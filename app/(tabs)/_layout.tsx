import { Tabs, Stack } from "expo-router";

import TabBar from "@/components/TabBar";
import { ListChecks, Repeat2 } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs tabBar={props => <TabBar {...props} />}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Todos",
          tabBarIcon: ({ color, size }) => <ListChecks size={26} color={color} />,
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: "Habits",
          tabBarIcon: ({ color, size }) => <Repeat2 size={26} color={color} />,
          headerShown: false
        }}
      />
    </Tabs>
  );
}
