import React from "react";

export class File extends React.Component {

    render() {
        const {name, extension, parendFolder, isDirectory, lastModificationTimestamp} = this.props;
        return <div className="File">
            <div className="File__name">{name}{extension}</div>
            <div className="File__modified">{lastModificationTimestamp}</div>
        </div>
    }

}