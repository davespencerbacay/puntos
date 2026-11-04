import { Outlet, } from 'react-router-dom'

import './Portal.scss'
import { Box } from '@mui/material'

const Portal = () => {
    return (
        <Box className="portal-layout">
            <main className="portal-layout__content">
                <Outlet />
            </main>
        </Box>
    )
}

export default Portal