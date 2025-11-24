import { StyleSheet } from "react-native";

export default StyleSheet.create({
  quizCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    flexDirection: "row",
    gap: 12,
  },
  quizImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  quizDescription: {
    color: "#444",
    marginTop: 4,
  },
  tagContainer: {
    backgroundColor: "#0AAD60",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  quizTag: {
    color: "#fff",
    fontSize: 12,
  },
  buttonStart: {
    backgroundColor: "#0AAD60",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  buttonStartText: {
    color: "#fff",
    fontWeight: "bold",
  }
})