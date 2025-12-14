import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    backgroundColor: "#33CA7F",
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  header: {
    paddingTop: 50,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 24,
  },
  label: {
    color: "#E8FFF3",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#3DDC91",
    borderRadius: 10,
    padding: 14,
    color: "#fff",
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  optionBox: {
    width: "48%",
    backgroundColor: "#2FAF73",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  optionTitle: {
    color: "#E8FFF3",
    fontSize: 12,
    marginBottom: 6,
  },
  optionInput: {
    backgroundColor: "#3DDC91",
    borderRadius: 8,
    padding: 10,
    color: "#fff",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2FAF73",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagSelected: {
    backgroundColor: "#1E8E5A",
  },
  tagImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  tagText: {
    color: "#fff",
    fontSize: 12,
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
});