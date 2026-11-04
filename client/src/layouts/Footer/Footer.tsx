
import {
	Box,
	Container,
	Link,
	Typography,
} from "@mui/material";

interface FooterLinkItem {
	label: string;
	href: string;
}

interface FooterSection {
	title: string;
	links: FooterLinkItem[];
}

const footerSections: FooterSection[] = [
	{
		title: "Product",
		links: [
			{ label: "Loyalty & Membership", href: "#" },
			{ label: "Promotions and Incentives", href: "#" },
			{ label: "Loyalty AI", href: "#" },
			{ label: "Points Economy", href: "#" },
			{ label: "Tier Management", href: "#" },
			{ label: "Workflows", href: "#" },
			{ label: "Rewards", href: "#" },
			{ label: "Challenges", href: "#" },
			{ label: "Digital Wallet", href: "#" },
			{ label: "Gamification and Referrals", href: "#" },
			{ label: "Receipt Scanning", href: "#" },
			{ label: "Security", href: "#" },
			{ label: "Data Management and Compliance", href: "#" },
			{ label: "Performance", href: "#" },
			{ label: "Integrations", href: "#" },
		],
	},
	{
		title: "Industries",
		links: [
			{ label: "Retail", href: "#" },
			{ label: "Shopping Malls", href: "#" },
			{ label: "Food & Beverage", href: "#" },
			{ label: "Fashion", href: "#" },
			{ label: "CPG", href: "#" },
			{ label: "eCommerce", href: "#" },
		],
	},
	{
		title: "Resources",
		links: [
			{ label: "Loyalty Blog", href: "#" },
			{ label: "Ebooks", href: "#" },
			{ label: "Events", href: "#" },
			{ label: "Growth Fund", href: "#" },
			{ label: "Video Library", href: "#" },
			{ label: "Puntos vs Talon.One", href: "#" },
			{ label: "Puntos vs LoyaltyLion", href: "#" },
			{ label: "Puntos vs Voucherify", href: "#" },
			{ label: "API Documentation", href: "#" },
			{ label: "User Manual", href: "#" },
			{ label: "Release Notes", href: "#" },
			{ label: "Sitemap", href: "#" },
			{ label: "Status", href: "#" },
		],
	},
	{
		title: "Company",
		links: [
			{ label: "Careers", href: "#" },
			{ label: "About Us", href: "#" },
			{ label: "News", href: "#" },
			{ label: "Newsletter", href: "#" },
			{ label: "Contact Us", href: "#" },
			{ label: "Support", href: "#" },
			{ label: "Pricing", href: "#" },
			{ label: "Book a call", href: "#" },
		],
	},
];

const Footer = () => {
	return (
		<Box
			component="footer"
			aria-label="Footer"
			sx={{
				backgroundColor: "#171035",
				color: "#fff",
				py: { xs: 5, md: 6 },
			}}
		>
			<Container
				maxWidth="xl"
			>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: {
							xs: "1fr",
							xl: "220px minmax(680px, 1fr) 320px",
						},
						gap: { xs: 4, md: 5 },
					}}
				>
					{/* Brand */}
					<Box>
						<Link href="/" aria-label="Puntos home" underline="none">
							<Typography
								component="span"
								sx={{
									color: "#FFE02E",
									fontWeight: 800,
									fontSize: { xs: "2rem", md: "2.8rem" },
									lineHeight: 0.95,
									textTransform: "lowercase",
								}}
							>
								puntos
							</Typography>
						</Link>
					</Box>

					{/* Footer Navigation */}
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: {
								xs: "1fr",
								md: "repeat(2, minmax(0, 1fr))",
								xl: `
									minmax(360px, 1.25fr)
									minmax(160px, 0.7fr)
									minmax(220px, 0.95fr)
									minmax(140px, 0.7fr)
								`,
							},
							gap: { xs: 3, md: 4 },
						}}
					>
						{footerSections.map((section) => (
							<Box component="section" key={section.title}>
								<Typography
									component="h2"
									sx={{
										m: 0,
										mb: 1.75,
										fontWeight: 700,
										fontSize: {
											xs: "1.4rem",
											md: "1.8rem",
										},
										lineHeight: 1.15,
									}}
								>
									{section.title}
								</Typography>

								<Box
									component="ul"
									sx={{
										m: 0,
										p: 0,
										listStyle: "none",
										display: "grid",
										rowGap: 1,
										columnGap: {
											xs: 0,
											xl:
												section.title === "Product"
													? 4
													: 0,
										},
										gridTemplateColumns: {
											xs: "1fr",
											xl:
												section.title === "Product"
													? "repeat(2, minmax(0, 1fr))"
													: "1fr",
										},
									}}
								>
									{section.links.map((link) => (
										<Box
											component="li"
											key={`${section.title}-${link.label}`}
										>
											<Link
												href={link.href}
												underline="none"
												sx={{
													color: "#9f9bc5",
													fontSize: {
														xs: "1rem",
														md: "1.1rem",
													},
													lineHeight: 1.38,
													transition:
														"color .18s ease",
													"&:hover, &:focus-visible": {
														color: "#fff",
													},
												}}
											>
												{link.label}
											</Link>
										</Box>
									))}
								</Box>
							</Box>
						))}
					</Box>


				</Box>
			</Container>
		</Box>
	);
};

export default Footer;
