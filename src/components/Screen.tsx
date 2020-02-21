import React from "react";

interface ScreenProps {
	onClose: () => void;
	title: string;
}

export default class Screen extends React.Component<ScreenProps, any> {
	
	render() {
		return <div className="Screen">
			<div className="Screen__header">
				<span className="Screen__title">{this.props.title}</span>
				<span className="Screen__close" onClick={this.props.onClose}>
					<i className="fas fa-times"/>
				</span>
			</div>
			<div className="Screen__content">
				{this.props.children}
			</div>
		</div>
	}
	
}
