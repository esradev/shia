import React from "react";
import { View } from "react-native";
import { BlurView } from "expo-blur";

const BlurOverlay = () => {
  return <BlurView intensity={90} style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }} />;
};

export default BlurOverlay;
