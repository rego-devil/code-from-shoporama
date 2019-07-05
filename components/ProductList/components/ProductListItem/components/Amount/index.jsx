import React from 'react';
import {FormGroup, InputGroup, FormControl} from 'react-bootstrap';
import styles from './Amount.scss';

const Amount = (props) => {
	let { input: {value}, type, placeholder, changeValue } = props;

	return ( 
		<InputGroup className={`${styles.amountInput} ${props.className}`}>
			<FormControl 
				{...props.input}
				value={value}
				type={type || 'text'}
				placeholder={placeholder || ''}
				// onBlur={(value) => props.input.onBlur('ddd')}
				// onBlur={e => value = 'dddd'}
			/>
			<InputGroup.Addon className={``}>pezzi</InputGroup.Addon>
		</InputGroup>
	)
};

export default Amount;