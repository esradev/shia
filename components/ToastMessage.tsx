import React from "react";
import Toast from "react-native-toast-message";

const ToastMessage = () => {
  return <Toast />;
};

export const showToast = (type: "success" | "info" | "error", message: string) => {
  Toast.show({
    type,
    text1: message,
    position: "top",
    visibilityTime: 1200,
    autoHide: true
  });
};

export default ToastMessage;
