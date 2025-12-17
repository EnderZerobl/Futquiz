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
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 21,
  },
  closeIcon: {
    width: 26,
    height: 26,
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
  },
  emptyText: {
    color: "#E8FFF3",
    opacity: 0.6,
    textAlign: "center",
    marginTop: 20,
  },
  tagItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#2FA36B",
    marginBottom: 0,
  },
  tagText: {
    color: "#E8FFF3",
    fontSize: 14,
  },
})