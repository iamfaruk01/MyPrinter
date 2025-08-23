import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 100, textAlign: 'center' },
    subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40 },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginBottom: 20,
        width: '80%',
        alignItems: 'center'
    },
    qrContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        padding: 20,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    qrHelperText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        maxWidth: '80%',
    },
    discoverButton: { backgroundColor: '#34C759' },
    buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    stopButton: { backgroundColor: '#ff9500', position: 'absolute', bottom: 100 },
    logoutButton: {
        position: 'absolute',
        bottom: 40,
        backgroundColor: '#ff3b30',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25
    },
    logoutButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    statusText: { position: 'absolute', top: 60, fontSize: 16, color: '#333', fontWeight: 'bold' },
    section: {
        width: '100%',
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingTop: 10
    },
    // Add these styles
    messageScrollView: {
        flex: 1, // Ensures the scroll view takes up available space
        width: '100%',
        marginTop: 10,
        paddingHorizontal: 10,
    },
    messageContainer: {
        marginVertical: 4,
    },
    messageText: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 18,
        fontSize: 16,
        maxWidth: '80%',
    },
    sentMessage: {
        backgroundColor: '#007AFF', // Blue for sent messages
        color: '#ffffff',
        alignSelf: 'flex-end', // Aligns to the right
    },
    receivedMessage: {
        backgroundColor: '#E5E5EA', // Grey for received messages
        color: '#000000',
        alignSelf: 'flex-start', // Aligns to the left
    },
    subHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    device: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        width: '100%'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        width: '100%',
        minHeight: 40
    },
    message: {
        padding: 8,
        backgroundColor: '#e5e5ea',
        borderRadius: 10,
        marginTop: 5
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    infoText: {
        marginTop: 20,
        fontSize: 16,
        color: '#666'
    },
    emptyText: {
        fontSize: 14,
        color: '#999',
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 10
    },

});