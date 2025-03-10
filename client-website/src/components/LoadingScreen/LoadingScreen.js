import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import styled from 'styled-components';
import { Icon } from '@mui/material';
import "./LoadingScreen.css";


export default function LoadingScreen() {
	const [open] = React.useState(true);

	return (
		<div>
			<Backdrop
				sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={open}
				
			>
				<div class="loader"></div>
			</Backdrop>
		</div>
	);
}
