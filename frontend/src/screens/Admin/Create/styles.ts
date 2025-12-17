import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#33CA7F",
    paddingTop: 48,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },

  role: {
    color: "#E6FFF3",
    fontSize: 12,
    fontWeight: "600",
  },

  name: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },

  email: {
    color: "#D9FBEA",
    fontSize: 12,
    marginTop: 2,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  actions: {
    gap: 16,
  },

  card: {
    backgroundColor: "#2BA066",
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },

  cardTag: {
    color: "#D9FBEA",
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 6,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});