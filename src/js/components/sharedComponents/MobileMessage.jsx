/**
 * MobileMessage.jsx
 * Created by Jonathan Hill 09/03/20
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { withRouter } from 'react-router-dom';

const propTypes = { location: PropTypes.object };

const cookie = 'usaspending_mobile_view_disclaimer';

const MobileMessage = ({ location }) => {
    const [hideMessage, setHideMessage] = useState(Cookies.get(cookie));
    const onClick = () => {
        Cookies.set(cookie, { expires: 1 });
        setHideMessage('hide');
    };
    // remove disclaimer if user switches out of mobile viewport
    const watchWidth = () => {
        if (window.outerWidth >= 568) {
            Cookies.set(cookie, { expires: 1 });
            setHideMessage('hide');
        }
    };
    // remove disclaimer after 5 seconds
    useEffect(() => {
        if (Cookies.get(cookie) !== 'hide') {
            setTimeout(() => {
                Cookies.set(cookie, { expires: 1 });
                setHideMessage('hide');
            }, 10000);
        }
    }, []);
    // remove disclaimer if user switches out of mobile viewport
    useEffect(() => {
        window.addEventListener('resize', watchWidth);
        return () => window.removeEventListener('resize', watchWidth);
    }, []);
    if (hideMessage) return null;
    return (
        <div style={location.pathname === '/disaster/covid-19' ? { bottom: '110px' } : {}} className="mobile-message__container">
            <div className="mobile-message">
                <div className="mobile-message__image">
                    <img src="img/icon--flipMobile.png" alt="Rotate to landscape view" />
                </div>
                <div className="mobile-message__text">
                    Rotate your device for the optimal mobile experience
                </div>
            </div>
            <button className="mobile-message__button" onClick={onClick}>DISMISS</button>
        </div>
    );
};

MobileMessage.propTypes = propTypes;
export default withRouter(MobileMessage);
