"use client";
import { useEffect, useState } from 'react';
import { listTodos } from '../src/graphql/queries';
import { API } from 'aws-amplify';
import { Amplify } from "aws-amplify";
import config from "../src/aws-exports";

Amplify.configure(config)


export default function Home() {

  const [ todos , setTodo ] = useState([])
  useEffect(() => {
    fetchData();
    
  },[])

  const fetchData = async () => {
    const todoDatas = await API.graphql({
      query : listTodos
    })
    setTodo(todoDatas.data.listTodos.items)
  }

 

  return (
   <div>
    <h1>Todo List</h1>
    {
      todos.map((todo, index) => (
        <p key={index}>{todo.name}</p>
      ))
    }
   </div>
  )
}

