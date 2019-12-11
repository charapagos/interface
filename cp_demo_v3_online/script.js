//1-------------------------------
function onButtonClick() {
  //3
  var text = document.getElementById("message").value;
  var messageLog = document.getElementById("message-log");
  var para = document.createElement("p");
  para.innerHTML = text;
  messageLog.appendChild(para);
  messageLog.scrollTop = messageLog.scrollHeight;

  var matched = text.toLowerCase().match(words);
  console.log(matched.join("<br />"));

  var currentWords = document.getElementById("current-words");
  //currentWords.innerHTML = matched.join(" ");
  currentWords.innerHTML = text.replace(words, function (word) {
    return "<b>" + word + "</b>";
  });

  register(matched);
}

//1-------------------------------
function register(matched) {
  console.log("register", matched);
  //4,6,8
  var image = document.querySelector(".character .face");
  if (matched.length === 0) {
    image.src = imageUrl("default");
    // finished
  } else {
    image.src = imageUrl(resolve(matched[0]));
    image.addEventListener("load", function change() {
      image.removeEventListener("load", change, false);
      function slide() {
        register(matched.slice(1));
      }
      setTimeout(slide, 1000);
    }, false);
  }
}

function resolve(word) {
  return wordsEn[word] || wordsJa[word] || wordsZh[word] || wordsTh[word] || word;
}

function imageUrl(name) {
  var url = "character_data/" + location.hash.slice(1) + "/image/" + name + ".png";
  return url;
}

//1-------------------------------
window.addEventListener("load", function () {
  //2
  document.getElementById("run").addEventListener(
    "click", onButtonClick, false);

  var frame = document.createElement("div");
  frame.textContent = "FAILURE";
  frame.style.position = "fixed";
  frame.style.zIndex = 100;
  frame.style.top = frame.style.left = "0";
  frame.style.width = frame.style.height = "50%";
  frame.style.display = "none";
  document.querySelector(".character").appendChild(frame);

  var imageDefault = new Image();
  imageDefault.src = imageUrl("default");
  var imageError = new Image();
  imageError.src = imageUrl("annoy");

  var image = document.querySelector(".character .face");
  image.src = imageDefault.src;
  image.addEventListener("error", function failure(ev) {
    ev.target.src =
      (ev.target.src !== imageError.src ? imageError : imageDefault).src;
    frame.style.display = "block";

    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === "src") {
          frame.style.display = "none";
          observer.disconnect();
        }
      });
    })
    observer.observe(image, {attributes: true})
  }, false);
}, false);
