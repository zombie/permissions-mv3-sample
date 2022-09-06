
let browser = chrome;

function log(str) {
  let elem = document.getElementById("log");
  elem.value += "\n" + str;
  elem.scrollTop = elem.scrollHeight;
}

function updatePermissions() {
  browser.permissions.getAll()
  .then((perms) => {
    let all = perms.permissions.join(', ') + " | " + perms.origins.join(",");
    document.getElementById('permissions').innerText = all;
    log("getAll: " + all);
  });
}

async function processChange(event) {
  let permission = event.target.dataset.permission;
  if (event.target.dataset.custom) {
    permission = document.getElementById("custom").value;
  }
  console.log(permission);

  let key = permission.includes("/") ? "origins" : "permissions";
  let result = document.getElementById('result');

  try {
    if (event.target.dataset.action === 'grant') {
      browser.permissions.request({[key]: [permission]})
      .then((response) => {
        result.className = 'bg-success';
        result.textContent = 'Call successful.';
        setTimeout(() => updatePermissions(), 99);
      })
      .catch((err) => {
        // Catch the case where the permission cannot be granted.
        result.className = 'bg-warning';
        result.textContent = err.message;
        setTimeout(() => updatePermissions(), 999);
      });
    }
    else {
      browser.permissions.remove({[key]: [permission]})
      .then((response) => {
        result.className = 'bg-success';
        result.textContent = 'Call successful.';
        setTimeout(() => updatePermissions(), 999);
      });
    }
  } catch(err) {
    // Catch the case where the permission is completely wrong.
    result.className = 'bg-danger';
    result.textContent = err.message;
    setTimeout(() => updatePermissions(), 999);
  }
  result.style.display = 'block';
  event.preventDefault();
}

for (let element of document.getElementsByClassName('permission')) {
  element.addEventListener('click', processChange);
}

updatePermissions();

browser.permissions.onAdded.addListener(perms => {
  let changed = perms.permissions.join(', ') + " | " + perms.origins.join(",");
  log("onAdded: " + changed);
});

browser.permissions.onRemoved.addListener(perms => {
  let changed = perms.permissions.join(', ') + " | " + perms.origins.join(",");
  log("onRemoved: " + changed);
});
