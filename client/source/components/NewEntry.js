import React from 'react'
import PropTypes from 'prop-types'

class NewEntry extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
        props.entryKeys.forEach(keyName=>{
            this.state[keyName] = ''
        })
    }

    handleTextChange(keyName, value){
        this.setState({[keyName]: value});
    }

    areAllFieldsEmpty(){
        var allEmpty = true;
        this.props.entryKeys.forEach(keyName=>{
            if (this.state[keyName] !== '')
                allEmpty = false;
        });
        return allEmpty;
    }

    render() {
        return <div className="col-sm-12">
                {this.props.entryKeys.map((keyName, index)=>{
                    return <div className="form-group" key={index}>
                        <label htmlFor="exampleInputEmail1">{keyName}</label>
                        <input type="text" className="form-control" id="exampleInputEmail1" placeholder={keyName}
                            value={
                                this.state[keyName]
                            }
                            onChange={e=>{
                                this.handleTextChange(keyName, e.target.value)
                            }}
                        />
                    </div>
                })
            }
            <button className="btn btn-default" 
                disabled={this.areAllFieldsEmpty()}

                onClick={()=>{
                    let entry = {};
                    this.props.entryKeys.forEach(keyName=>{
                        entry[keyName] = this.state[keyName];
                    });
                    this.props.onAddEntry(this.props.dictId, entry);
            }}>
                Add entry
            </button>
            <button className="btn btn-default"
                style={{marginLeft: '1em'}}
                onClick={this.props.onDictClick}
            >
                Cancel
            </button>
            <div className="row" style={{
                display: this.props.errorMsg ? 'block' : 'none'
            }}>
                <div className="col-xs-12" style={{marginTop: '1em'}}>
                    <div className="alert alert-danger alert-dismissible" role="alert">
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close"
                            onClick={this.props.onErrorSeen}
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                        {this.props.errorMsg}
                    </div>
                </div>
            </div>
        </div>
    }
}

NewEntry.propTypes = {
    entryKeys: PropTypes.array.isRequired,
    dictName: PropTypes.string.isRequired,
    dictId: PropTypes.string.isRequired,
    onDictClick: PropTypes.func.isRequired,
    onAddEntry: PropTypes.func.isRequired,
    onErrorSeen: PropTypes.func.isRequired,
    errorMsg: PropTypes.string
}

export default NewEntry
