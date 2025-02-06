import React, { useState, useEffect } from "react";
import { View, FlatList, Keyboard } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
import Animated, { withTiming, useSharedValue, useAnimatedStyle } from "react-native-reanimated";
import ToastMessage, { showToast } from "@/components/ToastMessage";
import FloatingActionButton from "@/components/FloatingActionButton";
import EmptyState from "@/components/EmptyState";
import TodoItem from "@/components/TodoItem";

import { loadTodos, saveTodos } from "@/utils/storage";
import TodoForm from "@/components/TodoForm";

export default function Index() {
  const [todos, setTodos] = useState<{ key: string; text: string; description: string; priority: string; dueDate: string }[]>([]);
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const translateY = useSharedValue(500); // Start off-screen
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadTodos(setTodos);
  }, []);

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const addTodo = (text: string, description: string, priority: string, dueDate: string) => {
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
              <TodoForm onSave={addTodo} closePanel={closePanel} setEditingKey={setEditingKey} initialValues={todos.find(todo => todo.key === editingKey)} editingKey={editingKey} />
            </Animated.View>
          </>
        )}

        {/* Toast Component */}
        <ToastMessage />
      </View>
    </GestureHandlerRootView>
  );
}
