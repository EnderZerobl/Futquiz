import { StyleSheet } from "react-native";

export default StyleSheet.create({
  sidebar: {
    position: "absolute",
    top: 0,
    height: "100%",
    width: 200,
    backgroundColor: "#0A9152",
    paddingTop: 100,
    paddingHorizontal: 20,
    zIndex: 20,
  },
  sidebarTitle: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 20,
  },
  filterItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 18,
  },
  filterText: {
    color: "#fff",
    fontSize: 14,
  }
})