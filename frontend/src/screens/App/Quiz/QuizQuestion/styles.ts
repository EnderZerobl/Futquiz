import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#39C67D",
    paddingHorizontal: 20,
  },

  counter: {
    paddingTop: 40,
    color: "#E8FFF3",
    textAlign: "center",
    marginBottom: 12,
  },

  timer: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },

  question: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },

  option: {
    backgroundColor: "#2FA567",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },

  optionCorrect: {
    backgroundColor: "#27ae60"
  },

  optionWrong: {
    backgroundColor: "#e74c3c"
  },

  optionSelected: {
    borderWidth: 2,
    borderColor: "#fff",
  },

  optionText: {
    color: "#fff",
    textAlign: "center",
  },

  exitButton: {
    marginTop: 24,
    alignSelf: "center",
  },

  modal: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },

  confirm: {
    backgroundColor: "#39C67D",
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },
});