//import liraries
import React, {useRef, useState, useMemo, useCallback, useReducer } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import UserList from './components/UserList';
import CreateUser from './components/CreateUser';

// create a component
function countActiveUsers(users) {
  console.log('활성 사용자 수를 세는중...');
  return users.filter(user => user.active).length;
}
const initialState = {
  inputs: {
    username: '',
    email: ''
  },
  users: [
    {
      id: 1,
      username: 'velopert',
      email: 'public.velopert@gmail.com',
      active: true
    },
    {
      id: 2,
      username: 'tester',
      email: 'tester@example.com',
      active: false
    },
    {
      id: 3,
      username: 'liz',
      email: 'liz@example.com',
      active: false
    }
  ]
};

function reducer(state, action) {
  switch (action.type) {
    case 'CHANGE_INPUT':
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.name]: action.value
        }
      }
    case 'CREATE_USER':
      return {
        inputs: initialState.inputs,
        users: [...state.users, action.user]
      }
    case 'TOGGLE_USER':
      return {
        ...state,
        users: state.users.map(user => user.id == action.id ? {...user, active: !user.active} : user)
      };
    case 'REMOVE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id != action.id)
      }
    default:
      return state;
      }
  }

function App() {

  const [state, dispatch] = useReducer(reducer, initialState);
  const { users } = state;
  const { username, email} = state.inputs;

  const nextId = useRef(4);
  
  const onChange = useCallback((keyvalue, e) => {
    dispatch({
      type: 'CHANGE_INPUT',
      name: keyvalue,
      value: e,
    })
  }, []);

  const onCreate = useCallback(() => {
    dispatch({
      type: 'CREATE_USER',
      user: {
        id: nextId.current,
        username,
        email,
      }
    })
    nextId.current += 1;
  }, [username, email])

  const onToggle = useCallback((id) => {
    dispatch({
      type: 'TOGGLE_USER',
      id
    });
  }, [])

  const onRemove = useCallback((id) => {
    dispatch({
      type: 'REMOVE_USER',
      id
    })
  })

  const count = useMemo(() => countActiveUsers(users), [users]);
  return (
    <View style={styles.container}>
      <Text style={styles.headertext}>Use Reducer</Text>
      <Text style={styles.bodytext}>Number of Active Users : {count}</Text>
      <CreateUser 
        username={username} 
        email={email}
        onChange={onChange}
        onCreate={onCreate}
      />
      <UserList 
        users={users}
        onToggle={onToggle}
        onRemove={onRemove} 
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
  headertext: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  bodytext: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  }
});

//make this component available to the app
export default App;
