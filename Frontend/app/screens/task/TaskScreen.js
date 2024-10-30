import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';

const TaskScreen = () => {
  const tableHead = ['Task', 'Deadline', 'Progress'];
  const tableData = [
    ['2', '3', '4'],
    ['b', 'c', 'd'],
    [ '2', '3', '45'],
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>New Project</Text>
      <Table borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }}>
        <Row data={tableHead} style={styles.head} textStyle={styles.text} />
        <Rows data={tableData} textStyle={styles.text} />
      </Table>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6,textAlign: 'center' },
});

export default TaskScreen;
