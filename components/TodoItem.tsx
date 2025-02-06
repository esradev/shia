import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Trash2, FilePen } from "lucide-react-native";

interface TodoItemProps {
  todo: { key: string; text: string; description: string; priority: string; dueDate: string };
  onEdit: (todo: any) => void;
  onDelete: (key: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onEdit, onDelete }) => {
  return (
    <View className="bg-white p-4 rounded-lg shadow-md mt-2">
      <Text className="text-gray-800 font-semibold text-lg">{todo.text}</Text>
      <Text className="text-gray-600">{todo.description}</Text>
      <Text className={`text-sm font-semibold ${todo.priority === "High" ? "text-rose-500" : todo.priority === "Medium" ? "text-yellow-500" : "text-green-500"}`}>Priority: {todo.priority}</Text>
      <Text className="text-gray-500 text-sm">Due: {todo.dueDate || "No deadline"}</Text>
      <View className="flex-row justify-end mt-2 gap-x-4">
        <TouchableOpacity onPress={() => onEdit(todo)}>
          <FilePen size={20} color="#00A6F4" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(todo.key)}>
          <Trash2 size={20} color="#FF2056" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TodoItem;
