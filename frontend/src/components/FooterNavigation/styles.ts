import { StyleSheet } from "react-native";

export default StyleSheet.create({
  footerContainer: {
    position: "absolute",
    bottom: -12,
    left: 0,
    right: 0,
    width: "100%",
    backgroundColor: "#fff"
  },
  footer: {
    width: "100%",
    height: 70,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around"
  },
  fabContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0AAD60",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -30, // sobe o botão (efeito flutuante)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  }  
})