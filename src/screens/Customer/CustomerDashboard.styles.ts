import { StyleSheet } from "react-native";

const COLOR = {
  background: "#f5f5f5",
  surface: "#ffffff",
  textPrimary: "#222222",
  textSecondary: "#666666",
  danger: "#ff3b30",
  accent: "#007aff",
};

const SPACING = {
  page: 20,
  small: 8,
  medium: 16,
  large: 24,
};

const RADIUS = {
  button: 12,
  card: 8,
};

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLOR.background,
  },
  container: {
    flex: 1,
    padding: SPACING.page,
  },

  /* Camera container - positioned at top center */
  cameraContainer: {
    position: 'absolute',
    top: SPACING.page,
    left: SPACING.page,
    right: SPACING.page,
    // height: '40%', // Adjust height as needed
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 50,
  },

  /* Center content - takes up middle space */
  centerContent: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.large,
    backgroundColor: COLOR.surface,
    borderRadius: RADIUS.card,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: SPACING.large,
  },

  title: {
    fontSize: 18,
    color: COLOR.textPrimary,
    fontWeight: "600",
    marginBottom: SPACING.medium,
    textAlign: "center",
  },

  helperText: {
    marginTop: SPACING.small,
    fontSize: 14,
    color: COLOR.textSecondary,
    textAlign: "center",
  },

  /* Primary action */
  primaryButton: {
    width: "100%",
    paddingVertical: SPACING.medium,
    borderRadius: RADIUS.button,
    backgroundColor: COLOR.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },

  /* Footer - always at bottom */
  footer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  logoutButton: {
    width: "60%",
    paddingVertical: SPACING.medium,
    borderRadius: 999, // pill
    backgroundColor: COLOR.danger,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});