import React from "react"
import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"

const PublicWrapper: React.FC<{
    component: React.ReactNode
}> = (props) => {
    return (
        <React.Fragment>
            <Navbar />
            <main className="app-content" aria-label="Main content">
                {props.component}
            </main>
            <Footer />
        </React.Fragment>
    )
}

export default PublicWrapper
