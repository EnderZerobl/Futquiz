import React from "react";
import { View, useWindowDimensions, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigationState } from "@react-navigation/native";
import styles from "./styles";
import { TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppStackParamList } from "../../navigation";
import Svg, { Path } from "react-native-svg";
import homeIcon from "../../../assets/icons/home.png";
import leaderboardIcon from "../../../assets/icons/Leaderboard.png";
import profileIcon from "../../../assets/icons/Profile.png";

type NavigationProps = StackNavigationProp<AppStackParamList>;

const FooterNavigation = ({role = "USER"}: { role: "USER" | "ADMIN" }) => {
  const navigation = useNavigation<NavigationProps>(); 
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { width: screenWidth } = useWindowDimensions(); // Dinâmico
  const footerWidth = screenWidth; // 100% da largura
  const centerX = screenWidth / 2;
  const indentWidth = 85;
  const indentDepth = 45;
  const radius = 35;
  const height = 70;
  
  const getIconColor = (screenName: string) => {
    return route.name === screenName ? "#000" : "#ccc";
  };
  
  // Path SVG para criar a barra com concavidade côncava e arredondada
  // A concavidade vai para BAIXO (dentro da barra), não para cima
  const indentStartX = centerX - indentWidth / 2;
  const indentEndX = centerX + indentWidth / 2;
  const indentControlY = indentDepth; // Positivo = para baixo
  
  // Pontos de controle mais próximos para criar uma forma mais circular
  const indentControlX1 = centerX - indentWidth / 3;
  const indentControlX2 = centerX + indentWidth / 3;
  // Ajuste para criar uma curva mais arredondada
  const indentControlY1 = indentControlY * 0.5;
  const indentControlY2 = indentControlY * 0.5;
  
  const pathData = `
    M 0 ${height}
    L 0 ${radius}
    Q 0 0 ${radius} 0
    L ${indentStartX} 0
    C ${indentStartX} ${indentControlY1} ${indentControlX1} ${indentControlY} ${centerX} ${indentControlY}
    C ${indentControlX2} ${indentControlY} ${indentEndX} ${indentControlY2} ${indentEndX} 0
    L ${footerWidth - radius} 0
    Q ${footerWidth} 0 ${footerWidth} ${radius}
    L ${footerWidth} ${height}
    Z
  `;
  
  return (
    <View style={[styles.footerContainer, { paddingBottom: insets.bottom }]}>
      {role === "ADMIN" ? (
        <>
          <View style={styles.footerWithIndent}>
            <Svg 
              width={footerWidth} 
              height={height} 
              style={styles.footerSvg}
              viewBox={`0 0 ${footerWidth} ${height}`}
            >
              <Path d={pathData} fill="#fff" />
            </Svg>
            <View style={styles.footerContent}>
              <View style={styles.footerLeftContent}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate("HomeScreen")}>
                  <Image 
                    source={homeIcon} 
                    style={[styles.footerIcon, { tintColor: getIconColor("HomeScreen") }]} 
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.footerCenterSpacer} />
              <View style={styles.footerRightContent}>
                <Image 
                  source={leaderboardIcon} 
                  style={[styles.footerIcon, styles.footerRightIconFirst, { tintColor: getIconColor("LeaderboardScreen") }]} 
                  resizeMode="contain"
                />
                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate("ProfileScreen")}>
                  <Image 
                    source={profileIcon} 
                    style={[styles.footerIcon, styles.footerRightIcon, { tintColor: getIconColor("ProfileScreen") }]} 
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <TouchableOpacity 
            style={[
              styles.fabContainer,
              {
                left: screenWidth / 2 - 32, // Posição dinâmica baseada na largura da tela
              }
            ]} 
            activeOpacity={0.8} 
            onPress={() => navigation.navigate("AdminCreate")}
          >
            <Ionicons name="add" size={32} color="#FFFFFF" />
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.footer}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate("HomeScreen")}>
            <Image 
              source={homeIcon} 
              style={[styles.footerIcon, { tintColor: getIconColor("HomeScreen") }]} 
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8}>
            <Image 
              source={leaderboardIcon} 
              style={[styles.footerRightIconFirst, { tintColor: getIconColor("LeaderboardScreen"), marginLeft: 15 }]} 
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate("ProfileScreen")}>
            <Image 
              source={profileIcon} 
              style={[styles.footerRightIcon, { tintColor: getIconColor("ProfileScreen"), marginLeft: 0 }]} 
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      )}      
    </View>
  );
}

export default FooterNavigation;