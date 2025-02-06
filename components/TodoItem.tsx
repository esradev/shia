import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Modal, Dimensions } from "react-native";
import { Trash2, FilePen, ChevronDownCircle, Badge, BadgeCheck, MoreVertical } from "lucide-react-native";

const screenWidth = Dimensions.get("window").width;

interface TodoItemProps {
  todo: { key: string; text: string; description: string; priority: string; dueDate: string; completed: boolean };
  onEdit: (todo: any) => void;
  onDelete: (key: string) => void;
  onComplete: (key: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onEdit, onDelete, onComplete }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const menuButtonRef = useRef<View>(null);

  const handleDelete = () => {
    onDelete(todo.key);
    setShowConfirm(false);
    setShowActions(false);
  };

  const openMenu = () => {
    if (menuButtonRef.current) {
      menuButtonRef.current?.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
        const menuWidth = 150;
        const isNearRightEdge = px + menuWidth > screenWidth;
        setMenuPosition({
          top: py + height + 5,
          left: isNearRightEdge ? px - menuWidth + width : px
        });
        setShowActions(true);
      });
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => setShowDetails(!showDetails)}>
      <View className={`bg-white p-4 flex flex-col rounded-lg shadow-md mt-2 ${todo.completed ? "opacity-50 bg-green-50" : ""}`}>
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-x-2">
            {/* Complete Badge */}
            <TouchableOpacity onPress={() => onComplete(todo.key)} className="p-2">
              <View>{todo.completed ? <BadgeCheck size={20} color="green" /> : <Badge size={20} color="black" />}</View>
            </TouchableOpacity>
            <Text className="text-gray-800 font-semibold text-lg">{todo.text}</Text>
          </View>
          <TouchableOpacity onPress={openMenu} className="p-2">
            <View ref={menuButtonRef}>
              <MoreVertical size={20} color="#666" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Show Details */}
        {showDetails && (
          <View className="bg-gray-100 p-4 mt-2 rounded-lg w-full">
            <Text className="text-gray-800">{todo.description}</Text>
            <Text className="text-gray-800 mt-2">Priority: {todo.priority}</Text>
            <Text className="text-gray-800">Due Date: {todo.dueDate}</Text>
          </View>
        )}
      </View>

      {/* Flyout Menu Modal with Dynamic Position */}
      <Modal transparent visible={showActions} animationType="fade">
        <TouchableOpacity className="flex-1" onPress={() => setShowActions(false)}>
          <View style={{ position: "absolute", top: menuPosition.top, left: menuPosition.left, backgroundColor: "white", padding: 10, borderRadius: 10, shadowOpacity: 0.2, shadowRadius: 5, width: 150 }}>
            <TouchableOpacity
              className="flex-row items-center py-2"
              onPress={() => {
                setShowActions(false);
                onEdit(todo);
              }}
            >
              <FilePen size={18} color="#00A6F4" />
              <Text className="ml-2 text-gray-800">Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center py-2"
              onPress={() => {
                setShowConfirm(true);
                setShowActions(false);
              }}
            >
              <Trash2 size={18} color="#FF2056" />
              <Text className="ml-2 text-gray-800">Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center py-2"
              onPress={() => {
                setShowDetails(!showDetails);
                setShowActions(false);
              }}
            >
              <ChevronDownCircle size={18} color="#FFA500" />
              <Text className="ml-2 text-gray-800">{showDetails ? "Hide Details" : "Show Details"}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Delete Confirmation */}
      {showConfirm && (
        <View className="bg-white p-4 flex flex-col rounded-lg shadow-md mt-2">
          <Text className="text-gray-800">Are you sure you want to delete this todo?</Text>
          <View className="flex-row justify-end mt-2">
            <TouchableOpacity onPress={() => setShowConfirm(false)}>
              <Text className="text-gray-800 font-semibold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete}>
              <Text className="text-red-600 font-semibold ml-4">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default TodoItem;
