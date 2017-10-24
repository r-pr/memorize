import React from 'react';
import PropTypes from 'prop-types';

export default class Training extends React.Component {
    render(){
        let entry = null;
        for (let i = 0; i < this.props.dict.entries.length; i++){
            if (this.props.dict.entries[i]._id === this.props.entryId){
                entry = this.props.dict.entries[i];
                break;
            }
        }
        if (!entry){
            return <p>Error</p>;
        }

        return <div className="col-xs-12">
            {/* training values */}
            <div className="row">
                <div className="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3 col-lg-4 col-lg-offset-4">
                    {
                        this.props.dict.entryKeys.training.map((key, index)=>{
                            return <p key={index}>
                                <strong>{key}:&nbsp;</strong>
                                {entry[key]}
                            </p>;
                        })
                    }
                    {
                        this.props.dict.entryKeys.hint.map((key, index)=>{
                            return <p key={index}
                                style={{visibility: this.props.shouldShowHint ? 'visible' : 'hidden'}}
                            >
                                <strong>{key}:&nbsp;</strong>
                                {entry[key]}
                            </p>;
                        })
                    }
                </div>
            </div>

            <div className="row">
                <div className="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3 col-lg-4 col-lg-offset-4">
                    <button 
                        className="btn btn-success btn-block" 
                        style={{marginRight: '1em'}}
                        onClick={()=>{
                            //second arg specifies if counter should be incremented
                            //counter is not incremented if user ordered a hint
                            this.props.showNextEntry(this.props.entryId, !this.props.shouldShowHint);
                        }}
                    >
                        {this.props.shouldShowHint ? 'Next' : 'I know it'}
                    </button>
                </div>
            </div>

            <div className="row" style={{marginTop: '1em'}}>
                <div className="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3 col-lg-4 col-lg-offset-4">
                    <button className="btn btn-info btn-block"
                        disabled={this.props.shouldShowHint}
                        onClick={this.props.needHint}
                    >
                        Show hint
                    </button>
                </div>
            </div>    

            <div className="row" style={{marginTop: '1em'}}>
                <div className="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3 col-lg-4 col-lg-offset-4">
                    <button className="btn btn-danger btn-block"
                        onClick={this.props.onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>    

        </div>;
    }
}

Training.propTypes = {
    entryId: PropTypes.string.isRequired,
    shouldShowHint: PropTypes.bool.isRequired,
    dict: PropTypes.object.isRequired,
    showNextEntry: PropTypes.func.isRequired,
    needHint: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};
