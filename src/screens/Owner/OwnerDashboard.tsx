import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useHomeScreen } from "../Home/hooks/useHomeScreen";

const OwnerDashboard: React.FC = () => {
    const { handleLogout } = useHomeScreen();
    return (
        <View>
            <TouchableOpacity onPress={handleLogout}>
                <View>
                    <Text>Logout</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default OwnerDashboard