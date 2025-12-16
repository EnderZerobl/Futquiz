import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#33CA7F",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  timer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timerText: {
    color: "#fff",
    fontSize: 12,
  },
  subtitle: {
    marginVertical: 16,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  rankCard: {
    backgroundColor: "#1E8F5A",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rankLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  playerName: {
    color: "#fff",
    fontWeight: "600",
  },
  rankRight: {
    alignItems: "flex-end",
  },
  points: {
    color: "#fff",
    fontWeight: "bold",
  },
  time: {
    color: "#DFFFEF",
    fontSize: 12,
  },
  position: {
    backgroundColor: "#FFD700",
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  positionText: {
    fontWeight: "bold",
  },
});