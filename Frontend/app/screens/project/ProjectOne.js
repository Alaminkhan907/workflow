import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Checkbox } from "react-native-paper";

const Example = () => {
  const [checked, setChecked] = React.useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Task Completed</Text>
      <Checkbox
        status={checked ? "checked" : "unchecked"}
        onPress={() => {
          setChecked(!checked);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 18,
    marginBottom: 12,
  },
});

export default Example;
