import React from "react";
import {File} from "./File";

export class FileBrowser extends React.Component {

    render() {
        const {files} = this.props;
        return <div className="FileBrowser">
            {files.map(file => <File {...file} />)}
        </div>
    }

}