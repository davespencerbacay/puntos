import { Box, Button, Container, Typography } from '@mui/material'
import './Welcome.scss'

const Welcome = () => {
    return (
        <Box component="section" className="welcome-hero" aria-label="Welcome section">
            <Box className="welcome-hero__glow welcome-hero__glow--left" aria-hidden="true" />
            <Box className="welcome-hero__glow welcome-hero__glow--right" aria-hidden="true" />

            <Container maxWidth="lg" className="welcome-hero__container">
                <Box className="welcome-hero__content">
                    <Typography component="h1" className="welcome-hero__title">
                        Reward loyalty. Build relationships.{' '}
                        <span className="welcome-hero__title-accent">Grow together.</span>
                    </Typography>

                    <Typography component="p" className="welcome-hero__description">
                        Build stronger customer relationships with Puntos. Reward loyal customers,
                        increase repeat purchases, and grow your business with a loyalty platform made
                        simple.
                    </Typography>

                    <Box className="welcome-hero__actions">
                        <Button className="welcome-hero__btn welcome-hero__btn--primary" variant="contained" disableElevation>
                            Book a call
                        </Button>
                        <Button className="welcome-hero__btn welcome-hero__btn--secondary" variant="outlined">
                            Take your test
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    )
}

export default Welcome
