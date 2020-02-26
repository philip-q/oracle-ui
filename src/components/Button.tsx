import React from "react";

interface ButtonProps {
	text: string;
	onClick: () => void;
}

export default class Button extends React.Component<ButtonProps , any> {
	
	render() {
		const {text, onClick} = this.props;
		return <button className="Button" onClick={onClick}>
			{text}
		</button>
	}
	
}
