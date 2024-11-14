import React, { useEffect } from 'react'
import AppNavigation from './src/navigation'
import { apiCall } from './src/api/OpenAi';
export default function App() {
  useEffect(()=>{
    apiCall('what is a super computer?')
  },[])
  return (
   <AppNavigation/>
  )
}