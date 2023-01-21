const HEADER_CLASS = "_23P3O";
const DELAY = 10000000;
const logs = [];

let timeOnline;
let timeOffline;

const getProfileHeaderElem = () => {
  const elem = document.getElementsByClassName(HEADER_CLASS);
  if (elem.length) {
    return elem[0];
  } else {
    throw new Error("Class name invalid, could not retrieve element.");
  }
};

const mutationCallback = (mutation) => {
  let result;
  let contact = mutation[0].target.innerText.trim();
  if (mutation[0].addedNodes.length > 0) {
    timeOnline = new Date();
    contact = contact.replace(/[\W]*\S+[\W]*$/, "");
    result = `${contact} online on [${timeOnline.toLocaleString()}].`;
    console.log(result);
    logs.push({ contact, result });
  } else {
    timeOffline = new Date();
    const msg = `${contact} offline on [${timeOffline.toLocaleString()}].`;
    const difference = Math.ceil((timeOffline.getTime() - timeOnline.getTime()) / 1000);
    result = `${msg} This user online for ${difference} second.`;
    console.log(result);
    logs.push({ contact, result });
  }
};

const toCsv = () => {
  let csv = "no,user,tracking\n";
  logs.forEach((log, index) => {
    csv += `${index + 1},"${log.contact}","${log.result}"\n`;
  });
  console.log(csv);
  let hiddenElement = document.createElement("a");
  hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
  hiddenElement.target = "_blank";
  hiddenElement.download = "logs.csv";
  hiddenElement.click();
};

const downloadCsv = () => {
  setTimeout(() => {
    toCsv();
    downloadCsv();
  }, DELAY);
};

const main = (obs) => {
  console.log(`Init script.`);
  const config = { attributes: true, childList: true, subtree: true };
  obs.observe(getProfileHeaderElem(), config);
  console.log(`Observing...`);
  downloadCsv();
};

const observer = new MutationObserver(mutationCallback);
main(observer);
