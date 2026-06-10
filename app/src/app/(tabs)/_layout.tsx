import React from 'react';
import { Tabs } from 'expo-router';
import { useApp } from '../../context/AppContext';
import { themeColors } from '../../constants/themeColors';
import { Home, BarChart3, BookOpen, Settings } from 'lucide-react-native';
import ParahDetailModal from '../../components/ParahDetailModal';

export default function TabsLayout() {
  const { settings } = useApp();
  const theme = themeColors[settings.theme || 'dark'];

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.accent,
          tabBarInactiveTintColor: theme.textMuted,
          tabBarStyle: {
            backgroundColor: theme.bgCard,
            borderTopColor: theme.border,
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
            paddingTop: 6,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontFamily: 'Inter_600SemiBold',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Today',
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="progress"
          options={{
            title: 'Progress',
            tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="all"
          options={{
            title: 'All Parahs',
            tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
          }}
        />
      </Tabs>
      <ParahDetailModal />
    </>
  );
}
