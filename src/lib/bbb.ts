import { BigBlueButton } from "bigbluebutton-js";

const bbbUrl = process.env.BBB_URL;
const bbbSecret = process.env.BBB_SECRET;

if (!bbbUrl || !bbbSecret) {
    console.warn("BBB_URL or BBB_SECRET is not defined in environment variables.");
}

export const bbb = bbbUrl && bbbSecret ? new BigBlueButton(bbbUrl, bbbSecret) : null;
