/**
 * navTest/About.jsx
 * Created by Andrea Blackwell 8/22/2023
 **/

import React, { useEffect, useState } from 'react';

import PageWrapper from 'components/sharedComponents/PageWrapper';
import { aboutPageMetaTags } from 'helpers/metaTagHelper';
import { stickyHeaderHeight } from 'dataMapping/stickyHeader/stickyHeader';
import { getStickyBreakPointForSidebar } from 'helpers/stickyHeaderHelper';
import { scrollToY } from 'helpers/scrollToHelper';
import { useQueryParams } from 'helpers/queryParams';
import { find, throttle } from "lodash";
import { useHistory } from "react-router-dom";
import PageFeatureFlag from "components/sharedComponents/PageFeatureFlag";

import AboutContent from './AboutContent';

require('pages/about/aboutPage.scss');

const aboutSections = [
    {
        section: 'mission',
        label: 'Start: Mission1'
    },
    {
        section: 'background',
        label: 'Background2'
    },
    {
        section: 'development',
        label: 'Development and Releases3'
    },
    {
        section: 'licensing',
        label: 'Licensing4'
    },
    {
        section: 'more-info',
        label: 'More Information5'
    },
    {
        section: 'contact',
        label: 'Contact6'
    },
    {
        section: 'mission',
        label: 'Mission7'
    },
    {
        section: 'background',
        label: 'Background8'
    },
    {
        section: 'development',
        label: 'Development and Releases9'
    },
    {
        section: 'licensing',
        label: 'Licensing10'
    },
    {
        section: 'more-info',
        label: 'More Information11'
    },
    {
        section: 'contact',
        label: 'Contact12'
    },
    {
        section: 'mission',
        label: 'Mission13'
    },
    {
        section: 'background',
        label: 'Background14'
    },
    {
        section: 'development',
        label: 'Development and Releases15'
    },
    {
        section: 'licensing',
        label: 'Licensing16'
    },
    {
        section: 'more-info',
        label: 'More Information17'
    },
    {
        section: 'contact',
        label: 'End: Contact18'
    }
];


const About = () => {
    const query = useQueryParams();
    // commented out while in page nav feature is in development
    // const [activeSection, setActiveSection] = useState(query.section || 'mission');
    const history = useHistory();
    const [activeSection, setActiveSection] = useState(query.section || 'mission');

    const jumpToSection = (section = '') => {
        console.log(section);
        // we've been provided a section to jump to
        // check if it's a valid section
        const sectionObj = find(aboutSections, ['label', section]);
        if(!sectionObj) return;

        // find the section in dom
        const sectionDom = document.querySelector(`#about-${sectionObj.section}`);
        console.log(sectionDom);
        if (!sectionDom) return;

        // add section to url
        history.replace(`/temp-nav?section=${sectionObj.section}`);

        // update the state
        setActiveSection(sectionObj.section);

        // add offsets
        const conditionalOffset = window.scrollY < getStickyBreakPointForSidebar() ? stickyHeaderHeight : 10;
        const sectionTop = (sectionDom.offsetTop - stickyHeaderHeight - conditionalOffset);
        scrollToY(sectionTop + 15, 700);
    };


    useEffect(throttle(() => {
        // prevents a console error about react unmounted component leak
        let isMounted = true;
        if (isMounted) {
            const urlSection = query.section;
            if (urlSection) {
                jumpToSection(urlSection);
                // remove the query param from the url after scrolling to the given section
                // history.replace(`/about`);
            }
        }
        return () => {
            isMounted = false;
        };
    }, 100), [history, query.section]);

    return (
        <PageFeatureFlag>
            <PageWrapper
                pageName="About"
                classNames="usa-da-about-page"
                metaTagProps={aboutPageMetaTags}
                title="About"
                sections={aboutSections}
                jumpToSection={jumpToSection}>
                <main id="main-content" className="main-content">
                    <p>Test Page - For lower environments only</p>
                    <AboutContent />
                </main>
            </PageWrapper>
        </PageFeatureFlag>
    );
};

export default About;
