import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from "react-native";

const { width } = Dimensions.get("window");

interface SuccessModalProps {
  visible: boolean;
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export default function SuccessModal({
  visible,
  title,
  message,
  buttonText = "Continue",
  onClose,
  autoClose = false,
  autoCloseDelay = 2000,
}: SuccessModalProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const checkmarkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animate modal appearance
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Animate checkmark with delay
      setTimeout(() => {
        Animated.spring(checkmarkAnim, {
          toValue: 1,
          tension: 50,
          friction: 6,
          useNativeDriver: true,
        }).start();
      }, 200);

      // Auto close if enabled
      if (autoClose) {
        setTimeout(() => {
          handleClose();
        }, autoCloseDelay);
      }
    } else {
      // Reset animations
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      checkmarkAnim.setValue(0);
    }
  }, [visible, autoClose, autoCloseDelay]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: opacityAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.overlayTouch}
          activeOpacity={1}
          onPress={autoClose ? undefined : handleClose}
        >
          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.modal}>
                {/* Success Icon */}
                <Animated.View
                  style={[
                    styles.iconContainer,
                    {
                      transform: [{ scale: checkmarkAnim }],
                    },
                  ]}
                >
                  <View style={styles.checkmarkCircle}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                </Animated.View>

                {/* Content */}
                <View style={styles.content}>
                  <Text style={styles.title}>{title}</Text>
                  <Text style={styles.message}>{message}</Text>
                </View>

                {/* Action Button */}
                {!autoClose && (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleClose}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.buttonText}>{buttonText}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayTouch: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  modalContainer: {
    width: width * 0.85,
    maxWidth: 320,
  },
  modal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 32,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.25,
        shadowRadius: 25,
      },
      android: {
        elevation: 25,
      },
    }),
  },
  iconContainer: {
    marginBottom: 24,
  },
  checkmarkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    fontSize: 32,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  content: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  message: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: "#111827",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    minWidth: 120,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
