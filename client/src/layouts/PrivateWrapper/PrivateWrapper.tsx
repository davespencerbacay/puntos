
import React from "react"
import { Container, Grid } from "@mui/material"

import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"
import Sidebar from "../Sidebar/Sidebar"

import "./PrivateWrapper.scss"
import { Outlet } from "react-router-dom"

const PrivateWrapper: React.FC = () => {
    return (
        <React.Fragment>
            <Navbar />

            <main className="app-content" aria-label="Main content">
                <Container maxWidth="xl">
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 3, lg: 3 }}>
                            <Sidebar />
                        </Grid>

                        <Grid size={{ xs: 12, md: 9, lg: 9 }}>
                            <Outlet />
                        </Grid>
                    </Grid>
                </Container>
            </main>

            <Footer />
        </React.Fragment>
    )
}

export default PrivateWrapper
