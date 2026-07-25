import React from "react";
import { Tabs } from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import { colors } from "@/theme/colors";

export default function TabLayout(): React.ReactElement{
    return(
        <Tabs
        screenOptions={{
            tabBarActiveTintColor:colors.primary,
            tabBarInactiveTintColor:colors.textSecondary,
            tabBarStyle:{
                backgroundColor: colors.surface,
                borderTopColor: colors.border,
                height: 60,
                paddingBottom: 8,
            },
            tabBarLabelStyle:{
                fontSize:12,
                fontWeight: '500',
            },
            headerShown:false,
        }}
        >
            <Tabs.Screen
            name="home"
            options={{
                title:"Home",
                tabBarIcon:({focused, color, size})=>(
                    <Ionicons
                    name={ focused ? 'home' :'home-outline'}
                    size={size}
                    color={color}
                    />
                )
            }}
            />
            <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? 'heart' : 'heart-outline'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />

        </Tabs>
    )
}