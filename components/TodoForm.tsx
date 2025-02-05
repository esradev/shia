import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Keyboard } from "react-native";
import PrioritySelector from "./PrioritySelector";

interface TodoFormProps {
  onSave: (text: string, description: string, priority: string, dueDate: string) => void;
  onCancel: () => void;
  initialValues?: { text: string; description: string; priority: string; dueDate: string };
  editingKey?: string;
}

const TodoForm: React.FC<TodoFormProps> = ({ onSave, onCancel, initialValues, editingKey }) => {
  const [text, setText] = useState(initialValues?.text || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [priority, setPriority] = useState(initialValues?.priority || "Medium");
  const [dueDate, setDueDate] = useState(initialValues?.dueDate || "");
  const [titleError, setTitleError] = useState<string | null>(null);

  const handleSave = () => {
    if (text.trim() === "") {
      setTitleError("Title is required.");
      return;
    }
    setTitleError(null);
    onSave(text, description, priority, dueDate);
    Keyboard.dismiss();
  };

  return (
    <View className="p-4 bg-white rounded-lg">
      <Text className="text-xl font-semibold text-gray-800 mb-2">{editingKey ? "Edit Todo" : "Add Todo"}</Text>
      <TextInput className={`border p-3 rounded-lg mb-2 focus:border-fuchsia-500 ${titleError ? "border-rose-500" : "border-gray-300"}`} placeholder="Task title..." value={text} onChangeText={setText} />
      {titleError && <Text className="text-rose-500 text-sm">{titleError}</Text>}
      <TextInput className="border border-gray-300 p-3 rounded-lg mb-2 focus:border-fuchsia-500 min-h-[80px] text-gray-800" placeholder="Description..." value={description} onChangeText={setDescription} multiline={true} />
      <PrioritySelector priority={priority} setPriority={setPriority} showMenu={false} toggleMenu={() => {}} />
      <TextInput className="border border-gray-300 p-3 rounded-lg mb-4 focus:border-fuchsia-500" placeholder="Due Date (YYYY-MM-DD)" value={dueDate} onChangeText={setDueDate} />
      <View className="flex-row justify-between">
        <TouchableOpacity className="bg-fuchsia-600 p-3 rounded-lg items-center flex-1" onPress={handleSave}>
          <Text className="text-white font-semibold">{editingKey ? "Update Todo" : "Add Todo"}</Text>
        </TouchableOpacity>
        {/* Cancel Button */}
        <TouchableOpacity className="bg-gray-300 p-3 rounded-lg items-center flex-2 ml-2" onPress={onCancel}>
          <Text className="text-black font-semibold">Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TodoForm;
