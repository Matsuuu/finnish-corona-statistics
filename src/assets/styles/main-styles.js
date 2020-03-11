import { css } from 'lit-element';

const styles = css`
    :host {
        font-family: 'Roboto', sans-serif;
        background: #fafafa;
        display: block;
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
        align-items: center;
    }

    .data-wrapper > .numbers {
        flex-basis: 20%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    .data-wrapper > .numbers > h2 {
        font-size: 3rem;
        width: max-content;
        color: #484848;
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
        .data-wrapper {
            margin: 0 1%;
        }

        .data-wrapper > div {
            flex-basis: 95%;
            margin-bottom: 5%;
        }

        .data-wrapper > .numbers {
            flex-basis: 100%;
        }
        .data-wrapper > .numbers > h2 {
            font-size: 3rem;
        }

        .about-section {
            width: 90%;
        }
        .data-wrapper > h3 {
            margin: 1rem;
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
