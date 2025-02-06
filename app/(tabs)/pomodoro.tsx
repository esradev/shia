import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Play, Pause, RotateCcw } from "lucide-react-native";
import Svg, { Circle } from "react-native-svg";

export default function Pomodoro() {
  const [workTime, setWorkTime] = useState("25");
  const [breakTime, setBreakTime] = useState("5");
  const [timeLeft, setTimeLeft] = useState(Number(workTime) * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      toggleSession();
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    const totalTime = (isBreak ? Number(breakTime) : Number(workTime)) * 60;
    setProgress((timeLeft / totalTime) * 100);
  }, [timeLeft, workTime, breakTime, isBreak]);

  const toggleSession = () => {
    setIsBreak(!isBreak);
    setTimeLeft(isBreak ? Number(workTime) * 60 : Number(breakTime) * 60);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    setTimeLeft(Number(workTime) * 60);
    setIsRunning(true);
  };

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * ((100 - progress) / 100);

  return (
    <View className="flex-1 items-center justify-center bg-fuchsia-100 p-6">
      <Text className="text-3xl font-bold text-fuchsia-700 mb-4">{isBreak ? "Break Time" : "Work Time"}</Text>

      {/* Circle Timer */}
      <Svg height="200" width="200" viewBox="0 0 200 200" className="mb-6">
        <Circle cx="100" cy="100" r={radius} stroke="#ddd" strokeWidth="10" fill="none" />
        <Circle cx="100" cy="100" r={radius} stroke="#c026d3" strokeWidth="10" fill="none" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
      </Svg>

      {/* Timer */}
      <Text className="text-6xl font-bold text-fuchsia-900">{formatTime(timeLeft)}</Text>

      {/* Work / Break Time Inputs */}
      <View className="flex-row mt-6 gap-x-4">
        <View className="items-center">
          <Text className="text-lg text-fuchsia-700">Work (min)</Text>
          <TextInput className="text-center bg-white px-3 py-2 rounded-lg w-20 text-lg" keyboardType="numeric" value={workTime} onChangeText={text => setWorkTime(text.replace(/[^0-9]/g, ""))} placeholder="25" />
        </View>
        <View className="items-center">
          <Text className="text-lg text-fuchsia-700">Break (min)</Text>
          <TextInput className="text-center bg-white px-3 py-2 rounded-lg w-20 text-lg" keyboardType="numeric" value={breakTime} onChangeText={text => setBreakTime(text.replace(/[^0-9]/g, ""))} placeholder="5" />
        </View>
      </View>

      {/* Controls */}
      <View className="flex-row gap-x-4 mt-6">
        <TouchableOpacity onPress={() => setIsRunning(!isRunning)} className="p-4 bg-green-500 rounded-full">
          {isRunning ? <Pause size={32} color="#fff" /> : <Play size={32} color="#fff" />}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleStart} className="p-4 bg-blue-500 rounded-full">
          <RotateCcw size={32} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
