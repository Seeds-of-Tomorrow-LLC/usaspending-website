/**
 * WordOfTheDay.jsx
 * Created by Brian Petway 08/22/22
 */

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FlexGridCol } from 'data-transparency-ui';
import { isCancel } from "axios";
import { useLocation } from "react-router-dom";
import { fetchAllTerms, getNewUrlForGlossary } from "helpers/glossaryHelper";
import CardContainer from "../../sharedComponents/commonCards/CardContainer";
import CardBody from "../../sharedComponents/commonCards/CardBody";
import CardButton from "../../sharedComponents/commonCards/CardButton";
import Analytics from '../../../helpers/analytics/Analytics';
import { LoadingWrapper } from "../../sharedComponents/Loading";
import ErrorWordOfTheDay from "./ErrorWordOfTheDay";

const WordOfTheDay = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [term, setTerm] = useState('');
    const [changedTerm, setChangedTerm] = useState('');
    const [definition, setDefinition] = useState('');
    const [glossary, setGlossary] = useState('');
    const [glossaryLink, setGlossaryLink] = useState('');
    const { pathname, search } = useLocation();
    const [currentMonth, setCurrentMonth] = useState('');
    const [currentDate, setCurrentDate] = useState('');

    // Please note before adding terms to this list, verify the term exactly matches the term returned from /v2/references/glossary
    const glossaryTerms = ["Account Balance (File A)",
        "Account Breakdown by Award (File C)",
        "Account Breakdown by Program Activity & Object Class (File B)",
        "Action Date",
        "Appropriation",
        "Assistance Listings (CFDA Program)",
        "Award",
        "Award Type",
        "Awards Data (File D)",
        "Budget Authority",
        "Budget Function",
        "Budgetary Resources",
        "Contract",
        "Deobligation",
        "Direct Loan",
        "Direct Payment",
        "Disaster Emergency Fund Code (DEFC)",
        "Face Value of Loan",
        "FAIN",
        "Federal Account",
        "Federal Action Obligation",
        "Financial Assistance",
        "Fiscal Year (FY)",
        "Funding Opportunity Number",
        "Grant",
        "Indefinite Delivery Vehicle (IDV)",
        "Insurance",
        "Loan",
        "Loan Subsidy Cost",
        "Multiple Recipients",
        "NAICS",
        "National Interest Action (NIA)",
        "Object Class",
        "Obligation",
        "Other Budgetary Resources",
        "Outlay",
        "Period of Performance Current End Date",
        "Period of Performance Potential End Date",
        "Period of Performance Start Date",
        "Potential Award Amount",
        "Primary Place of Performance",
        "Prime Award",
        "Prime Recipient",
        "Procurement Instrument Identifier (PIID)",
        "Product or Service Code (PSC)",
        "Program Activity",
        "Recipient",
        "Recipient Location",
        "Recipient/Business Types",
        "Redacted Due to PII",
        "Set Aside Type",
        "Spending",
        "Sub-Award",
        "Submission Period",
        "Sub-Recipient",
        "Transaction",
        "Treasury Account Symbol (TAS)",
        "Unique Entity Identifier (UEI)",
        "Unlinked Award",
        "Unobligated Balance",
        "URI"];

    const dateDataMapper = {
        0: { startingIndex: 31 },
        1: { startingIndex: 0 },
        2: { startingIndex: 31 },
        3: { startingIndex: 0 },
        4: { startingIndex: 31 },
        5: { startingIndex: 0 },
        6: { startingIndex: 31 },
        7: { startingIndex: 31 },
        8: { startingIndex: 0 },
        9: { startingIndex: 31 },
        10: { startingIndex: 0 },
        11: { startingIndex: 31 }
    };

    useEffect(() => {
        if (currentDate && currentMonth) {
            const index = dateDataMapper[currentMonth]?.startingIndex + currentDate;
            setTerm(glossaryTerms[index]);
        }
    }, [currentDate, currentMonth, dateDataMapper, glossaryTerms]);

    const selectWordOfTheDay = () => {
        const d = new Date();
        setCurrentDate(d.getUTCDate());
        setCurrentMonth(d.getUTCMonth());
    };

    const trackWordLink = () => Analytics.event({
        category: 'Homepage',
        action: 'Link',
        label: 'word of the day'
    });

    useEffect(() => {
        let found = false;
        if (glossary && term) {
            for (let i = 0; i < glossary.length; i++) {
                if (glossary[i].term.trim() === term.trim()) {
                    setGlossaryLink(getNewUrlForGlossary(pathname, `?glossary=${glossary[i].slug}`, search));
                    found = true;
                    setDefinition(glossary[i].plain);
                }
            }
        }

        if (!found) {
            setError(true);
        }
        console.debug(term);
        if (term === "Account Balance (File A)") {
            setChangedTerm("File A");
        }
        else if (term === "Account Breakdown by Award (File C)") {
            setChangedTerm("File C");
        }
        else if (term === "Account Breakdown by Program Activity & Object Class (File B)") {
            setChangedTerm("File B");
        }
        else if (term === "Period of Performance Current End Date") {
            setChangedTerm("Current End Date");
        }
        else if (term === "Period of Performance Potential End Date") {
            setChangedTerm("Potential End Date");
        }
        else if (term === "Period of Performance Start Date") {
            setChangedTerm("Start Date");
        }
        else if (term === "Procurement Instrument Identifier (PIID)") {
            setChangedTerm("PIID");
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [glossary, pathname, search, term, changedTerm]);

    useEffect(() => {
        fetchAllTerms().promise
            .then((res) => {
                selectWordOfTheDay();
                setGlossary(res.data.results);
                setLoading(false);
                setError(false);
            })
            .catch((err) => {
                if (!isCancel(err)) {
                    console.log(err);
                    setLoading(false);
                    setError(true);
                }
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <section className="word-of-the-day__section">
            <div className="word-of-the-day__heading">
                <div className="word-of-the-day__heading--background">
                    <FontAwesomeIcon className="word-of-the-day__heading--icon" icon="lightbulb" />
                </div>
                <span>Word of the Day</span>
            </div>
            <CardContainer variant="outline" fill="#1a4480">
                {/* eslint-disable-next-line no-nested-ternary */}
                {!loading && !error ?
                    <FlexGridCol>
                        <div className="word-of-the-day__headline">{changedTerm === "" ? term : changedTerm}</div>
                        <div className="word-of-the-day__divider" />
                        <CardBody customClassName="word-of-the-day__body">
                            <>
                                <div className="definition"><div>{definition}</div></div>
                                <CardButton action={trackWordLink} variant="secondary" link={glossaryLink} customClassName="word-of-the-day__button">
                                    Read More
                                </CardButton>
                            </>
                        </CardBody>
                    </FlexGridCol>
                    :
                    <CardBody customClassName="card__body_error">
                        {loading ? <LoadingWrapper isLoading={loading} /> : <ErrorWordOfTheDay />}
                    </CardBody>
                }
            </CardContainer>
        </section>
    );
};

export default WordOfTheDay;
