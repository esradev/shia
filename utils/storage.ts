import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveTodos = async (todos: any[]) => {
  try {
    await AsyncStorage.setItem("todos", JSON.stringify(todos));
  } catch (error) {
    console.error("Error saving todos:", error);
  }
};

export const loadTodos = async (setTodos: (todos: any[]) => void) => {
  try {
    const storedTodos = await AsyncStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  } catch (error) {
    console.error("Error loading todos:", error);
  }
};
