import React from "react";

interface CheckboxProps {
	checked: boolean;
	onChange: (nextChecked: boolean) => void;
	className?: string;
}

export default class Checkbox extends React.Component<CheckboxProps> {
	
	render() {
		const {checked, onChange, className} = this.props;
		return <span className={`Checkbox ${className}`}>
			<i className={`fas ${checked ? "fa-check-square" : "fa-square"}`} onClick={() => onChange(!checked)}/>
		</span>
	}
	
}
