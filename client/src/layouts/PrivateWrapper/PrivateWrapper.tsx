import React from "react"
import { Container } from "@mui/material"

import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"
import "./PrivateWrapper.scss"

const PrivateWrapper: React.FC<{
    component: React.ReactNode
}> = (props) => {
    return (
        <React.Fragment>
            <Navbar />
            <main className="app-content" aria-label="Main content">
                <Container maxWidth="xl" disableGutters>
                    {props.component}
                </Container>
            </main>
            <Footer />
        </React.Fragment>
    )
}

export default PrivateWrapper
