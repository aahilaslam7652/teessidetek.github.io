document.addEventListener("DOMContentLoaded", function () {

  console.log("Area system loaded");

  // -------------------------
  // CONFIG
  // -------------------------
  const PREFIX_REGEX = /^(tech-repairs|pc-repairs|laptop-repairs)-/;
  const SMALL_WORDS = ["on", "of", "in", "at", "by", "upon"];

  const areaAliasMap = {
    stockton: "stockton-on-tees",
    saltburn: "saltburn-by-the-sea"
  };

  const postcodeMap = {
    "stockton-on-tees": "TS18, TS19",
    "middlesbrough": "TS1–TS9",
    "billingham": "TS22, TS23",
    "thornaby": "TS17",
    "yarm": "TS15",
    "ingleby-barwick": "TS17",
    "redcar": "TS10",
    "saltburn-by-the-sea": "TS12",
    "guisborough": "TS14",
    "darlington": "DL1–DL3",
    "hartlepool": "TS24–TS27",
    "newton-aycliffe": "DL5",
    "stokesley": "TS9",
    "great-ayton": "TS9",
    "northallerton": "DL6–DL7"
  };

  const areaClusters = {
    "stockton-on-tees": ["norton","roseworth","hardwick","bishopsgarth","elm-tree","fairfield"],
    "middlesbrough": ["acklam","linthorpe","marton","ormesby","north-ormesby","beechwood"],
    "redcar-and-cleveland": ["marske","skelton","brotton","loftus","boosbeck","lingdale"],
    "darlington": ["hurworth","middleton-st-george","heighington","bishopton","sadberge","faverdale"],
    "hartlepool": ["seaton-carew","greatham","elwick","blackhall","hart","owton-manor"],
    "newton-aycliffe": ["school-aycliffe","aycliffe-village","middridge","shildon","coatham-mundeville","heighington"],
    "stokesley": ["great-broughton","hutton-rudby","easby","seamer","faceby","kirkby"],
    "great-ayton": ["easby","kildale","newby","old-ayton","little-ayton","dunsdale"],
    "northallerton": ["romanby","brompton","scruton","knayton","leeming-bar","north-otterington"],
    "ingleby-barwick": ["lowfields","myton","roundhill","broomhill","bassleton","the-broom"],
    "yarm": ["eaglescliffe","kirklevington","crathorne","urlay-nook","longnewton","hutton-rudby"],
    "thornaby": ["mandale","beckfields","thorntree","stainton","hemlington","bassleton"],
    "billingham": ["cowpen","wolviston","newton-bewley","seal-sands","greatham","elton"],
    "guisborough": ["pinchinthorpe","yearby","charltons","margrove-park","lingdale","boosbeck"],
    "saltburn-by-the-sea": ["skelton","brotton","loftus","carlin-how","skinningrove","ugthorpe"]
  };

  // ✅ SINGLE service list (fixed)
  const servicesList = [
    "Computer Repairs",
    "Laptop Repairs",
    "PC Repairs",
    "Mac Repairs",
    "Home IT Support",
    "Gaming PC Builds",
    "Software Installation",
    "Console Repairs"
  ];

  // -------------------------
  // GET LOCATION
  // -------------------------
  const file = window.location.pathname.split("/").pop().replace(".html", "");
  let locationPart = file.replace(PREFIX_REGEX, "");

  if (areaAliasMap[locationPart]) {
    locationPart = areaAliasMap[locationPart];
  }

  if (!locationPart) return;

  // -------------------------
  // HELPERS
  // -------------------------
  const formatName = (slug) =>
    slug.split("-").map((word, i) => {
      if (i !== 0 && SMALL_WORDS.includes(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(" ");

  const formatList = (arr) => {
    if (arr.length <= 1) return arr[0] || "";
    return arr.slice(0, -1).join(", ") + " and " + arr[arr.length - 1];
  };

  const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

  // -------------------------
  // HUB DETECTION
  // -------------------------
  let hubKey = null;

  Object.keys(areaClusters).forEach(key => {
    if (key === locationPart || areaClusters[key].includes(locationPart)) {
      hubKey = key;
    }
  });

  const normalizedHub = areaAliasMap[hubKey] || hubKey;

  // -------------------------
  // LOCATION OBJECT
  // -------------------------
  const LOCATION = {
    name: formatName(locationPart),
    short: formatName(locationPart).split(" ")[0],
    postcode: postcodeMap[locationPart] || "TS / DL"
  };

  // -------------------------
  // TEXT INJECTION
  // -------------------------
  const setText = (selector, value) => {
    document.querySelectorAll(selector).forEach(el => el.textContent = value);
  };

  setText(".locName", LOCATION.name);
  setText(".locShort", LOCATION.short);
  setText(".locPostcode", LOCATION.postcode);

  document.querySelectorAll(".locCluster").forEach(el => {
    const cluster = areaClusters[normalizedHub] || [];
    el.textContent = formatList(cluster.map(formatName));
  });

  // -------------------------
  // GRID (NO REPETITION)
  // -------------------------
  const grid = document.getElementById("areasGrid");

  if (grid) {
    const cluster = areaClusters[normalizedHub] || [];

    let list = cluster.filter(a => a !== locationPart);

    if (list.length < 6) {
      cluster.forEach(a => {
        if (!list.includes(a)) {
          list.push(a);
        }
      });
    }

    grid.innerHTML = "";

    // ✅ shuffle services once
    const shuffledServices = shuffle([...servicesList]);

    list.slice(0, 6).forEach((slug, index) => {
      const link = document.createElement("a");

      link.href = `/areas/tech-repairs-${slug}.html`;
      link.className = "area-card";

      const service = shuffledServices[index % shuffledServices.length];

      link.textContent = `${service} in ${formatName(slug)}`;

      grid.appendChild(link);
    });
  }

});