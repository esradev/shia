import { useState, useEffect, useRef } from "react";
import { Text, View, TextInput, FlatList, TouchableOpacity, Keyboard, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

export default function Index() {
  const [todos, setTodos] = useState<{ key: string; text: string; description: string; priority: string; dueDate: string }[]>([]);
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);

  // Animation state using useRef
  const formAnim = useRef(new Animated.Value(0)).current;

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

  const toggleForm = () => {
    setShowForm(!showForm);
    Animated.timing(formAnim, {
      toValue: showForm ? 0 : 1,
      duration: 300,
      useNativeDriver: true
    }).start();
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
    if (text.trim()) {
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
      setShowPriorityMenu(false);
      Keyboard.dismiss();
      toggleForm();
    }
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
    if (!showForm) toggleForm(); // Open form when editing
  };

  return (
    <View className="flex-1 bg-gray-100 p-6">
      {/* Empty State Message */}
      {todos.length === 0 && !showForm && (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500 text-lg">No todos yet. Click the + button to add one!</Text>
        </View>
      )}

      {/* Animated Form */}
      {showForm && (
        <Animated.View
          style={{
            transform: [{ translateY: formAnim.interpolate({ inputRange: [0, 1], outputRange: [100, 0] }) }],
            opacity: formAnim
          }}
          className="bg-white shadow-lg p-4 rounded-xl mb-4"
        >
          <Text className="text-xl font-semibold text-gray-800 mb-2">{editingKey ? "Edit Todo" : "Add Todo"}</Text>

          <TextInput className="border border-gray-300 p-3 rounded-lg mb-2 focus:border-blue-500" placeholder="Task title..." value={text} onChangeText={setText} />

          <TextInput className="border border-gray-300 p-3 rounded-lg mb-2 focus:border-blue-500 min-h-[80px] text-gray-800" placeholder="Description..." value={description} onChangeText={setDescription} multiline={true} />

          {/* Priority Dropdown */}
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
                    className={`p-3 border-b ${priority === level ? "bg-blue-500 text-white" : "bg-white text-gray-800"}`}
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

          <TextInput className="border border-gray-300 p-3 rounded-lg mb-4 focus:border-blue-500" placeholder="Due Date (YYYY-MM-DD)" value={dueDate} onChangeText={setDueDate} />

          {/* Add Button */}
          <TouchableOpacity className="bg-blue-500 p-3 rounded-lg items-center" onPress={addTodo}>
            <Text className="text-white font-semibold">{editingKey ? "Update Todo" : "Add Todo"}</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Todo List */}
      <FlatList
        data={todos}
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-lg shadow-md mt-2">
            <Text className="text-gray-800 font-semibold text-lg">{item.text}</Text>
            <Text className="text-gray-600">{item.description}</Text>
            <Text className={`text-sm font-semibold ${item.priority === "High" ? "text-red-500" : item.priority === "Medium" ? "text-yellow-500" : "text-green-500"}`}>Priority: {item.priority}</Text>
            <Text className="text-gray-500 text-sm">Due: {item.dueDate || "No deadline"}</Text>
            <View className="flex-row justify-end mt-2">
              {/* Edit Button */}
              <TouchableOpacity onPress={() => editTodo(item)}>
                <Text className="text-blue-500 font-semibold mr-4">Edit</Text>
              </TouchableOpacity>
              {/* Delete Button */}
              <TouchableOpacity onPress={() => deleteTodo(item.key)}>
                <Text className="text-red-500 font-semibold">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity className="absolute bottom-6 right-6 bg-blue-500 w-16 h-16 rounded-full items-center justify-center shadow-lg" onPress={toggleForm}>
        <Text className="text-white text-3xl">+</Text>
      </TouchableOpacity>

      {/* Toast Component */}
      <Toast />
    </View>
  );
}
