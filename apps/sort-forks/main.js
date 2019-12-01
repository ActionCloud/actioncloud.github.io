const repoOwner = getParamByName('owner');
const repoName = getParamByName('repo');
const forksDataUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/master/.github/actioncloud/sort-forks/data.json`;

async function run() {
  const forksData = await getForksData(forksDataUrl);
  if (!forksData.data || forksData.data.length < 1) {
    console.log("No forks data")
    return;
  }
  var tbody = document.getElementById('myTBody');
  const parentRepoName = forksData.parent_repo;
  const allRepos = forksData.data;
  allRepos.forEach(repo => {
    var tr = document.createElement('tr');
    // first td
    const repoName = repo.repo_name;
    var repoNameTd = document.createElement('td');
    var aLink = createALink(repoName);
    repoNameTd.appendChild(aLink);
    if (repoName === parentRepoName) {
      var parentFlag = document.createTextNode(' <ParentRepo>');
      repoNameTd.appendChild(parentFlag);
    }
    tr.appendChild(repoNameTd);
    // second td
    var pushedDateTd = document.createElement('td');
    pushedDateTd.appendChild(document.createTextNode(repo.pushed_at));
    tr.appendChild(pushedDateTd);

    tbody.appendChild(tr);
  });
}

run();

function createALink(repoName) {
  var link = `https://github.com/${repoName}`;
  var a = document.createElement('a');
  var linkText = document.createTextNode(repoName);
  a.appendChild(linkText);
  a.title = repoName;
  a.href = link;
  return a
}

function getParamByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

async function getForksData(url) {
  try {
    let response = await fetch(url);
    let issueData = await response.json();
    return issueData;
  } catch(err) {
    throw err;
  }
}
