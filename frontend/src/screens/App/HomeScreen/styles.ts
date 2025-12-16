import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0AAD60",
    paddingTop: 50,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerHello: {
    color: "#eee",
    fontSize: 12,
  },
  headerName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerEmail: {
    color: "#eee",
    fontSize: 12,
  },

  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  filterLabel: {
    color: "#fff",
    fontSize: 16,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    color: "#E8FFF3",
    fontSize: 16,
    opacity: 0.7,
  }
})