import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  loading?: boolean;
  onClear?: () => void;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Find your favorite breed...',
  loading = false,
  onClear,
  autoFocus = false,
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<TextInput>(null);

  const handleClear = (): void => {
    onChange('');
    if (onClear) {
      onClear();
    }
    // Keep focus after clearing
    inputRef.current?.focus();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused]}>
        <Ionicons 
          name="search" 
          size={20} 
          color={isFocused ? '#c48450' : '#999'} 
          style={styles.icon} 
        />
        
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#999"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          returnKeyType="search"
          returnKeyLabel="Search"
          clearButtonMode="never"
          editable={!loading}
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          selectionColor="#c48450"
          keyboardType="default"
          autoFocus={autoFocus}
        />
        
        {value.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            style={styles.clearButton}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons 
              name="close-circle" 
              size={20} 
              color="#999" 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    zIndex: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 8,
    borderWidth: 2,
    borderColor: '#e8e4de',
    minHeight: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  inputWrapperFocused: {
    borderColor: '#c48450',
    shadowColor: '#c48450',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2c2c2c',
    padding: 0,
    height: Platform.OS === 'ios' ? 40 : 40,
    backgroundColor: 'transparent',
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
});