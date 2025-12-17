import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        backgroundColor: "#33CA7F",
        flexGrow: 1,
        paddingHorizontal: 20,
    },
    header: {
        paddingTop: 50,
        paddingHorizontal: 0,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    headerTitle: {
        flex: 1,
        textAlign: "center",
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        marginRight: 24,
    },
    title: {    
        paddingTop: 50,
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
    },
    radio: {
        color: "#E8FFF3",
        marginBottom: 10,
    },
    radioDisabled: {
        color: "#E8FFF3",
        opacity: 0.5,
    },
    disabledOption: {
        marginBottom: 10,
    },
    comingSoon: {
        fontSize: 12,
        opacity: 0.7,
    },
    label: {
        paddingTop: 50,
        color: "#E8FFF3",
        marginVertical: 10,
    },
    input: {
        backgroundColor: "#3DDC91",
        borderRadius: 10,
        padding: 14,
        color: "#fff",
        marginBottom: 12,
    },
    tag: {
        backgroundColor: "#2FAF73",
        padding: 10,
        borderRadius: 20,
        marginBottom: 6,
    },
    tagSelected: {
        backgroundColor: "#1E8E5A",
    },
    tagText: {
        color: "#fff",
        fontSize: 12,
    },
    questionCard: {
        backgroundColor: "#2FAF73",
        borderRadius: 10,
        padding: 12,
        marginBottom: 8,
    },
    questionSelected: {
        backgroundColor: "#1E8E5A",
    },
    questionText: {
        color: "#fff",
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
    teamItem: {
        padding: 12,
        borderRadius: 10,
        backgroundColor: "#2FA36B",
        marginBottom: 10,
    },    
    teamSelected: {
        borderWidth: 2,
        borderColor: "#FFD700",
    },    
    teamName: {
        color: "#E8FFF3",
        fontSize: 14,
        fontWeight: "600",
    },
});