import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import { Image } from "react-native";

const FooterNavigation = () => {
  return (
    <View style={styles.footer}>
      {/* <Image source={require("../../assets/icons/home.png")} /> */}
      <Ionicons name="home" size={26} color="#ccc" />
      {/* <Ionicons name="search" size={26} color="#ccc" /> */}
      <Ionicons name="bar-chart" size={26} color="#ccc" />
      <Ionicons name="person" size={26} color="#ccc" />
    </View>
  )
}

export default FooterNavigation;