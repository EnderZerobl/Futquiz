import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#33CA7F",
    paddingBottom: 50,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 24,
  },
  form: {
    padding: 20,
  },
  label: {
    color: "#E8FFF3",
    marginBottom: 4,
    fontSize: 13,
  },
  input: {
    backgroundColor: "#3DDC91",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    color: "#fff",
  },
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2FAF73",
    padding: 14,
    borderRadius: 10,
    justifyContent: "center",
    marginTop: 10,
  },
  imageButtonDisabled: {
    opacity: 0.5,
  },
  imageButtonText: {
    color: "#fff",
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: "#1E8E5A",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  preview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 12,
  }
});