import React from 'react';
import Modal from 'react-modal';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity, Text, View } from 'react-native';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'success' | 'warning' | 'error' | 'info';
  showIcon?: boolean;
}

// Set the app element for accessibility (required by react-modal)
if (typeof document !== 'undefined') {
  Modal.setAppElement(document.getElementById('root') || document.body);
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info',
  showIcon = true,
}: ConfirmationModalProps) {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          iconName: 'check-circle' as const,
          iconColor: '#30D158',
          confirmButtonBg: 'bg-green-500',
          confirmButtonBorder: 'border-green-600',
          confirmButtonHover: 'hover:bg-green-600',
        };
      case 'warning':
        return {
          iconName: 'warning' as const,
          iconColor: '#FF9F0A',
          confirmButtonBg: 'bg-orange-500',
          confirmButtonBorder: 'border-orange-600',
          confirmButtonHover: 'hover:bg-orange-600',
        };
      case 'error':
        return {
          iconName: 'error' as const,
          iconColor: '#FF453A',
          confirmButtonBg: 'bg-red-500',
          confirmButtonBorder: 'border-red-600',
          confirmButtonHover: 'hover:bg-red-600',
        };
      default: // info
        return {
          iconName: 'info' as const,
          iconColor: '#409CFF',
          confirmButtonBg: 'bg-blue-500',
          confirmButtonBorder: 'border-blue-600',
          confirmButtonHover: 'hover:bg-blue-600',
        };
    }
  };

  const typeStyles = getTypeStyles();

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      position: 'relative' as const,
      top: 'auto',
      left: 'auto',
      right: 'auto',
      bottom: 'auto',
      border: 'none',
      background: 'white',
      borderRadius: '12px',
      padding: '0',
      maxWidth: '400px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'visible',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
    >
      <View className="p-6">
        {/* Header with Icon */}
        {showIcon && (
          <View className="flex items-center mb-4">
            <View className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <MaterialIcons 
                name={typeStyles.iconName} 
                size={32} 
                color={typeStyles.iconColor} 
              />
            </View>
          </View>
        )}

        {/* Title */}
        <Text className="text-xl font-bold text-gray-900 text-center mb-2">
          {title}
        </Text>

        {/* Message */}
        <Text className="text-base text-gray-600 text-center mb-6 leading-relaxed">
          {message}
        </Text>

        {/* Action Buttons */}
        <View className="flex-row space-x-3">
          {/* Cancel Button */}
          <TouchableOpacity
            onPress={onClose}
            className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 min-h-[44px] items-center justify-center active:opacity-80"
          >
            <Text className="text-base font-semibold text-gray-700">
              {cancelText}
            </Text>
          </TouchableOpacity>

          {/* Confirm Button */}
          <TouchableOpacity
            onPress={handleConfirm}
            className={`flex-1 ${typeStyles.confirmButtonBg} ${typeStyles.confirmButtonBorder} rounded-lg px-4 py-3 min-h-[44px] items-center justify-center active:opacity-80`}
          >
            <Text className="text-base font-semibold text-white">
              {confirmText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
