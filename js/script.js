const overview = document.querySelector(".overview");
const username = "Rikaiyah-Winters";
const repoList = document.querySelector(".repo-list");
const reposElement = document.querySelector(".repos");
const repoDataElement = document.querySelector(".repo-data");
const backToRepoGalleryButton = document.querySelector(".view-repos");
const filterInput = document.querySelector(".filter-repos");

const getData = async function () {
    const res = await fetch(`https://api.github.com/users/${username}`);
    const userData = await res.json();
    //console.log(userData);
    displayUserInfo(userData);
};

getData();

const displayUserInfo = function (userData) {
    const div = document.createElement("div");
    div.classList.add("user-info");
    div.innerHTML =
    `<figure>
        <img alt="user avatar" src=${userData.avatar_url} />
    </figure>
    <div>
        <p><strong>Name:</strong> ${userData.name}</p>
        <p><strong>Bio:</strong> ${userData.bio}</p>
        <p><strong>Location:</strong> ${userData.location}</p>
        <p><strong>Number of public repos:</strong> ${userData.public_repos}</p>
    </div>
    `
    overview.append(div);
    fetchRepos();
};

const fetchRepos = async function () {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repoData = await res.json();
    //console.log(repoData);
    displayRepoInfo(repoData);
};

const displayRepoInfo = function (repoData) {
    filterInput.classList.remove("hide");
    for (const repo of repoData) {
        const li = document.createElement("li");
        li.classList.add("repo");
        li.innerHTML = `<h3>${repo.name}</h3>`;
        repoList.append(li);
    }
};

repoList.addEventListener("click", function (e) {
    if (e.target.matches("h3")) {
        const repoName = e.target.innerText;
        specificRepoInfo(repoName);
    }
});

const specificRepoInfo = async function (repoName) {
    const res = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await res.json();
    //console.log(repoInfo);
    const fetchLanguages = await fetch(`https://api.github.com/repos/${username}/${repoName}/languages`);
    const languageData = await fetchLanguages.json();
    //console.log(languageData);
    const languages = [];
    for (const language in languageData) {
        languages.push(language);
    }
    //console.log(languages);
    displaySpecificRepoInfo(repoInfo, languages)
};

const displaySpecificRepoInfo = function (repoInfo, languages) {
    repoDataElement.innerHTML = "";
    repoDataElement.classList.remove("hide");
    reposElement.classList.add("hide");
    backToRepoGalleryButton.classList.remove("hide");
    const div = document.createElement("div");
    div.innerHTML = 
    `
    <h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
    `
    repoDataElement.append(div);
};

backToRepoGalleryButton.addEventListener("click", function () {
    reposElement.classList.remove("hide");
    repoDataElement.classList.add("hide");
    backToRepoGalleryButton.classList.add("hide");
});

filterInput.addEventListener("input", function (e) {
    const inputText = e.target.value;
    const repos = document.querySelectorAll(".repo");
    const lowerInputText = inputText.toLowerCase();
    for (const repo of repos) {
        const lowerCaseRepo = repo.innerText.toLowerCase();
        if (lowerCaseRepo.includes(lowerInputText)) {
            repo.classList.remove("hide");
        } else {
            repo.classList.add("hide");
        }
    }

});