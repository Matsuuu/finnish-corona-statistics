import { css } from 'lit-element';

const styles = css`
    @font-face {
        font-family: 'Material Icons';
        font-style: normal;
        font-weight: 400;
        src: url(https://fonts.gstatic.com/s/materialicons/v50/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2) format('woff2');
    }

    .material-icons {
        font-family: 'Material Icons';
        font-weight: normal;
        font-style: normal;
        font-size: 24px;
        line-height: 1;
        letter-spacing: normal;
        text-transform: none;
        display: inline-block;
        white-space: nowrap;
        word-wrap: normal;
        direction: ltr;
        -webkit-font-feature-settings: 'liga';
        -webkit-font-smoothing: antialiased;
    }

    :host {
        font-family: 'Roboto', sans-serif;
        background: #fafafa;
        display: block;
    }

    .language-switcher {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        display: flex;
    }

    .language-switcher > p {
        margin: 0 1rem 0 0;
        color: #484848;
        font-weight: bold;
    }

    .language-switcher > select {
        background: none;
        border: none;
        border-bottom: 1px solid #484848;
        padding: 0 2rem 0 0;
        color: #484848;
        outline: none;
        transition: 0.1s linear;
    }

    .language-switcher > select:hover {
        background: whitesmoke;
    }

    .about-section {
        width: 50%;
        display: flex;
        margin: 0 auto;
        flex-direction: column;
        color: #484848;
    }

    .about-section > h1 {
        margin: 0.5rem 0;
    }

    .data-wrapper {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin: 0 10%;
        justify-content: center;
    }
    .data-wrapper > div {
        background: #fff;
        flex-basis: 42.5%;
        margin-bottom: 5%;
        box-shadow: 0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14),
            0px 1px 8px 0px rgba(0, 0, 0, 0.12);
        padding: 1rem;
        margin: 1rem;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-weight: bold;
    }

    .data-wrapper > div > p {
        text-align: center;
    }

    #infections-total-cumulative {
        flex-basis: 90%;
    }

    .data-wrapper > .numbers {
        flex-basis: 20%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        position: relative;
    }

    .data-wrapper > .numbers > .numbers-subtitle {
        position: absolute;
        bottom: 0;
        left: 0;
        margin: 0 0 3px 0;
        width: 100%;
        text-align: center;
        font-size: 1rem;
    }

    .data-wrapper > .numbers > .numbers-with-arrows {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding: 0 1rem 0 0;
    }

    .data-wrapper > .numbers > .numbers-with-arrows > i {
        font-size: 4rem;
    }

    .data-wrapper > .numbers > .numbers-with-arrows > h2 {
        font-size: 3rem;
        width: max-content;
    }

    .data-wrapper > .global-numbers {
        flex-basis: 25%;
    }

    .data-wrapper > .global-numbers > p {
        text-align: center;
    }

    .data-wrapper > .numbers > h2 {
        font-size: 3rem;
        width: max-content;
    }
    .data-wrapper > .numbers > p {
        font-size: 1.4rem;
        width: max-content;
        color: #484848;
    }

    .data-wrapper > h3 {
        width: 100%;
        color: #484848;
        margin: 1rem 2rem;
    }

    .data-wrapper > p {
        width: 100%;
        color: #484848;
        margin: 0.5rem 2rem;
    }

    .data-wrapper > .country-infection-numbers-list {
        display: flex;
        flex-direction: column;
        flex-basis: 80%;
        padding: 0;
    }

    .data-wrapper > .country-infection-numbers-list > p {
        margin: 0.5rem 0;
    }

    .country-infection-statistics {
        width: 90%;
        padding: 1rem 0;
    }

    .country-infection-number-row {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    }

    .confirmed-numbers {
        color: #f72c2c;
    }

    .recovered-numbers {
        color: green;
    }
    .deaths-numbers {
        color: gray;
    }

    .active-numbers {
        color: gray;
    }

    .country-infection-number-row > p {
        flex-basis: 25%;
        margin: 0.5rem 0;
        display: flex;
        align-items: center;
    }

    .country-infection-number-row > p:last-child {
        flex-basis: 17.5%;
    }

    .country-infection-number-row > p:first-child {
        flex-basis: 32.5%;
    }

    .gray {
        color: gray;
        padding-left: 5px;
    }

    .country-infection-numbers-list-show-all-button {
        width: 100%;
        height: 4rem;
        background: whitesmoke;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        cursor: pointer;
        transition: 0.2s ease-in;
    }

    .country-infection-numbers-list-show-all-button:hover {
        background: #dbd7d7;
    }

    .footer {
        display: flex;
        margin-top: 2rem;
        flex-direction: column;
        color: #484848;
        text-align: left;
        width: 50%;
        margin: 10% auto 1rem;
    }

    .footer > a,
    .footer > p > a {
        color: inherit;
        margin: 0.5rem 0;
    }

    .footer > p {
        margin: 0.5rem 0;
    }

    @media only screen and (max-width: 780px) {
        .about-section {
            padding-top: 3rem;
        }

        .data-wrapper {
            margin: 0 1%;
        }

        .data-wrapper > div {
            flex-basis: 95%;
            max-width: 90%;
            margin-bottom: 5%;
        }

        .data-wrapper > .numbers {
            flex-basis: 100%;
        }
        .data-wrapper > .numbers > h2 {
            font-size: 3rem;
        }

        .data-wrapper > .numbers > p {
            font-size: 1.1rem;
        }

        .about-section {
            width: 90%;
        }
        .data-wrapper > h3 {
            margin: 1rem;
        }

        .data-wrapper > .country-infection-numbers-list {
            padding: 1rem;
            flex-basis: 85%;
        }

        .country-infection-number-row {
            flex-direction: column;
            margin-bottom: 2rem;
        }

        .country-infection-statistics {
            width: 100%;
        }

        .footer {
            width: 90%;
        }
    }

    @media only screen and (min-width: 1680px) {
        .data-wrapper {
            margin: 0 10%;
        }
    }
`;

export default styles;
