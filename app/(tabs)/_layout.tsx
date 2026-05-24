import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs, router } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../src/auth';
import { useTheme } from '../../src/theme';

export default function TabLayout() {
  const { user, loading } = useAuth();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.textSecondary, marginTop: 12, fontSize: 13 }}>
          Carregando...
        </Text>
      </View>
    );
  }

  if (!user) return <Redirect href="/login" />;

  const bottomPad = Math.max(insets.bottom, Platform.OS === 'ios' ? 0 : 4);

  const tabBarStyle = useMemo(
    () => ({
      backgroundColor: colors.surface,
      borderTopColor: colors.border,
      borderTopWidth: 1,
      height: 64 + bottomPad,
      paddingBottom: bottomPad + 6,
      paddingTop: 10,
      elevation: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
    }),
    [colors, bottomPad]
  );

  const screenOpts = {
    headerShown: false,
    tabBarActiveTintColor: '#7FFF00',
    tabBarInactiveTintColor: colors.textTertiary,
    tabBarStyle,
    tabBarShowLabel: true,
    tabBarLabelStyle: {
      fontSize: 10,
      fontWeight: '500',
      marginTop: 2,
    },
  };

  return (
    <Tabs screenOptions={screenOpts}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name={focused ? 'home' : 'home-outline'}
              color={color}
              focused={focused}
              colors={colors}
            />
          ),
          tabBarLabel: 'Início',
        }}
      />

      <Tabs.Screen
        name="planilha"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name={focused ? 'grid' : 'grid-outline'}
              color={color}
              focused={focused}
              colors={colors}
            />
          ),
          tabBarLabel: 'Planilha',
        }}
      />

      <Tabs.Screen
        name="guide"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name={focused ? 'book' : 'book-outline'}
              color={color}
              focused={focused}
              colors={colors}
            />
          ),
          tabBarLabel: 'Guia',
        }}
      />

      <Tabs.Screen
        name="report"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name={focused ? 'document-text' : 'document-text-outline'}
              color={color}
              focused={focused}
              colors={colors}
            />
          ),
          tabBarLabel: 'Relatório',
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name={focused ? 'person' : 'person-outline'}
              color={color}
              focused={focused}
              colors={colors}
            />
          ),
          tabBarLabel: 'Config',
        }}
      />

      <Tabs.Screen name="gallery" options={{ href: null }} />
      <Tabs.Screen name="turno" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="products" options={{ href: null }} />
    </Tabs>
  );
}

function TabIcon({
  name,
  color,
  focused,
  colors,
}: {
  name: any;
  color: string;
  focused: boolean;
  colors: any;
}) {
  return (
    <View style={TI.wrap}>
      {focused && <View style={[TI.indicator, { backgroundColor: colors.primary }]} />}
      <Ionicons name={name} size={25} color={color} />
    </View>
  );
}

const TI = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
  indicator: {
    position: 'absolute',
    top: -10,
    width: 28,
    height: 3,
    borderRadius: 2,
  },
});
