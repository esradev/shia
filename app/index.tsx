import React, { useState, useEffect, useRef } from "react";
import { Text, View, TextInput, FlatList, TouchableOpacity, Keyboard } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
import Animated, { withTiming, useSharedValue, useAnimatedStyle } from "react-native-reanimated";
import ToastMessage, { showToast } from "@/components/ToastMessage";
import FloatingActionButton from "@/components/FloatingActionButton";
import EmptyState from "@/components/EmptyState";
import TodoItem from "@/components/TodoItem";

import { loadTodos, saveTodos } from "@/utils/storage";

export default function Index() {
  const [todos, setTodos] = useState<{ key: string; text: string; description: string; priority: string; dueDate: string }[]>([]);
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);
  const translateY = useSharedValue(500); // Start off-screen
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadTodos(setTodos);
  }, []);

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const addTodo = () => {
    if (text.trim() === "") {
      setTitleError("Title is required.");
      return;
    }

    setTitleError(null);

    const newTodo = { key: editingKey || Date.now().toString(), text, description, priority, dueDate };
    setTodos(editingKey ? todos.map(todo => (todo.key === editingKey ? newTodo : todo)) : [...todos, newTodo]);

    showToast(editingKey ? "info" : "success", editingKey ? "Todo updated successfully!" : "Todo added successfully!");
    setEditingKey(null);
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

  const editTodo = (todo: { key: string; text: string; description: string; priority: string; dueDate: string }) => {
    setText(todo.text);
    setDescription(todo.description);
    setPriority(todo.priority);
    setDueDate(todo.dueDate);
    setEditingKey(todo.key);
    if (!showForm) openPanel();
  };

  const openPanel = () => {
    setShowForm(true);
    translateY.value = withTiming(0, { duration: 300 });
  };

  const closePanel = () => {
    setShowForm(false);
    translateY.value = withTiming(500, { duration: 300 });
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
        {todos.length === 0 && !showForm && <EmptyState />}

        {/* Todo List */}
        <FlatList data={todos} renderItem={({ item }) => <TodoItem todo={item} onEdit={editTodo} onDelete={deleteTodo} />} />

        <FloatingActionButton onPress={openPanel} />

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
        <ToastMessage />
      </View>
    </GestureHandlerRootView>
  );
}
