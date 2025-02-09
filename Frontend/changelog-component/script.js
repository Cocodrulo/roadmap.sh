const CHANGELOG = [
    ...(await fetch("/changelog.json").then((res) => res.json())),
].toReversed();

const $ = (selector) => document.querySelector(selector);

const changelog = $("#changelog");
const stick = $("#stick");

const setUpChangelog = () => {
    changelog.innerHTML = "";
    CHANGELOG.forEach((entry) => {
        changelog.innerHTML += `
            <div class="entry">
                <span>${entry.date}</span>
                <span><div class="ball"></div></span>
                <span>${entry.title}</span>
            </div>
        `;
    });

    const height = changelog.clientHeight;
    console.log(height);
    stick.style.height = `${height}px`;
};

setUpChangelog();
