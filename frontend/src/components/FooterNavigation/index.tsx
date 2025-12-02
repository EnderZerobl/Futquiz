import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigationState } from "@react-navigation/native";
import styles from "./styles";

const FooterNavigation = () => {
  const insets = useSafeAreaInsets();
  const routeName = useNavigationState((state) => state?.routes[state?.index || 0]?.name);
  
  const getIconColor = (screenName: string) => {
    return routeName === screenName ? "#000" : "#ccc";
  };
  
  return (
    <View style={[styles.footerContainer, { paddingBottom: insets.bottom + 8 }]}>
      <View style={styles.footer}>
        <Ionicons name="home" size={26} color={getIconColor("HomeScreen")} />
        <Ionicons name="bar-chart" size={26} color={getIconColor("LeaderboardScreen")} />
        <Ionicons name="person" size={26} color={getIconColor("ProfileScreen")} />
      </View>
    </View>
  )
}

export default FooterNavigation;