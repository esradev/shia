import React, { useState, useEffect, useRef } from "react";
import { Text, View, TextInput, FlatList, TouchableOpacity, Keyboard } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/FontAwesome";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BlurView } from "expo-blur"; // Import BlurView from expo-blur
import Animated, { withTiming, useSharedValue, useAnimatedStyle } from "react-native-reanimated"; // Use Reanimated's Animated

export default function Index() {
  const [todos, setTodos] = useState<{ key: string; text: string; description: string; priority: string; dueDate: string }[]>([]);
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);

  // Error state
  const [titleError, setTitleError] = useState<string | null>(null); // Track error message for title input

  // For Swipeable panel
  const translateY = useSharedValue(500); // Start off-screen
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    saveTodos();
  }, [todos]);

  const saveTodos = async () => {
    try {
      await AsyncStorage.setItem("todos", JSON.stringify(todos));
    } catch (error) {
      console.error("Error saving todos:", error);
    }
  };

  const loadTodos = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem("todos");
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (error) {
      console.error("Error loading todos:", error);
    }
  };

  const showToast = (type: "success" | "info" | "error", message: string) => {
    Toast.show({
      type: type,
      text1: message,
      position: "bottom",
      visibilityTime: 1000,
      autoHide: true
    });
  };

  const addTodo = () => {
    // Validate title (text)
    if (text.trim() === "") {
      setTitleError("Title is required.");
      return; // Prevent adding/updating if the title is empty
    }

    // Clear error if title is valid
    setTitleError(null);

    if (editingKey) {
      setTodos(todos.map(todo => (todo.key === editingKey ? { ...todo, text, description, priority, dueDate } : todo)));
      showToast("info", "Todo updated successfully!");
      setEditingKey(null);
    } else {
      setTodos([
        ...todos,
        {
          key: Date.now().toString(),
          text,
          description,
          priority,
          dueDate
        }
      ]);
      showToast("success", "Todo added successfully!");
    }

    setText("");
    setDescription("");
    setPriority("Medium");
    setDueDate("");
    Keyboard.dismiss();
    closePanel();
  };

  const deleteTodo = (key: string) => {
    setTodos(todos.filter(todo => todo.key !== key));
    showToast("error", "Todo deleted!");
  };

  const openPanel = () => {
    setShowForm(true);
    translateY.value = withTiming(0, { duration: 300 });
  };

  const closePanel = () => {
    setShowForm(false);
    translateY.value = withTiming(500, { duration: 300 });
  };

  const editTodo = (todo: { key: string; text: string; description: string; priority: string; dueDate: string }) => {
    setText(todo.text);
    setDescription(todo.description);
    setPriority(todo.priority);
    setDueDate(todo.dueDate);
    setEditingKey(todo.key);
    if (!showForm) openPanel(); // Open form when editing
  };

  const cancel = () => {
    setText("");
    setDescription("");
    setPriority("Medium");
    setDueDate("");
    setEditingKey(null);
    closePanel(); // Close form
  };

  // Animated style for the panel
  const animatedPanelStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }]
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-fuchsia-100 p-6">
        {/* Empty State Message */}
        {todos.length === 0 && !showForm && (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500 text-lg">No todos yet. Click the + button to add one!</Text>
          </View>
        )}

        {/* Todo List */}
        <FlatList
          data={todos}
          renderItem={({ item }) => (
            <View className="bg-white p-4 rounded-lg shadow-md mt-2">
              <Text className="text-gray-800 font-semibold text-lg">{item.text}</Text>
              <Text className="text-gray-600">{item.description}</Text>
              <Text className={`text-sm font-semibold ${item.priority === "High" ? "text-rose-500" : item.priority === "Medium" ? "text-yellow-500" : "text-green-500"}`}>Priority: {item.priority}</Text>
              <Text className="text-gray-500 text-sm">Due: {item.dueDate || "No deadline"}</Text>
              <View className="flex-row justify-end mt-2">
                {/* Edit Button with Icon */}
                <TouchableOpacity onPress={() => editTodo(item)}>
                  <Icon name="edit" size={20} color="#00A6F4" />
                </TouchableOpacity>
                {/* Delete Button with Icon */}
                <TouchableOpacity onPress={() => deleteTodo(item.key)} className="ml-4">
                  <Icon name="trash" size={20} color="#FF2056" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        {/* Floating Action Button (FAB) */}
        <TouchableOpacity className="absolute bottom-6 right-6 bg-fuchsia-600 w-16 h-16 rounded-full items-center justify-center shadow-lg" onPress={openPanel}>
          <Text className="text-white text-3xl">+</Text>
        </TouchableOpacity>

        {/* Animated Swipeable Panel */}
        {showForm && (
          <>
            {/* Blur Effect for Background */}
            <BlurView intensity={90} style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }} />
            <Animated.View
              style={[
                animatedPanelStyle,
                {
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: "white",
                  padding: 16,
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: -4 },
                  shadowOpacity: 0.5,
                  shadowRadius: 4
                }
              ]}
            >
              <Text className="text-xl font-semibold text-gray-800 mb-2">{editingKey ? "Edit Todo" : "Add Todo"}</Text>

              {/* Title Input */}
              <TextInput className={`border p-3 rounded-lg mb-2 focus:border-fuchsia-500 ${titleError ? "border-rose-500" : "border-gray-300"}`} placeholder="Task title..." value={text} onChangeText={setText} />
              {/* Display error message if title is empty */}
              {titleError && <Text className="text-rose-500 text-sm">{titleError}</Text>}

              <TextInput className="border border-gray-300 p-3 rounded-lg mb-2 focus:border-fuchsia-500 min-h-[80px] text-gray-800" placeholder="Description..." value={description} onChangeText={setDescription} multiline={true} />

              <View className="relative mb-2">
                <TouchableOpacity className="bg-gray-200 p-3 rounded-lg flex-row justify-between items-center" onPress={() => setShowPriorityMenu(!showPriorityMenu)}>
                  <Text className="text-gray-800">{priority} Priority</Text>
                  <Text className="text-gray-500">▼</Text>
                </TouchableOpacity>

                {showPriorityMenu && (
                  <View className="absolute top-12 left-0 bg-white shadow-md rounded-lg w-full z-10">
                    {["Low", "Medium", "High"].map(level => (
                      <TouchableOpacity
                        key={level}
                        className={`p-3 border-b ${priority === level ? "bg-fuchsia-600 text-white" : "bg-white text-gray-800"}`}
                        onPress={() => {
                          setPriority(level);
                          setShowPriorityMenu(false);
                        }}
                      >
                        <Text className={priority === level ? "text-white font-bold" : "text-gray-800"}>{level}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <TextInput className="border border-gray-300 p-3 rounded-lg mb-4 focus:border-fuchsia-500" placeholder="Due Date (YYYY-MM-DD)" value={dueDate} onChangeText={setDueDate} />

              {/* Add or Cancel Buttons */}
              <View className="flex-row justify-between">
                <TouchableOpacity className="bg-fuchsia-600 p-3 rounded-lg items-center flex-1" onPress={addTodo}>
                  <Text className="text-white font-semibold">{editingKey ? "Update Todo" : "Add Todo"}</Text>
                </TouchableOpacity>
                {/* Cancel Button */}
                <TouchableOpacity className="bg-gray-300 p-3 rounded-lg items-center flex-2 ml-2" onPress={cancel}>
                  <Text className="text-black font-semibold">Cancel</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </>
        )}

        {/* Toast Component */}
        <Toast />
      </View>
    </GestureHandlerRootView>
  );
}
