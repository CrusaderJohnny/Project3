import { Button, View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useState } from "react";
import CallAPI from "../components/callAPI";

export default function App() {
const [isSignedIn, setIsSignedIn] = useState<boolean>(true);
return (
    <CallAPI/>
);
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
},
});
