import { Link, router } from "expo-router";
import { StyleSheet, Text, View, Pressable } from "react-native";

const Home = () => {
  return (
    <View style={styles.container}>
      <Text>Welcome to the Home Screen!</Text>
      <Link href="/users/1"> Go to users 1 </Link>
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/users/[id]",
            params: { id: 2 },
          })
        }
      >
        <Text>Go to users 2</Text>
      </Pressable>
    </View>
  );
};
export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9c2ff",
  },
});
