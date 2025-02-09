const $ = (selector) => document.querySelector(selector);

let allLanguages = {};

const $language = $("#language");
const $button = $("form button");
const $stateIndicator = $("#state-indicator");
const $form = $("form");
const $repository = $("#repository");
const TEMPLATE = `
    <a href="{%}url" target="_blank">
        <h2>{%}name</h2>
        <p>{%}description</p>
        <div class="details">
            <span><div class="lang-ball" style="--ball-color: {%}color"></div>{%}lang</span>
            <span><img src="images/star.png">{%}stars</span>
            <span><img src="images/fork.png">{%}forks</span>
            <span><img src="images/issues.png">{%}issues</span>
        </div>
    </a>
`;

const refreshReps = async () => {
    if ($stateIndicator) $stateIndicator.classList.remove("error");
    if ($button) $button.style.display = "none";
    try {
        const repositories = await fetchRepositories($language.value);
        getRandomRepository(
            repositories,
            $language.options[$language.selectedIndex].textContent
        );
    } catch (error) {
        if ($repository) $repository.style.display = "none";
        if ($stateIndicator) $stateIndicator.style.display = "flex";
        if ($stateIndicator)
            $stateIndicator.textContent =
                "Error fetching repositories, probably due to rate limiting";
        if ($stateIndicator) $stateIndicator.classList.add("error");
        if ($button) $button.innerHTML = "Click to retry";
        if ($button) $button.style.display = "block";
        if ($button) $button.classList.add("error");
    }
};

const fetchRepositories = async (language) => {
    $stateIndicator.textContent = "Loading, please wait...";
    let url = `https://api.github.com/search/repositories?q=language:${language}`;
    if (language === "")
        url = "https://api.github.com/search/repositories?q=is:public";
    const response = await fetch(url);

    const data = await response.json();
    return data.items;
};

const getRandomRepository = (repositories, langLabel) => {
    const randomIndex = Math.floor(Math.random() * repositories.length);
    const randomRepository = repositories[randomIndex];

    const {
        name,
        description,
        html_url,
        forks_count,
        stargazers_count,
        open_issues_count,
        language,
    } = randomRepository;

    console.log(allLanguages[language].color);

    $repository.innerHTML = TEMPLATE.replace(/{%}name/g, name)
        .replace(/{%}description/g, description)
        .replace(/{%}lang/g, allLanguages[language].title || langLabel)
        .replace(/{%}url/g, html_url)
        .replace(/{%}forks/g, forks_count)
        .replace(/{%}stars/g, stargazers_count)
        .replace(/{%}issues/g, open_issues_count)
        .replace(/{%}color/g, allLanguages[language].color ?? "#333");

    $stateIndicator.style.display = "none";
    $repository.style.display = "flex";

    if ($button) $button.innerHTML = "Refresh";
    if ($button) $button.classList.remove("error");
    if ($button) $button.style.display = "block";
};

const loadLanguages = async () => {
    const languages = await fetch(
        "https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json"
    )
        .then((res) => res.json())
        .catch((err) => console.error(err));

    const colors = await fetch(
        "https://raw.githubusercontent.com/ozh/github-colors/refs/heads/master/colors.json"
    )
        .then((res) => res.json())
        .catch((err) => console.error(err));

    languages.forEach((language) => {
        allLanguages[language.value] = { title: language.title };
        allLanguages[language.value].color =
            colors[language.value]?.color || "#333";
        const option = document.createElement("option");
        option.value = language.value;
        option.textContent = language.title;
        $language.appendChild(option);
    });
};

const init = async () => {
    if ($button) $button.style.display = "none";
    if ($repository) $repository.style.display = "none";
    loadLanguages();
};

$form?.addEventListener("submit", (e) => {
    e.preventDefault();
});

$button?.addEventListener("click", (e) => {
    refreshReps(e);
});

$language?.addEventListener("change", (e) => {
    refreshReps(e);
});

init();
