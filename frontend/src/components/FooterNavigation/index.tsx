import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigationState } from "@react-navigation/native";
import styles from "./styles";
import { TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppStackParamList } from "../../navigation";

type NavigationProps = StackNavigationProp<AppStackParamList>;

const FooterNavigation = ({role = "USER"}: { role: "USER" | "ADMIN" }) => {
  const navigation = useNavigation<NavigationProps>(); 
  const insets = useSafeAreaInsets();
  const route = useRoute();
  
  const getIconColor = (screenName: string) => {
    return route.name === screenName ? "#000" : "#ccc";
  };
  
  return (
    <View style={[styles.footerContainer, { paddingBottom: insets.bottom }]}>
      {role === "ADMIN" ? (
        <View style={styles.footer}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate("HomeScreen")}>
            <Ionicons name="home" size={26} color={getIconColor("HomeScreen")} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.fabContainer} activeOpacity={0.8} onPress={() => navigation.navigate("AdminCreate")}>
            <Ionicons name="add" size={28} color="fff" />
          </TouchableOpacity>
          <Ionicons name="bar-chart" size={26} color={getIconColor("LeaderboardScreen")} />
          <Ionicons name="person" size={26} color={getIconColor("ProfileScreen")} />
        </View>
      ) : (
        <View style={styles.footer}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate("HomeScreen")}>
            <Ionicons name="home" size={26} color={getIconColor("HomeScreen")} />
          </TouchableOpacity>
          <Ionicons name="bar-chart" size={26} color={getIconColor("LeaderboardScreen")} />
          <Ionicons name="person" size={26} color={getIconColor("ProfileScreen")} />
        </View>
      )}      
    </View>
  );
}

export default FooterNavigation;