'use strict';

import React from 'react';
import firebase from 'firebase';

class ReactFirebaseSocialLogins extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingProvider: null
    };
  }

  render() {
    const loginProvider = p => {
      let provider;

      if (p === 'facebook') {
        provider = new firebase.auth.FacebookAuthProvider();
      } else if (p === 'google') {
        provider = new firebase.auth.GoogleAuthProvider();
      }

      return () => {
        this.setState({ loadingProvider: p });
        const self = this;
        this.props.fireRef
          .signInWithPopup(provider)
          .then(authData => {
            // success via popup
            self.setState({ loadingProvider: null });
          })
          .catch(error => {
            if (error.code === 'TRANSPORT_UNAVAILABLE') {
              this.props.fireRef.authWithOAuthRedirect(provider, function(
                error
              ) {
                if (error) {
                  self.setState({ loadingProvider: null });
                  self.props.errorHandler(error);
                } else {
                  //success via redirect
                  self.setState({ loadingProvider: null });
                }
              });
            } else {
              self.setState({ loadingProvider: null });
              self.props.errorHandler(error);
            }
          });
      };
    };

    const buttons = this.props.providers.map(provider => {
      let buttonProps = this.props.btnProps;
      if (buttonProps === undefined || buttonProps === null) {
        buttonProps = {};
      }
      buttonProps.disabled = this.state.loadingProvider !== null;
      buttonProps.onClick =
        this.state.loadingProvider === null
          ? loginProvider(provider).bind(this)
          : null;

      return (
        <button key={provider} {...buttonProps}>
          {this.props.textFn(provider)}
        </button>
      );
    });

    return (
      <div className="socialLogins">
        {buttons}
      </div>
    );
  }
}

ReactFirebaseSocialLogins.displayName = 'ReactFirebaseSocialLogins';

// Uncomment properties you need
ReactFirebaseSocialLogins.propTypes = {
  fireRef: React.PropTypes.object.isRequired,
  providers: React.PropTypes.arrayOf(React.PropTypes.string),
  textFn: React.PropTypes.func,
  errorHandler: React.PropTypes.func,
  btnProps: React.PropTypes.object
};

ReactFirebaseSocialLogins.defaultProps = {
  providers: ['google', 'facebook', 'twitter', 'github'],
  textFn: social => {
    return social;
  },
  errorHandler: error => {},
  buttonProps: {}
};

export default ReactFirebaseSocialLogins;
