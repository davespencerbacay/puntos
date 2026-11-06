import { Box } from '@mui/material'
import React from 'react'

const MainWrapper: React.FC<{
    children: React.ReactNode
}> = (props) => {
    return (
        <Box>
            {props.children}
        </Box>
    )
}

export default MainWrapper
