import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

interface LoadingMoreProps {
  loading: boolean;
  hasMore: boolean;
}

export const LoadingMore: React.FC<LoadingMoreProps> = ({ loading, hasMore }) => {
  if (!loading) return null;
  
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color="#c48450" />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  text: {
    fontSize: 14,
    color: '#666',
  },
});