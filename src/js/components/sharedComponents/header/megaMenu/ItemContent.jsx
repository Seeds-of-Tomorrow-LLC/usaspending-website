import React from "react";
import { useDispatch } from 'react-redux';
import { FlexGridRow } from 'data-transparency-ui';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { uniqueId } from 'lodash';
import * as aboutTheDataActions from 'redux/actions/aboutTheDataSidebar/aboutTheDataActions';
import * as slideoutActions from 'redux/actions/slideouts/slideoutActions';

const ItemContent = ({
    section1Title,
    section2Title,
    section3Title,
    section1Items,
    section2Items,
    section3Items,
    section1Sub,
    section2Sub,
    section1Icon,
    section2Icon,
    section3Icon
}) => {
    const dispatch = useDispatch();

    const openATD = (e) => {
        dispatch(aboutTheDataActions.showAboutTheData());
        dispatch(slideoutActions.setLastOpenedSlideout('atd'));
        e.preventDefault();
    };

    return (
        <div className="dropdown-section__wrapper">
            <div className="dropdown-section__top-columns">
                <div key={uniqueId()} className="dropdown-section first-dropdown-section" data-first-dropdown-section>
                    {section1Icon && section1Icon !== null && section1Icon !== '' ? <FontAwesomeIcon size="lg" className="" icon={section1Icon} /> : ''}
                    <div>
                        <p className="dropdown-section__section-title">{section1Title}</p>
                        {section1Sub !== null && section1Sub !== undefined && section1Sub !== '' ?
                            <span className="dropdown-section__section-subtitle">{section1Sub}</span> : ''}
                        <ul className="dropdown-section__section-list">
                            {section1Items.map((item, index) => (
                                <>
                                    <li key={`link-${uniqueId(index)}`}>
                                        <Link className="dropdown--item__link" to={item.url}>
                                            {item.icon && item.icon !== '' && item.icon !== null ? <FontAwesomeIcon size="lg" className="" icon={item.icon} /> : ''}
                                            <div className="dropdown-item__link-desc">
                                                <div className="dropdown-item__link-label">
                                                    {item.label}
                                                    <span className="dropdown-item__description">{item.description}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                </>
                            ))}
                        </ul>
                    </div>
                </div>
                <div key={uniqueId()} className="dropdown-section">
                    <div className="dropdown-section__alternate-top">
                        {section2Icon && section2Icon !== null && section2Icon !== '' ? <FontAwesomeIcon size="lg" className="" icon={section2Icon} /> : ''}
                        <div>
                            <p className="dropdown-section__section-title">{section2Title}</p>
                            {section2Sub !== null && section2Sub !== undefined && section2Sub !== '' ?
                                <span className="dropdown-section__section-subtitle">{section2Sub}</span> : ''}
                            <ul className="dropdown-section__section-list">
                                {section2Items.map((item, index) => (
                                    <>
                                        <li key={`second-section-link-${uniqueId(index)}`}>
                                            <Link
                                                className="dropdown--item__link"
                                                to={item.url !== "?about-the-data" ? item.url : ''}
                                                onClick={item.url !== '?about-the-data' ? '' : openATD}
                                                onMouseUp={item.url !== '?about-the-data' ? '' : openATD}>
                                                {item.icon && item.icon !== '' && item.icon !== null ? <FontAwesomeIcon size="lg" className="" icon={item.icon} /> : ''}
                                                <div className="dropdown-item__link-desc">
                                                    <div className="dropdown-item__link-label">
                                                        {item.label}
                                                        <span className="dropdown-item__description">{item.description}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                    </>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            {section3Title !== null && section3Title !== undefined && section3Title !== '' ?
                <div key={uniqueId()} className="dropdown-section dropdown-section__bottom-portion">
                    <div className="dropdown-section__alternate-top">
                        {section3Icon && section3Icon !== null && section3Icon !== '' ? <FontAwesomeIcon size="lg" className="" icon={section3Icon} /> : ''}
                        <div>
                            <p className="dropdown-section__section-title">{section3Title}</p>
                            <ul className="dropdown-section__section-list">
                                {section3Items.map((item, index) => (
                                    <li
                                        className="dropdown-section__bottom-portion-list-item"
                                        key={`third-section-link-${uniqueId(index)}`}>
                                        <FlexGridRow desktop={6} width={6} >
                                            <Link className="dropdown--item__link" to={item.url}>
                                                <div className="dropdown-section__section-list-item">
                                                    <div className="dropdown-item__link-desc">
                                                        <div className="dropdown-item__link-label">
                                                            {item.label}
                                                            <div className="dropdown-item__description">{item.description}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </FlexGridRow>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div> : ''}
        </div>

    );
};

export default ItemContent;
