import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { Container } from '@mui/material';
import BasicTabs from '../Components/AdminTabs';
// import CopyRight from '../../Components/CopyRight/CopyRight'
import DesktopNavigation from '../../Navigation/DesktopNavigation';
import CopyRight from '../Components/CopyRight/CopyRight';

const AdminHomePage = () => {
    const [user, setUser] = useState([]);
    const [isAdmin, setAdmin] = useState(false);
    console.log(isAdmin)

    useEffect(() => {
        getUser();
    }, [])
    let navigate = useNavigate()
    let authToken = localStorage.getItem("Authorization")
    const getUser = async () => {

        // if (!authToken){
        //     navigate('/admin/login')
        // }
        try {
            const { data } = await axios.get(`http://localhost:6464/user/getUser`, {
                headers: {
                    'Authorization': authToken
                }
            })
            console.log(data)
               const isAdmin = data.data.role === "admin";
               
            setUser(data.data)
            setAdmin(isAdmin)
            !isAdmin && navigate('/admin/login')
        } catch (error) {
            !isAdmin && navigate('/admin/login')
            
          
            // toast.error(error.response.data, { autoClose: 500, theme: "colored" });
        }
    }
    return (
        <>
            {isAdmin && (
                <>
                 <DesktopNavigation />
                <Container maxWidth="100%" >
                    <h1 style={{ textAlign: "center", margin: "20px 0", color: "#1976d2" }}>Dashboard </h1>
                    <BasicTabs user={user} getUser={'getUser'} />
                </Container>
                </>)}
            <CopyRight sx={{ mt: 8, mb: 10 }} />

        </>
    )
}

export default AdminHomePage