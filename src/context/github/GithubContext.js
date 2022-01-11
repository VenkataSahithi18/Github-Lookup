import { createContext,useState,useEffect,useReducer } from "react";
import ReactDOM from 'react-router-dom'
import githubReducer from "./GithubReducer";
const GithubContext = createContext()

const GITHUB_URL=process.env.REACT_APP_GITHUB_URL
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN

export const GithubProvider=({children})=>{
    const initialState={
        users:[],
        loading:false,
        user:{},
        repos:[]
    }
   
    const [state,dispatch] = useReducer(githubReducer,initialState)
//Get users(testing purpose)
/*
const fetchUsers =async ()=>{
    setLoading()
    const response= await fetch(`${process.env.REACT_APP_GITHUB_URL}/users`,{
        headers:{
            Authorization:`token ${process.env.REACT_APP_GITHUB_TOKEN}`
        }
    })
    const data=await response.json()
    console.log(data)
*/

//Search Users
const searchUsers =async (text)=>{
    const params=new URLSearchParams({
        q:text
    })
    setLoading()
    console.log('URL:',GITHUB_URL)
    const response= await fetch(`${GITHUB_URL}/search/users?${params}`,{
        headers:{
            Authorization:`token ${GITHUB_TOKEN}`
        }
    })
    const {items}=await response.json()
   
   dispatch({
       type:'GET_USERS',
       payload:items,
   })
}

const getUser =async (login)=>{

    setLoading()
    console.log('URL:',GITHUB_URL)
    const response= await fetch(`${GITHUB_URL}/users/${login}`,{
        headers:{
            Authorization:`token ${GITHUB_TOKEN}`
        }
    })
    if(response.status === 404){
        window.location='/notfound'
    }
    else{
        const data=await response.json()
        dispatch({
            type:'GET_USER',
            payload:data,
        })
    }
   
}

const getUserRepos =async (login)=>{
    const params=new URLSearchParams({
        sort:'created',
        per_page:10
    })
    setLoading()
    console.log('URL:',GITHUB_URL)
    const response= await fetch(`${GITHUB_URL}/users/${login}/repos?${params}`,{
        headers:{
            Authorization:`token ${GITHUB_TOKEN}`
        }
    })
    const data=await response.json()
   
   dispatch({
       type:'GET_REPOS',
       payload:data,
   })
}
const clearUsers =()=>{
    dispatch({
        type:'CLEAR_USERS'
    })
}


const setLoading =()=>dispatch({type:'SET_LOADING'})

//value={{users:state.users,user:state.user,repos:state.repos,getUserRepos,getUser,clearUsers,searchUsers,loading:state.loading,}}>
return <GithubContext.Provider value={{...state,getUserRepos,getUser,clearUsers,searchUsers,}}>
    {children}
</GithubContext.Provider>
}

export default GithubContext