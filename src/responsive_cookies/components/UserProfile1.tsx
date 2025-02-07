"use client";
import React from 'react'
import {useCookieState} from '../../library/useCookieState'

import {hri} from "human-readable-ids"


interface User {
  name: string
  age: number
}


const defaultUser: User = { name: 'John Doe', age: 30 }


export function UserProfile1() {

  const [userText, setUser, deleteUser] = useCookieState('user-1', JSON.stringify(defaultUser))
  const [serverCookie] = useCookieState('server-cookie', "default-value-for-server-cookie")

  const handleUpdateUser = () => {
    setUser(JSON.stringify({ name:hri.random() , age: 25 }))
  }

  const handleDeleteUser = () => {
    deleteUser()
  }

  
  let user: User |null; 
  try {
    if (userText === null){
      user = null;
    }
    else {
      user = JSON.parse(userText)
    }
  }catch{
    user = null;
  }

  return (
    <div>
      <p>Name: {user?.name}</p>
      <p>Age: {user?.age}</p>
      <p>Server cookie: {serverCookie}</p>
      <button type="button" onClick={handleUpdateUser}>Update User</button>
      <button type="button" onClick={handleDeleteUser}>Delete User</button>

      <button type="button" onClick={() => {
        fetch('/demos/req1').then(v => v.json()).then(v => console.log(v))
      }}>Server Fetch</button>
    </div>
  )
}

