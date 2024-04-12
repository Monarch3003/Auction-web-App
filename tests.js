import { updateTxStatus, getTxStatus } from "./controller/transactionController.js";

async function run () {
    const st = await getTxStatus("406d9e73-18d5-42ba-ac4d-025a9c2f5507");
    console.log(st);
};

run();