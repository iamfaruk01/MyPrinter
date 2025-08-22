import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

const COLORS = {
    // Google Pay inspired colors
    primary: "#1a73e8", // Google Blue
    background: "#f8f9fa", // Light gray background
    surface: "#ffffff",
    surfaceVariant: "#f1f3f4",
    onSurface: "#202124",
    onSurfaceVariant: "#5f6368",
    outline: "#dadce0",
    success: "#34a853",
    error: "#ea4335",
    warning: "#fbbc04",
    // Scanner colors
    scannerBg: "#000000",
    scannerOverlay: "rgba(0, 0, 0, 0.7)",
    scanFrame: "#1a73e8",
};

const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

const TYPOGRAPHY = {
    h1: 24,
    h2: 20,
    h3: 18,
    body: 16,
    caption: 14,
    small: 12,
};

const RADIUS = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 999,
};

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    // Main Dashboard Styles
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: COLORS.background,
    },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },

    message: {
        padding: 8,
        backgroundColor: '#e5e5ea',
        borderRadius: 10,
        marginTop: 5
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.outline,
    },

    headerTitle: {
        fontSize: TYPOGRAPHY.h2,
        fontWeight: "600",
        color: COLORS.onSurface,
    },

    profileButton: {
        padding: SPACING.xs,
    },

    profileIcon: {
        width: 36,
        height: 36,
        borderRadius: RADIUS.full,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
    },

    profileInitial: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: "600",
        color: COLORS.surface,
    },

    mainContent: {
        flex: 1,
        padding: SPACING.lg,
    },

    // QR Scan Card
    scanCard: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.lg,
        padding: SPACING.xl,
        alignItems: "center",
        marginBottom: SPACING.xl,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },

    scanIcon: {
        width: 80,
        height: 80,
        borderRadius: RADIUS.lg,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: SPACING.lg,
    },

    qrIconFrame: {
        width: 40,
        height: 40,
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
    },
    // Add these new styles to your existing StyleSheet.create({...}) call

    statusTextLarge: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    // chatContainer: {
    //     flex: 1,
    //     width: '100%',
    //     padding: 10,
    // },
    // messageScrollView: {
    //     flex: 1,
    //     width: '100%',
    // },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        backgroundColor: '#fff',
    },
    // input: {
    //     flex: 1,
    //     height: 40,
    //     borderWidth: 1,
    //     borderColor: '#ccc',
    //     borderRadius: 20,
    //     paddingHorizontal: 15,
    //     marginRight: 10,
    //     backgroundColor: '#fff',
    // },
    // messageText: {
    //     paddingVertical: 8,
    //     paddingHorizontal: 12,
    //     backgroundColor: '#e5e5ea',
    //     borderRadius: 15,
    //     marginTop: 5,
    //     maxWidth: '80%',
    //     alignSelf: 'flex-start', // Differentiates peer messages
    // },
    transferSection: {
        marginVertical: 10,
        paddingHorizontal: 16,
    },
    transferSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    transferScrollView: {
        maxHeight: 150, // Limit height so it doesn't take up too much space
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 8,
    },

    // Action Button Container
    actionButtonContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    sendFileButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    sendFileButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },

    // Improved Input Container
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        maxHeight: 100,
        backgroundColor: '#f8f9fa',
    },
    sendButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        minWidth: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },

    // Chat Container Improvements
    chatContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    messageScrollView: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    messageText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
        padding: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        alignSelf: 'flex-start',
        maxWidth: '80%',
    },
    qrDot: {
        width: 8,
        height: 8,
        backgroundColor: COLORS.surface,
        margin: 2,
        borderRadius: 2,
    },

    scanCardTitle: {
        fontSize: TYPOGRAPHY.h2,
        fontWeight: "600",
        color: COLORS.onSurface,
        marginBottom: SPACING.sm,
        textAlign: "center",
    },

    scanCardSubtitle: {
        fontSize: TYPOGRAPHY.caption,
        color: COLORS.onSurfaceVariant,
        textAlign: "center",
        lineHeight: 20,
    },

    // Quick Actions
    quickActions: {
        flex: 1,
    },

    sectionTitle: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: "600",
        color: COLORS.onSurface,
        marginBottom: SPACING.md,
    },

    actionItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },

    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.surfaceVariant,
        alignItems: "center",
        justifyContent: "center",
        marginRight: SPACING.md,
    },

    actionIconText: {
        fontSize: 20,
    },

    actionContent: {
        flex: 1,
    },

    actionTitle: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: "500",
        color: COLORS.onSurface,
        marginBottom: SPACING.xs,
    },

    actionSubtitle: {
        fontSize: TYPOGRAPHY.small,
        color: COLORS.onSurfaceVariant,
    },

    // Scanner Styles
    scannerContainer: {
        flex: 1,
        backgroundColor: COLORS.scannerBg,
    },

    scannerHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
    },

    backButton: {
        width: 40,
        height: 40,
        borderRadius: RADIUS.full,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        alignItems: "center",
        justifyContent: "center",
    },

    backButtonText: {
        fontSize: 24,
        color: COLORS.surface,
        fontWeight: "300",
    },

    scannerTitle: {
        fontSize: TYPOGRAPHY.h3,
        fontWeight: "500",
        color: COLORS.surface,
    },

    headerSpacer: {
        width: 40,
    },

    cameraWrapper: {
        flex: 1,
        position: "relative",
    },

    scannerOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
    },

    scanFrame: {
        width: 250,
        height: 250,
        position: "relative",
    },

    corner: {
        position: "absolute",
        width: 30,
        height: 30,
        borderColor: COLORS.scanFrame,
        borderWidth: 4,
    },

    topLeft: {
        top: 0,
        left: 0,
        borderBottomWidth: 0,
        borderRightWidth: 0,
    },

    topRight: {
        top: 0,
        right: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
    },

    bottomLeft: {
        bottom: 0,
        left: 0,
        borderTopWidth: 0,
        borderRightWidth: 0,
    },

    bottomRight: {
        bottom: 0,
        right: 0,
        borderTopWidth: 0,
        borderLeftWidth: 0,
    },

    scannerBottom: {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.xl,
        alignItems: "center",
    },

    scannerInstruction: {
        fontSize: TYPOGRAPHY.body,
        color: COLORS.surface,
        textAlign: "center",
        marginBottom: SPACING.sm,
        fontWeight: "500",
    },

    scannerSubtext: {
        fontSize: TYPOGRAPHY.caption,
        color: "rgba(255, 255, 255, 0.7)",
        textAlign: "center",
    },

    // Connected State Styles
    connectedHeader: {
        backgroundColor: COLORS.surface,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.lg,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: COLORS.outline,
    },

    connectedTitle: {
        fontSize: TYPOGRAPHY.h2,
        fontWeight: "600",
        color: COLORS.onSurface,
        marginBottom: SPACING.sm,
    },

    connectionStatus: {
        flexDirection: "row",
        alignItems: "center",
    },

    statusDot: {
        width: 8,
        height: 8,
        borderRadius: RADIUS.full,
        backgroundColor: COLORS.success,
        marginRight: SPACING.sm,
    },

    statusText: {
        fontSize: TYPOGRAPHY.caption,
        color: COLORS.success,
        fontWeight: "500",
    },

    connectionActions: {
        backgroundColor: COLORS.surface,
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.outline,
    },

    primaryActionButton: {
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.md,
        paddingVertical: SPACING.md,
        alignItems: "center",
        marginBottom: SPACING.md,
    },

    primaryActionText: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: "600",
        color: COLORS.surface,
    },

    secondaryActionButton: {
        backgroundColor: COLORS.surfaceVariant,
        borderRadius: RADIUS.md,
        paddingVertical: SPACING.md,
        alignItems: "center",
    },

    secondaryActionText: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: "500",
        color: COLORS.onSurfaceVariant,
    },

    messageArea: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingHorizontal: SPACING.lg,
    },

    messageAreaTitle: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: "600",
        color: COLORS.onSurface,
        marginTop: SPACING.lg,
        marginBottom: SPACING.md,
    },
});