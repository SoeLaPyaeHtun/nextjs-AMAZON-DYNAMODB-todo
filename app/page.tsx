"use client";
import { useEffect, useState } from 'react';
import { listTodos } from '../src/graphql/queries';
import { createTodo, deleteTodo, updateTodo } from '../src/graphql/mutations';
import { API } from 'aws-amplify';
import { Amplify } from "aws-amplify";
import config from "../src/aws-exports";

import uuid from 'react-uuid';


Amplify.configure(config)


export default function Home() {

  const [ todos , setTodo ] = useState([])
  const [ data , setData ] = useState({
    id : uuid(),
    description : "Desc",
    name : "task"
  })

  const [ editmode , setEditMode ] = useState("")
  useEffect(() => {
    fetchData();
    
  },[])

  const fetchData = async () => {
    const todoDatas = await API.graphql({
      query : listTodos,
      
    })
    setTodo(todoDatas.data.listTodos.items)
  }

  const addtodo = () => {
   
    API.graphql({
      query : createTodo,
      variables: { input: data },
    })

    setTodo([data,...todos])
  }

  const deletetodo = (_id) => {
    API.graphql({
      query : deleteTodo,
      variables : {
        input : {
          id : _id
        }
      } 
    })
    setTodo(todos.filter(todo => todo.id !== _id));
  
  }

  const edittodo = (_todo) => {
    _todo.name = data.name
    console.log(_todo)
    API.graphql({
      query : updateTodo,
      variables: { input: {
        id: _todo.id,
        name: data.name
      } },
    })

    const newList = todos.map(todo => {
      if(todo.id == _todo.id){
        return {...todo, name: data.name}
      }
      return todo
    })

    setTodo(newList)
    setEditMode("")

  }
 
  const handleInput = (e) => {
    data.name = e.target.value;
  }

  return (
   <div>
    <h1>Todo List</h1>
    <input type='text' onChange={e => handleInput(e)} />
    <button onClick={addtodo}>Add Todo</button>
    {
      todos.map((todo, index) => (
        editmode == todo.id ?  <p key={index}> <input type='text' defaultValue={todo.name} onChange={e => handleInput(e)} />
        <button onClick={() => edittodo(todo)}>update</button> <button onClick={() => setEditMode("")}>cancel</button> </p> 
        :
        <p key={index}> {todo.id} -- {todo.name} <button onClick={() => deletetodo(todo.id)}>delete</button> 
       <button onClick={() => setEditMode(todo.id)}>edit</button> </p> 
        
      ))
    }
   </div>
  )
}

