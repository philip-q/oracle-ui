import React from "react";
import dateformat from "dateformat"
import {TIME_DATE_FORMAT} from "../constants/constants";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFile } from '@fortawesome/free-solid-svg-icons'

export class File extends React.Component {

    render() {
        const {name, size, modified, isDirectory} = this.props.file;
        return <div className={`File ${isDirectory ? "File--isDirectory" : ""}`} onDoubleClick={this.props.onDoubleClick}>
            <div className="File__stat File__stat--icon">{this.renderIcon()}</div>
            <div className="File__stat File__stat--name">{name}</div>
            <div className="File__stat File__stat--size">{size}</div>
            <div className="File__stat File__stat--modified">{dateformat(modified, TIME_DATE_FORMAT)}</div>
        </div>
    }

    renderIcon() {
      if(this.props.file.isDirectory) {
        return <FontAwesomeIcon icon={faFolder} />;
      }

      return this.getExtensionIcon();
    }

    getExtensionIcon() {
      return <FontAwesomeIcon icon={faFile} />;
    }

}