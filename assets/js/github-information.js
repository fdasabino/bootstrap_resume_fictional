function userInformationHTML(user) {
  return `<h2>${user.name}<span class="small-name"> @<a href="${user.html_url}" target="_blank">${user.login}</a></span></h2>
    <div class="gh-content"><div class="avatar">
    <a href="${user.html_url}" target="_blank"><img src="${user.avatar_url}" width="80" height="80" alt="${user.login}" /></a></div>
    <p>Followers: ${user.followers} - Following: ${user.following} <br> Repositories:${user.public_repos}</p></div>`;
}
function repoInformationHTML(repos) {
  if (repos.length == 0) {
    return `<div class="clearfix repo-list">NO REPOSITORIES</div>`;
  }
  let listItemsHTML = repos.map((repo) => {
    return `<li><a href="${repo.html_url}" target="_blank">${repo.name}</a></li>`;
  });
  return `<div class="clearfix repo-list text-center"><p>Repo List:</p>
  <ul>
  ${listItemsHTML.join("\n")}
  </ul>
  </div>`;
}

function fetchGitHubInformation(event) {
  $("#gh-user-data").html("");
  $("#gh-user-repo").html("");
  let username = $("#gh-username").val();
  if (!username) {
    $("#gh-user-data").html(
      `<h2 class="text-center">Please Enter a GitHub Username</h2>`
    );
    return;
  }
  $("#gh-user-data").html(`<div id="loader">
        <img src="assets/css/loader.gif" alt="loading..."/>
        </div>`);

  $.when(
    $.getJSON(`https://api.github.com/users/${username}`),
    $.getJSON(`https://api.github.com/users/${username}/repos`)
  ).then(
    (firstResponse, secondResponse) => {
      let userData = firstResponse[0];
      let repoData = secondResponse[0];
      $("#gh-user-data").html(userInformationHTML(userData));
      $("#gh-user-data").html(repoInformationHTML(repoData));
    },
    (errorResponse) => {
      if (errorResponse.status === 404) {
        $("#gh-user-data").html(
          `<h2 class="text-center" text-center>Username ${username} not found</h2>`
        );
      } else if (errorResponse.status === 403) {
        let resetTime = new Date(
          errorResponse.getResponseHeader("x-RateLimit-Reset") * 1000
        );
        $("#gh-user-data").html(
          `<h4 class="text-center">Too many requests, please wait until ${resetTime.toLocaleTimeString()}</h4>`
        );
      } else {
        console.log(errorResponse);
        $("#gh-user-data").html(
          `<h2 class="text-center">Error: ${errorResponse.responseJSON.message}</h2>`
        );
      }
    }
  );
}
